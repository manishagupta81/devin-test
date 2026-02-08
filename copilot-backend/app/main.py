import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, Action as CopilotAction

# Load environment variables
load_dotenv()

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Stock data for the dashboard
STOCK_DATA = {
    "AAPL": {"name": "Apple Inc.", "sector": "Technology"},
    "MSFT": {"name": "Microsoft Corporation", "sector": "Technology"},
    "GOOGL": {"name": "Alphabet Inc.", "sector": "Technology"},
    "AMZN": {"name": "Amazon.com Inc.", "sector": "Consumer Cyclical"},
    "META": {"name": "Meta Platforms Inc.", "sector": "Technology"},
    "NVDA": {"name": "NVIDIA Corporation", "sector": "Technology"},
    "AMD": {"name": "Advanced Micro Devices", "sector": "Technology"},
}

# Define backend actions for CopilotKit
async def get_stock_info(ticker: str):
    """Get information about a stock ticker."""
    ticker = ticker.upper()
    if ticker in STOCK_DATA:
        return {
            "ticker": ticker,
            "name": STOCK_DATA[ticker]["name"],
            "sector": STOCK_DATA[ticker]["sector"],
            "available": True
        }
    return {
        "ticker": ticker,
        "available": False,
        "message": f"Stock {ticker} not found. Available tickers: {', '.join(STOCK_DATA.keys())}"
    }

async def analyze_company(ticker: str, analysis_type: str = "general"):
    """Generate analysis for a company."""
    ticker = ticker.upper()
    if ticker not in STOCK_DATA:
        return {"error": f"Stock {ticker} not found"}
    
    company = STOCK_DATA[ticker]
    return {
        "ticker": ticker,
        "company": company["name"],
        "analysis_type": analysis_type,
        "summary": f"Analysis for {company['name']} ({ticker}) in the {company['sector']} sector.",
        "recommendation": "This is a placeholder analysis. The AI assistant will provide detailed insights based on the dashboard data."
    }

async def compare_companies(ticker1: str, ticker2: str):
    """Compare two companies."""
    ticker1 = ticker1.upper()
    ticker2 = ticker2.upper()
    
    if ticker1 not in STOCK_DATA:
        return {"error": f"Stock {ticker1} not found"}
    if ticker2 not in STOCK_DATA:
        return {"error": f"Stock {ticker2} not found"}
    
    return {
        "comparison": {
            "company1": {"ticker": ticker1, **STOCK_DATA[ticker1]},
            "company2": {"ticker": ticker2, **STOCK_DATA[ticker2]},
        },
        "summary": f"Comparison between {STOCK_DATA[ticker1]['name']} and {STOCK_DATA[ticker2]['name']}"
    }

# Create CopilotKit actions
get_stock_info_action = CopilotAction(
    name="getStockInfo",
    description="Get information about a stock ticker including company name and sector",
    parameters=[
        {
            "name": "ticker",
            "type": "string",
            "description": "The stock ticker symbol (e.g., AAPL, MSFT, GOOGL)",
            "required": True,
        }
    ],
    handler=get_stock_info
)

analyze_company_action = CopilotAction(
    name="analyzeCompany",
    description="Generate analysis for a company based on its ticker symbol",
    parameters=[
        {
            "name": "ticker",
            "type": "string",
            "description": "The stock ticker symbol to analyze",
            "required": True,
        },
        {
            "name": "analysis_type",
            "type": "string",
            "description": "Type of analysis: general, risk, investment, or competitive",
            "required": False,
        }
    ],
    handler=analyze_company
)

compare_companies_action = CopilotAction(
    name="compareCompanies",
    description="Compare two companies side by side",
    parameters=[
        {
            "name": "ticker1",
            "type": "string",
            "description": "First stock ticker symbol",
            "required": True,
        },
        {
            "name": "ticker2",
            "type": "string",
            "description": "Second stock ticker symbol",
            "required": True,
        }
    ],
    handler=compare_companies
)

# Initialize the CopilotKit SDK with actions
sdk = CopilotKitRemoteEndpoint(
    actions=[
        get_stock_info_action,
        analyze_company_action,
        compare_companies_action,
    ]
)

# Add the CopilotKit endpoint to FastAPI
add_fastapi_endpoint(app, sdk, "/copilotkit")

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "PRISM CopilotKit Backend",
        "endpoints": {
            "copilotkit": "/copilotkit",
            "health": "/healthz"
        }
    }
