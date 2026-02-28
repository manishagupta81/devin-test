import html
import os
import uuid
from datetime import datetime

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="GenAI Review Governance API")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# AWS config
AWS_REGION = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE", "genai_reviews")
COUNTER_TABLE = os.getenv("COUNTER_TABLE", "genai_counters")
SES_SENDER_EMAIL = os.getenv("SES_SENDER_EMAIL", "manishagupta81@gmail.com")
NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", "manishagupta81@gmail.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def get_dynamodb():
    return boto3.resource(
        "dynamodb",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
    )


def get_ses():
    return boto3.client(
        "ses",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
    )


def get_table():
    dynamodb = get_dynamodb()
    return dynamodb.Table(DYNAMODB_TABLE)


def get_counter_table():
    """Get or create counter table for auto-incrementing IDs."""
    dynamodb = get_dynamodb()
    client = boto3.client(
        "dynamodb",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
    )
    try:
        client.describe_table(TableName=COUNTER_TABLE)
    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceNotFoundException":
            client.create_table(
                TableName=COUNTER_TABLE,
                KeySchema=[{"AttributeName": "counter_name", "KeyType": "HASH"}],
                AttributeDefinitions=[{"AttributeName": "counter_name", "AttributeType": "S"}],
                BillingMode="PAY_PER_REQUEST",
            )
            waiter = client.get_waiter("table_exists")
            waiter.wait(TableName=COUNTER_TABLE)
        else:
            raise
    return dynamodb.Table(COUNTER_TABLE)


def get_next_sequence() -> int:
    """Atomically increment and return the next GR sequence number."""
    table = get_counter_table()
    response = table.update_item(
        Key={"counter_name": "submission_seq"},
        UpdateExpression="SET current_value = if_not_exists(current_value, :start) + :inc",
        ExpressionAttributeValues={":inc": 1, ":start": 0},
        ReturnValues="UPDATED_NEW",
    )
    return int(response["Attributes"]["current_value"])


def send_email(subject: str, body_html: str, to_email: str):
    ses = get_ses()
    try:
        ses.send_email(
            Source=SES_SENDER_EMAIL,
            Destination={"ToAddresses": [to_email]},
            Message={
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {"Html": {"Data": body_html, "Charset": "UTF-8"}},
            },
        )
        return True
    except Exception as e:
        print(f"Email send error: {e}")
        return False


# --- AI REVIEW AGENT ---

REQUIRED_FIELDS = [
    "projectName", "businessUnit", "requestType", "riskTier",
    "businessSponsor", "solutionType",
]

RECOMMENDED_FIELDS = [
    "requestorName", "requestorEmail", "department", "description",
    "businessJustification", "priority", "timeline", "riskAssessment",
]


def run_review_agent(submission: dict) -> dict:
    """
    AI Review Agent: assesses completeness, classifies into workflow lane,
    generates structured summary, and returns agent decision.
    """
    form_data = submission.get("form_data", {})
    logs = []
    now = datetime.utcnow().isoformat()

    missing_required = [f for f in REQUIRED_FIELDS if not form_data.get(f)]
    missing_recommended = [f for f in RECOMMENDED_FIELDS if not form_data.get(f)]

    logs.append({
        "timestamp": now,
        "action": "completeness_check",
        "detail": f"Required missing: {missing_required}, Recommended missing: {missing_recommended}",
    })

    risk_tier = form_data.get("riskTier", "")
    priority = form_data.get("priority", "Medium")
    risk_level = "High" if risk_tier == "tier1" else "Medium" if risk_tier == "tier2" else "Low"

    if len(missing_required) >= 2:
        lane = "needs_info"
        reason = f"Missing {len(missing_required)} required fields: {', '.join(missing_required)}"
    elif len(missing_required) == 1:
        lane = "needs_info"
        reason = f"Missing required field: {missing_required[0]}"
    elif risk_level == "Low" and len(missing_recommended) <= 2:
        lane = "ready_for_review"
        reason = "Low risk, mostly complete submission"
    elif risk_level == "High":
        lane = "ready_for_review"
        reason = "High risk submission requires thorough review"
    else:
        lane = "ready_for_review"
        reason = "Submission is complete enough for review"

    logs.append({
        "timestamp": now,
        "action": "lane_classification",
        "lane": lane,
        "reason": reason,
    })

    summary = {
        "submissionId": submission.get("submission_id", submission.get("id", "N/A")),
        "requestor": form_data.get("requestorName", form_data.get("businessSponsor", "N/A")),
        "department": form_data.get("department", form_data.get("businessUnit", "N/A")),
        "useCaseSummary": form_data.get("description", form_data.get("projectName", "N/A")),
        "businessImpact": form_data.get("businessJustification", "N/A"),
        "riskLevel": risk_level,
        "priority": priority,
        "missingInformation": missing_required + missing_recommended if lane == "needs_info" else [],
        "assignedLane": lane,
        "reason": reason,
    }

    logs.append({
        "timestamp": now,
        "action": "summary_generated",
        "summary": summary,
    })

    return {
        "lane": lane,
        "reason": reason,
        "risk_level": risk_level,
        "summary": summary,
        "missing_required": missing_required,
        "missing_recommended": missing_recommended,
        "logs": logs,
    }


# --- EMAIL BUILDERS ---

def build_requestor_summary_email(submission: dict, review_url: str) -> str:
    safe_review_url = html.escape(review_url)
    project = html.escape(submission.get("projectName", "N/A"))
    business_unit = html.escape(submission.get("businessUnit", "N/A"))
    solution_type = html.escape(submission.get("solutionType", "N/A"))
    request_type = html.escape(submission.get("requestType", "N/A"))
    business_sponsor = html.escape(submission.get("businessSponsor", "N/A"))
    risk_tier = html.escape(submission.get("riskTier", "N/A"))
    biz_obj = submission.get("bizObj", [])
    if isinstance(biz_obj, list):
        biz_obj = html.escape(", ".join(str(item) for item in biz_obj))
    else:
        biz_obj = html.escape(str(biz_obj))

    return f"""
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f4f8; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1e3a5f, #1a56db); color: white; padding: 24px;">
          <h1 style="margin: 0; font-size: 1.3rem;">GenAI Review - New Submission</h1>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 0.85rem;">A new review request has been submitted and requires your attention</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="font-size: 1rem; color: #1e293b; margin-bottom: 16px;">Submission Summary</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 160px;">Project Name</td>
              <td style="padding: 10px 0; color: #1e293b;">{project}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Business Unit</td>
              <td style="padding: 10px 0; color: #1e293b;">{business_unit}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Solution Type</td>
              <td style="padding: 10px 0; color: #1e293b;">{solution_type}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Request Type</td>
              <td style="padding: 10px 0; color: #1e293b;">{request_type}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Business Sponsor</td>
              <td style="padding: 10px 0; color: #1e293b;">{business_sponsor}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Risk Tier</td>
              <td style="padding: 10px 0; color: #1e293b;">{risk_tier}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Business Objectives</td>
              <td style="padding: 10px 0; color: #1e293b;">{biz_obj}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="{safe_review_url}" style="display: inline-block; background: linear-gradient(135deg, #0d9488, #0f766e); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Open Review Form</a>
          </div>
          <p style="margin-top: 16px; font-size: 0.78rem; color: #64748b; text-align: center;">
            Please review the submission and provide your compliance, legal, and security assessment.
          </p>
        </div>
      </div>
    </body>
    </html>
    """


def build_reviewer_summary_email(submission: dict, reviews: dict, approve_url: str) -> str:
    safe_approve_url = html.escape(approve_url)
    project = html.escape(submission.get("projectName", "N/A"))
    business_unit = html.escape(submission.get("businessUnit", "N/A"))
    risk_tier = html.escape(submission.get("riskTier", "N/A"))

    review_sections = ""
    for reviewer_type, review_data in reviews.items():
        reviewer_name = html.escape(review_data.get("reviewerName", "N/A"))
        decision = html.escape(review_data.get("recommendation", "N/A"))
        notes = html.escape(review_data.get("notes", "N/A"))
        color = "#15803d" if decision == "approve" else "#dc2626" if decision == "reject" else "#a16207"
        review_sections += f"""
        <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 12px;">
          <h3 style="font-size: 0.9rem; color: #1e293b; margin: 0 0 8px;">{reviewer_type.title()} Review</h3>
          <p style="font-size: 0.82rem; margin: 4px 0;"><strong>Reviewer:</strong> {reviewer_name}</p>
          <p style="font-size: 0.82rem; margin: 4px 0;"><strong>Recommendation:</strong> <span style="color: {color}; font-weight: 700;">{decision.upper()}</span></p>
          <p style="font-size: 0.82rem; margin: 4px 0;"><strong>Notes:</strong> {notes}</p>
        </div>
        """

    return f"""
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f4f8; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #7e22ce, #6b21a8); color: white; padding: 24px;">
          <h1 style="margin: 0; font-size: 1.3rem;">GenAI Review - Ready for Approval</h1>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 0.85rem;">All reviews are complete. Your approval is required.</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="font-size: 1rem; color: #1e293b; margin-bottom: 8px;">Project: {project}</h2>
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 16px;">Business Unit: {business_unit} | Risk Tier: {risk_tier}</p>
          <h3 style="font-size: 0.95rem; color: #1e293b; margin-bottom: 12px;">Review Summary</h3>
          {review_sections}
          <div style="margin-top: 24px; text-align: center;">
            <a href="{safe_approve_url}" style="display: inline-block; background: linear-gradient(135deg, #7e22ce, #6b21a8); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Open Approval Form</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    """


def build_needs_info_email(submission: dict, agent_result: dict) -> str:
    """Email to requestor when required info is missing."""
    form_data = submission.get("form_data", {})
    sub_id = html.escape(str(submission.get("submission_id", submission.get("id", "N/A"))))
    project = html.escape(form_data.get("projectName", "N/A"))
    missing = agent_result.get("missing_required", []) + agent_result.get("missing_recommended", [])
    missing_html = "".join(f"<li>{html.escape(f)}</li>" for f in missing)
    reason = html.escape(agent_result.get("reason", ""))

    return f"""
    <html>
    <body style="font-family: Georgia, serif; background: #F5F3EF; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1B6B3A, #145a2e); color: white; padding: 24px;">
          <h1 style="margin: 0; font-size: 1.3rem;">Action Required: Additional Information Needed</h1>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 0.85rem;">Submission {sub_id}</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="font-size: 1rem; color: #1e293b;">Project: {project}</h2>
          <p style="font-size: 0.85rem; color: #64748b;">{reason}</p>
          <h3 style="font-size: 0.95rem; color: #1e293b;">Missing Information:</h3>
          <ul style="font-size: 0.85rem; color: #dc2626;">{missing_html}</ul>
          <p style="font-size: 0.85rem; color: #64748b;">Please update your submission with the missing information to proceed with the review process.</p>
        </div>
      </div>
    </body>
    </html>
    """


def build_agent_review_email(submission: dict, agent_result: dict) -> str:
    """Email to reviewer when submission is complete and ready for review."""
    summary = agent_result.get("summary", {})
    sub_id = html.escape(str(summary.get("submissionId", "N/A")))
    requestor = html.escape(str(summary.get("requestor", "N/A")))
    department = html.escape(str(summary.get("department", "N/A")))
    use_case = html.escape(str(summary.get("useCaseSummary", "N/A")))
    impact = html.escape(str(summary.get("businessImpact", "N/A")))
    risk = html.escape(str(summary.get("riskLevel", "N/A")))
    priority = html.escape(str(summary.get("priority", "N/A")))
    lane = html.escape(str(summary.get("assignedLane", "N/A")))
    reason = html.escape(str(summary.get("reason", "N/A")))
    review_url = html.escape(f"{FRONTEND_URL}?review={submission.get('id', '')}")

    return f"""
    <html>
    <body style="font-family: Georgia, serif; background: #F5F3EF; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1B6B3A, #145a2e); color: white; padding: 24px;">
          <h1 style="margin: 0; font-size: 1.3rem;">Review Requested: {sub_id}</h1>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 0.85rem;">AI Agent has classified this submission as Ready for Review</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="font-size: 1rem; color: #1e293b; margin-bottom: 16px;">Structured Summary</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 150px;">Submission ID</td><td style="padding: 8px 0; color: #1e293b;">{sub_id}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Requestor</td><td style="padding: 8px 0; color: #1e293b;">{requestor}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Department</td><td style="padding: 8px 0; color: #1e293b;">{department}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Use Case</td><td style="padding: 8px 0; color: #1e293b;">{use_case}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Business Impact</td><td style="padding: 8px 0; color: #1e293b;">{impact}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Risk Level</td><td style="padding: 8px 0; color: #1e293b;">{risk}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Priority</td><td style="padding: 8px 0; color: #1e293b;">{priority}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Assigned Lane</td><td style="padding: 8px 0; color: #1e293b;">{lane}</td></tr>
          </table>
          <p style="margin-top: 12px; font-size: 0.82rem; color: #64748b;"><strong>Reason:</strong> {reason}</p>
          <div style="margin-top: 24px; text-align: center;">
            <a href="{review_url}" style="display: inline-block; background: linear-gradient(135deg, #1B6B3A, #145a2e); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Open Review Form</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    """


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.post("/api/submissions")
async def create_submission(request: Request):
    """Requestor submits the form. Generates GR-{seq} ID, runs AI agent, routes emails."""
    data = await request.json()
    seq = get_next_sequence()
    submission_id = f"GR-{seq}"
    now = datetime.utcnow().isoformat()

    item = {
        "id": submission_id,
        "submission_id": submission_id,
        "status": "submitted",
        "created_at": now,
        "updated_at": now,
        "form_data": data,
        "reviews": {
            "compliance": {"status": "pending"},
            "legal": {"status": "pending"},
            "security": {"status": "pending"},
        },
        "approval": None,
        "agent_logs": [],
        "workflow_lane": "submitted",
        "event_log": [{"timestamp": now, "event": "submission_created"}],
    }

    table = get_table()
    table.put_item(Item=item)

    # Run AI Review Agent
    agent_result = None
    try:
        agent_result = run_review_agent(item)
        lane = agent_result["lane"]

        # Update submission with agent results
        table.update_item(
            Key={"id": submission_id},
            UpdateExpression="SET workflow_lane = :lane, agent_logs = :logs, agent_summary = :summary, updated_at = :u",
            ExpressionAttributeValues={
                ":lane": lane,
                ":logs": agent_result["logs"],
                ":summary": agent_result["summary"],
                ":u": now,
            },
        )

        # Smart email routing based on agent decision
        if lane == "needs_info":
            email_html = build_needs_info_email(item, agent_result)
            requestor_email = data.get("requestorEmail", NOTIFY_EMAIL)
            subject = f"Action Required: Additional Information Needed for {submission_id}"
            sent = send_email(
                subject=subject,
                body_html=email_html,
                to_email=requestor_email,
            )
            table.update_item(
                Key={"id": submission_id},
                UpdateExpression="SET event_log = list_append(if_not_exists(event_log, :empty), :events)",
                ExpressionAttributeValues={
                    ":empty": [],
                    ":events": [
                        {"timestamp": now, "event": "agent_decision", "lane": lane, "reason": agent_result.get("reason", "")},
                        {"timestamp": now, "event": "email_sent", "to": requestor_email, "subject": subject, "success": bool(sent)},
                    ],
                },
            )
        else:
            email_html = build_agent_review_email(item, agent_result)
            subject = f"Review Requested: {submission_id} - Summary"
            sent = send_email(
                subject=subject,
                body_html=email_html,
                to_email=NOTIFY_EMAIL,
            )
            table.update_item(
                Key={"id": submission_id},
                UpdateExpression="SET event_log = list_append(if_not_exists(event_log, :empty), :events)",
                ExpressionAttributeValues={
                    ":empty": [],
                    ":events": [
                        {"timestamp": now, "event": "agent_decision", "lane": lane, "reason": agent_result.get("reason", "")},
                        {"timestamp": now, "event": "email_sent", "to": NOTIFY_EMAIL, "subject": subject, "success": bool(sent)},
                    ],
                },
            )
    except Exception as e:
        print(f"Agent/email error: {e}")
        # Fallback: send standard reviewer email
        try:
            review_url = f"{FRONTEND_URL}?review={submission_id}"
            email_html = build_requestor_summary_email(data, review_url)
            sent = send_email(
                subject=f"GenAI Review Request: {data.get('projectName', 'New Submission')}",
                body_html=email_html,
                to_email=NOTIFY_EMAIL,
            )
            table.update_item(
                Key={"id": submission_id},
                UpdateExpression="SET event_log = list_append(if_not_exists(event_log, :empty), :events)",
                ExpressionAttributeValues={
                    ":empty": [],
                    ":events": [
                        {
                            "timestamp": now,
                            "event": "email_sent",
                            "to": NOTIFY_EMAIL,
                            "subject": f"GenAI Review Request: {data.get('projectName', 'New Submission')}",
                            "success": bool(sent),
                        }
                    ],
                },
            )
        except Exception as e2:
            print(f"Fallback email error: {e2}")

    return {
        "id": submission_id,
        "status": "submitted",
        "workflow_lane": agent_result["lane"] if agent_result else "submitted",
        "agent_summary": agent_result["summary"] if agent_result else None,
        "message": "Submission saved and processed by AI Review Agent.",
    }


@app.get("/api/submissions")
async def list_submissions():
    """List all submissions with workflow lane info for Kanban dashboard."""
    table = get_table()
    response = table.scan()
    items = response.get("Items", [])
    result = []
    for item in items:
        form_data = item.get("form_data", {})
        result.append({
            "id": item["id"],
            "submission_id": item.get("submission_id", item["id"]),
            "status": item.get("status", "unknown"),
            "workflow_lane": item.get("workflow_lane", item.get("status", "submitted")),
            "projectName": form_data.get("projectName", "N/A"),
            "businessUnit": form_data.get("businessUnit", "N/A"),
            "department": form_data.get("department", form_data.get("businessUnit", "N/A")),
            "requestType": form_data.get("requestType", "N/A"),
            "riskTier": form_data.get("riskTier", "N/A"),
            "priority": form_data.get("priority", "Medium"),
            "requestorName": form_data.get("requestorName", form_data.get("businessSponsor", "N/A")),
            "created_at": item.get("created_at", ""),
        })
    # Sort by created_at descending
    result.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return result


@app.get("/api/submissions/{submission_id}")
async def get_submission(submission_id: str):
    """Get full submission details."""
    table = get_table()
    response = table.get_item(Key={"id": submission_id})
    item = response.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Submission not found")
    return item


@app.post("/api/submissions/{submission_id}/reviews/{review_type}")
async def submit_review(submission_id: str, review_type: str, request: Request):
    """Reviewer submits their review (compliance, legal, or security)."""
    if review_type not in ("compliance", "legal", "security"):
        raise HTTPException(status_code=400, detail="Invalid review type. Must be compliance, legal, or security.")

    data = await request.json()
    table = get_table()

    response = table.get_item(Key={"id": submission_id})
    item = response.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Submission not found")

    reviews = item.get("reviews", {})
    reviews[review_type] = {
        "status": "completed",
        "reviewerName": data.get("reviewerName", ""),
        "reviewDate": data.get("reviewDate", datetime.utcnow().isoformat()),
        "recommendation": data.get("recommendation", ""),
        "notes": data.get("reviewNotes", data.get("notes", "")),
        "findings": data.get("findings", {}),
    }

    now = datetime.utcnow().isoformat()
    table.update_item(
        Key={"id": submission_id},
        UpdateExpression="SET reviews.#rt = :rd, updated_at = :u",
        ExpressionAttributeNames={"#rt": review_type},
        ExpressionAttributeValues={":rd": reviews[review_type], ":u": now},
    )

    # Re-fetch to get current state of all reviews (consistent read to avoid stale data)
    response = table.get_item(Key={"id": submission_id}, ConsistentRead=True)
    item = response.get("Item", {})
    reviews = item.get("reviews", {})

    # Check if all reviews are complete
    all_complete = all(
        reviews.get(rt, {}).get("status") == "completed"
        for rt in ("compliance", "legal", "security")
    )

    if all_complete:
        # Atomic conditional update to prevent duplicate approval emails
        try:
            table.update_item(
                Key={"id": submission_id},
                UpdateExpression="SET #s = :s, updated_at = :u",
                ExpressionAttributeNames={"#s": "status"},
                ExpressionAttributeValues={":s": "reviewed", ":u": now, ":expected": "submitted"},
                ConditionExpression="#s = :expected",
            )
        except ClientError as e:
            if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
                # Another request already transitioned the status; skip email
                return {
                    "message": f"{review_type.title()} review submitted.",
                    "all_reviews_complete": all_complete,
                }
            raise

        try:
            approve_url = f"{FRONTEND_URL}?approve={submission_id}"
            form_data = item.get("form_data", {})
            email_html = build_reviewer_summary_email(form_data, reviews, approve_url)
            send_email(
                subject=f"GenAI Review Ready for Approval: {form_data.get('projectName', 'Submission')}",
                body_html=email_html,
                to_email=NOTIFY_EMAIL,
            )
        except Exception as e:
            print(f"Email notification error: {e}")

    return {
        "message": f"{review_type.title()} review submitted.",
        "all_reviews_complete": all_complete,
    }


@app.post("/api/submissions/{submission_id}/approve")
async def approve_submission(submission_id: str, request: Request):
    """Approver submits final decision."""
    data = await request.json()
    table = get_table()

    response = table.get_item(Key={"id": submission_id})
    item = response.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Submission not found")

    now = datetime.utcnow().isoformat()
    approval = {
        "status": "completed",
        "decision": data.get("decision", ""),
        "approverName": data.get("approverName", ""),
        "approverTitle": data.get("approverTitle", ""),
        "approverSignature": data.get("approverSignature", ""),
        "approveDate": data.get("approveDate", now),
        "conditions": data.get("conditions", ""),
        "mitigations": data.get("mitigations", ""),
        "ratings": data.get("ratings", {}),
        "reReviewFreq": data.get("reReviewFreq", ""),
        "nextReviewDate": data.get("nextReviewDate", ""),
        "rereviewTriggers": data.get("rereviewTriggers", ""),
    }

    decision_status = data.get("decision", "pending")
    if decision_status not in ("approved", "rejected", "conditional"):
        raise HTTPException(
            status_code=400,
            detail="Invalid decision. Must be approved, rejected, or conditional.",
        )

    # Update workflow_lane based on decision
    lane = "approved" if decision_status in ("approved", "conditional") else "rejected"

    table.update_item(
        Key={"id": submission_id},
        UpdateExpression="SET approval = :a, #s = :s, workflow_lane = :lane, updated_at = :u",
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={":a": approval, ":s": decision_status, ":lane": lane, ":u": now},
    )

    # Send confirmation email (wrapped in try/except so approval succeeds even if email fails)
    try:
        form_data = item.get("form_data", {})
        decision_label = html.escape(data.get("decision", "N/A").upper())
        safe_project = html.escape(form_data.get("projectName", "N/A"))
        safe_approver = html.escape(data.get("approverName", "N/A"))
        color = "#15803d" if data.get("decision") == "approved" else "#dc2626" if data.get("decision") == "rejected" else "#a16207"

        email_html = f"""
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f4f8; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #1e3a5f, #1a56db); color: white; padding: 24px;">
              <h1 style="margin: 0; font-size: 1.3rem;">GenAI Review - Decision Made</h1>
            </div>
            <div style="padding: 24px; text-align: center;">
              <h2 style="font-size: 1.1rem; color: #1e293b;">{safe_project}</h2>
              <div style="display: inline-block; background: {color}; color: white; padding: 8px 24px; border-radius: 20px; font-weight: 700; font-size: 1rem; margin: 16px 0;">
                {decision_label}
              </div>
              <p style="font-size: 0.85rem; color: #64748b;">Approved by: {safe_approver} on {now[:10]}</p>
            </div>
          </div>
        </body>
        </html>
        """

        send_email(
            subject=f"GenAI Review Decision: {form_data.get('projectName', 'Submission')} - {decision_label}",
            body_html=email_html,
            to_email=NOTIFY_EMAIL,
        )
    except Exception as e:
        print(f"Email notification error: {e}")

    return {"message": "Approval decision submitted.", "decision": data.get("decision")}


# --- AGENT ENDPOINTS ---

@app.post("/api/agent/review/{submission_id}")
async def trigger_agent_review(submission_id: str):
    """Manually trigger AI Review Agent on an existing submission."""
    table = get_table()
    response = table.get_item(Key={"id": submission_id})
    item = response.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Submission not found")

    agent_result = run_review_agent(item)
    now = datetime.utcnow().isoformat()

    # Append new logs to existing logs
    existing_logs = item.get("agent_logs", [])
    if isinstance(existing_logs, list):
        all_logs = existing_logs + agent_result["logs"]
    else:
        all_logs = agent_result["logs"]

    table.update_item(
        Key={"id": submission_id},
        UpdateExpression="SET workflow_lane = :lane, agent_logs = :logs, agent_summary = :summary, updated_at = :u",
        ExpressionAttributeValues={
            ":lane": agent_result["lane"],
            ":logs": all_logs,
            ":summary": agent_result["summary"],
            ":u": now,
        },
    )

    # Smart email routing
    form_data = item.get("form_data", {})
    try:
        if agent_result["lane"] == "needs_info":
            email_html = build_needs_info_email(item, agent_result)
            requestor_email = form_data.get("requestorEmail", NOTIFY_EMAIL)
            subject = f"Action Required: Additional Information Needed for {submission_id}"
            sent = send_email(
                subject=subject,
                body_html=email_html,
                to_email=requestor_email,
            )
            table.update_item(
                Key={"id": submission_id},
                UpdateExpression="SET event_log = list_append(if_not_exists(event_log, :empty), :events)",
                ExpressionAttributeValues={
                    ":empty": [],
                    ":events": [
                        {
                            "timestamp": now,
                            "event": "agent_decision",
                            "lane": agent_result["lane"],
                            "reason": agent_result.get("reason", ""),
                        },
                        {"timestamp": now, "event": "email_sent", "to": requestor_email, "subject": subject, "success": bool(sent)},
                    ],
                },
            )
        else:
            email_html = build_agent_review_email(item, agent_result)
            subject = f"Review Requested: {submission_id} - Summary"
            sent = send_email(
                subject=subject,
                body_html=email_html,
                to_email=NOTIFY_EMAIL,
            )
            table.update_item(
                Key={"id": submission_id},
                UpdateExpression="SET event_log = list_append(if_not_exists(event_log, :empty), :events)",
                ExpressionAttributeValues={
                    ":empty": [],
                    ":events": [
                        {
                            "timestamp": now,
                            "event": "agent_decision",
                            "lane": agent_result["lane"],
                            "reason": agent_result.get("reason", ""),
                        },
                        {"timestamp": now, "event": "email_sent", "to": NOTIFY_EMAIL, "subject": subject, "success": bool(sent)},
                    ],
                },
            )
    except Exception as e:
        print(f"Agent email error: {e}")

    return {
        "submission_id": submission_id,
        "lane": agent_result["lane"],
        "reason": agent_result["reason"],
        "summary": agent_result["summary"],
    }


@app.get("/api/agent/logs/{submission_id}")
async def get_agent_logs(submission_id: str):
    """Get agent decision logs for a submission."""
    table = get_table()
    response = table.get_item(Key={"id": submission_id})
    item = response.get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Submission not found")

    return {
        "submission_id": submission_id,
        "workflow_lane": item.get("workflow_lane", "unknown"),
        "agent_logs": item.get("agent_logs", []),
        "agent_summary": item.get("agent_summary", None),
    }
