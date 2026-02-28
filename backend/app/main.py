import os
import uuid
from datetime import datetime
from typing import Optional

import boto3
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


def build_requestor_summary_email(submission: dict, review_url: str) -> str:
    project = submission.get("projectName", "N/A")
    business_unit = submission.get("businessUnit", "N/A")
    solution_type = submission.get("solutionType", "N/A")
    request_type = submission.get("requestType", "N/A")
    business_sponsor = submission.get("businessSponsor", "N/A")
    risk_tier = submission.get("riskTier", "N/A")
    biz_obj = submission.get("bizObj", [])
    if isinstance(biz_obj, list):
        biz_obj = ", ".join(biz_obj)

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
            <a href="{review_url}" style="display: inline-block; background: linear-gradient(135deg, #0d9488, #0f766e); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Open Review Form</a>
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
    project = submission.get("projectName", "N/A")
    business_unit = submission.get("businessUnit", "N/A")
    risk_tier = submission.get("riskTier", "N/A")

    review_sections = ""
    for reviewer_type, review_data in reviews.items():
        reviewer_name = review_data.get("reviewerName", "N/A")
        decision = review_data.get("recommendation", "N/A")
        notes = review_data.get("notes", "N/A")
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
            <a href="{approve_url}" style="display: inline-block; background: linear-gradient(135deg, #7e22ce, #6b21a8); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Open Approval Form</a>
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
    """Requestor submits the form (Tabs 0-9). Stores in DynamoDB and sends email to reviewer."""
    data = await request.json()
    submission_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    item = {
        "id": submission_id,
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
    }

    table = get_table()
    table.put_item(Item=item)

    # Send email to reviewer
    review_url = f"{FRONTEND_URL}?review={submission_id}"
    email_html = build_requestor_summary_email(data, review_url)
    send_email(
        subject=f"GenAI Review Request: {data.get('projectName', 'New Submission')}",
        body_html=email_html,
        to_email=NOTIFY_EMAIL,
    )

    return {"id": submission_id, "status": "submitted", "message": "Submission saved and reviewer notified."}


@app.get("/api/submissions")
async def list_submissions():
    """List all submissions."""
    table = get_table()
    response = table.scan()
    items = response.get("Items", [])
    result = []
    for item in items:
        form_data = item.get("form_data", {})
        result.append({
            "id": item["id"],
            "status": item.get("status", "unknown"),
            "projectName": form_data.get("projectName", "N/A"),
            "businessUnit": form_data.get("businessUnit", "N/A"),
            "requestType": form_data.get("requestType", "N/A"),
            "riskTier": form_data.get("riskTier", "N/A"),
            "created_at": item.get("created_at", ""),
        })
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

    # Re-fetch to get current state of all reviews (avoids race condition)
    response = table.get_item(Key={"id": submission_id})
    item = response.get("Item", {})
    reviews = item.get("reviews", {})

    # Check if all reviews are complete
    all_complete = all(
        reviews.get(rt, {}).get("status") == "completed"
        for rt in ("compliance", "legal", "security")
    )

    if all_complete:
        table.update_item(
            Key={"id": submission_id},
            UpdateExpression="SET #s = :s, updated_at = :u",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={":s": "reviewed", ":u": now},
        )

        approve_url = f"{FRONTEND_URL}?approve={submission_id}"
        form_data = item.get("form_data", {})
        email_html = build_reviewer_summary_email(form_data, reviews, approve_url)
        send_email(
            subject=f"GenAI Review Ready for Approval: {form_data.get('projectName', 'Submission')}",
            body_html=email_html,
            to_email=NOTIFY_EMAIL,
        )

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

    table.update_item(
        Key={"id": submission_id},
        UpdateExpression="SET approval = :a, #s = :s, updated_at = :u",
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={":a": approval, ":s": decision_status, ":u": now},
    )

    # Send confirmation email
    form_data = item.get("form_data", {})
    decision_label = data.get("decision", "N/A").upper()
    color = "#15803d" if data.get("decision") == "approved" else "#dc2626" if data.get("decision") == "rejected" else "#a16207"

    email_html = f"""
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f4f8; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1e3a5f, #1a56db); color: white; padding: 24px;">
          <h1 style="margin: 0; font-size: 1.3rem;">GenAI Review - Decision Made</h1>
        </div>
        <div style="padding: 24px; text-align: center;">
          <h2 style="font-size: 1.1rem; color: #1e293b;">{form_data.get('projectName', 'N/A')}</h2>
          <div style="display: inline-block; background: {color}; color: white; padding: 8px 24px; border-radius: 20px; font-weight: 700; font-size: 1rem; margin: 16px 0;">
            {decision_label}
          </div>
          <p style="font-size: 0.85rem; color: #64748b;">Approved by: {data.get('approverName', 'N/A')} on {now[:10]}</p>
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

    return {"message": "Approval decision submitted.", "decision": data.get("decision")}
