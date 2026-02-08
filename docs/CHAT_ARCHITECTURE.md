# PRISM Chat Architecture - AG-UI Integration with CopilotKit

This document provides a comprehensive overview of the AG-UI chat integration implemented in the PRISM dashboard using CopilotKit.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Frontend Implementation](#frontend-implementation)
5. [Backend Implementation](#backend-implementation)
6. [Human-in-the-Loop (HITL)](#human-in-the-loop-hitl)
7. [Suggested Question Chips](#suggested-question-chips)
8. [Deployment](#deployment)
9. [Configuration](#configuration)
10. [API Reference](#api-reference)

## Overview

The PRISM chat feature is built using the AG-UI (Agent-User Interaction) protocol through CopilotKit. AG-UI is an open, lightweight, event-based protocol that standardizes how AI agents connect to user interfaces, enabling real-time streaming, tool calls, state management, and human-in-the-loop interactions.

### Key Features

- **Real-time Streaming**: Responses are streamed as they're generated, providing immediate feedback
- **Suggested Question Chips**: Dynamic clickable suggestions for guided interactions
- **Human-in-the-Loop Approval**: Built-in approval workflows for sensitive actions
- **Context-Aware Chat**: The assistant has access to dashboard state (selected ticker, available companies)
- **Backend Actions**: Server-side tools for stock analysis, company comparison, and data retrieval

## Architecture Diagram

```
+-----------------------------------------------------------------------------+
|                              PRISM Dashboard                                 |
|  +---------------------------------------------------------------------+    |
|  |                         React Frontend                               |    |
|  |  +-----------------+  +-----------------+  +---------------------+   |    |
|  |  |   App.tsx       |  | CompanyDashboard|  |   CopilotChat.tsx   |   |    |
|  |  | (CopilotKit     |  | (Dashboard UI)  |  | (Chat Interface)    |   |    |
|  |  |  Provider)      |  |                 |  |                     |   |    |
|  |  +--------+--------+  +--------+--------+  +----------+----------+   |    |
|  |           |                    |                      |              |    |
|  |           +--------------------+----------------------+              |    |
|  |                                |                                     |    |
|  |                    DashboardStateContext                             |    |
|  |                    (selectedTicker, setSelectedTicker)               |    |
|  +---------------------------------------------------------------------+    |
|                                   |                                          |
|                                   | HTTPS (AG-UI Protocol)                   |
|                                   v                                          |
|  +---------------------------------------------------------------------+    |
|  |                    FastAPI Backend (Fly.io)                          |    |
|  |  +---------------------------------------------------------------+   |    |
|  |  |              CopilotKit Remote Endpoint                        |   |    |
|  |  |  +-------------+  +-------------+  +---------------------+     |   |    |
|  |  |  |getStockInfo |  |analyzeCompany|  | compareCompanies   |     |   |    |
|  |  |  |   Action    |  |   Action     |  |     Action         |     |   |    |
|  |  |  +-------------+  +-------------+  +---------------------+     |   |    |
|  |  +---------------------------------------------------------------+   |    |
|  +---------------------------------------------------------------------+    |
|                                   |                                          |
|                                   | API Calls                                |
|                                   v                                          |
|  +---------------------------------------------------------------------+    |
|  |                         OpenAI API                                   |    |
|  |                    (GPT-4o for LLM responses)                        |    |
|  +---------------------------------------------------------------------+    |
+-----------------------------------------------------------------------------+
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI v7** - Component library
- **@copilotkit/react-core** (v1.3.15) - CopilotKit React integration
- **@copilotkit/react-ui** (v1.3.15) - Pre-built chat UI components

### Backend
- **FastAPI** - Python web framework
- **CopilotKit Python SDK** (v0.1.78) - Backend integration
- **OpenAI API** - LLM provider (GPT-4o)
- **Fly.io** - Backend hosting

## Frontend Implementation

### CopilotKit Provider (App.tsx)

The application is wrapped with the `CopilotKit` provider which connects to the backend runtime:

```typescript
import { CopilotKit } from '@copilotkit/react-core';

const getRuntimeUrl = () => {
  // Use the deployed FastAPI backend on Fly.io
  return 'https://app-iuirfrrz.fly.dev/copilotkit';
};

function App() {
  return (
    <CopilotKit runtimeUrl={getRuntimeUrl()} showDevConsole={false}>
      <DashboardStateContext.Provider value={{ selectedTicker, setSelectedTicker }}>
        {/* App content */}
      </DashboardStateContext.Provider>
    </CopilotKit>
  );
}
```

### Dashboard State Context

A React context shares dashboard state between components:

```typescript
export interface DashboardContext {
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
}

export const DashboardStateContext = React.createContext<DashboardContext | null>(null);
```

### CopilotChat Component (CopilotChat.tsx)

The chat component provides:

1. **CopilotPopup** - The chat UI interface
2. **useCopilotReadable** - Exposes dashboard state to the AI
3. **SuggestionChips** - Quick action buttons
4. **ApprovalDialog** - HITL approval modal

```typescript
import { CopilotPopup } from '@copilotkit/react-ui';
import { useCopilotReadable } from '@copilotkit/react-core';

function CopilotChat() {
  const dashboardState = useContext(DashboardStateContext);
  
  // Expose dashboard state to the AI
  useCopilotReadable({
    description: 'The currently selected stock ticker',
    value: dashboardState?.selectedTicker || 'AAPL',
  });

  return (
    <>
      <CopilotPopup
        labels={{
          title: 'PRISM Research Intelligence',
          initial: 'How can I help you analyze your portfolio today?',
        }}
      />
      <SuggestionChips onSuggestionClick={handleSuggestionClick} />
      <ApprovalDialog {...approvalState} />
    </>
  );
}
```

## Backend Implementation

### FastAPI Server (copilot-backend/app/main.py)

The backend uses the CopilotKit Python SDK to create a remote endpoint:

```python
from fastapi import FastAPI
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, Action as CopilotAction

app = FastAPI()

# Define backend actions
async def get_stock_info(ticker: str):
    """Get information about a stock ticker."""
    # Implementation...

async def analyze_company(ticker: str, analysis_type: str = "general"):
    """Generate analysis for a company."""
    # Implementation...

async def compare_companies(ticker1: str, ticker2: str):
    """Compare two companies."""
    # Implementation...

# Create CopilotKit actions
get_stock_info_action = CopilotAction(
    name="getStockInfo",
    description="Get information about a stock ticker",
    parameters=[
        {"name": "ticker", "type": "string", "required": True}
    ],
    handler=get_stock_info
)

# Initialize the CopilotKit SDK
sdk = CopilotKitRemoteEndpoint(
    actions=[
        get_stock_info_action,
        analyze_company_action,
        compare_companies_action,
    ]
)

# Add the CopilotKit endpoint
add_fastapi_endpoint(app, sdk, "/copilotkit")
```

### Backend Actions

| Action | Description | Parameters |
|--------|-------------|------------|
| `getStockInfo` | Get stock ticker information | `ticker` (string) |
| `analyzeCompany` | Generate company analysis | `ticker` (string), `analysis_type` (optional) |
| `compareCompanies` | Compare two companies | `ticker1` (string), `ticker2` (string) |

## Human-in-the-Loop (HITL)

The HITL feature provides approval workflows for sensitive actions. When triggered, users see a modal dialog with action details and Approve/Reject buttons.

### Implementation

```typescript
interface ApprovalState {
  open: boolean;
  title: string;
  description: string;
  onApprove: () => void;
  onReject: () => void;
}

const ApprovalDialog: React.FC<ApprovalState> = ({
  open, title, description, onApprove, onReject
}) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{description}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onReject} startIcon={<Cancel />}>Reject</Button>
      <Button onClick={onApprove} startIcon={<CheckCircle />}>Approve</Button>
    </DialogActions>
  </Dialog>
);
```

### HITL Triggers

The following actions trigger HITL approval:

1. **Investment Thesis Generation** - "Generate investment thesis for [TICKER]"
2. **Competitor Comparison** - "Compare [TICKER] with competitors"
3. **Trade Analysis** - Any trade-related recommendations
4. **Report Generation** - Generating detailed investment reports

## Suggested Question Chips

Dynamic suggestion chips provide quick access to common queries:

### Available Suggestions

| Chip | Query | Icon |
|------|-------|------|
| Analyze [TICKER] | "Analyze [selected ticker] stock performance" | TrendingUp |
| Compare competitors | "Compare [ticker] with its main competitors" | Compare |
| Show risk factors | "What are the key risk factors for [ticker]?" | Warning |
| Investment thesis | "Generate an investment thesis for [ticker]" | Lightbulb |
| Market outlook | "What's the market outlook for [ticker]'s sector?" | Assessment |

### Implementation

```typescript
const suggestions = [
  {
    label: `Analyze ${selectedTicker}`,
    query: `Analyze ${selectedTicker} stock performance and provide key insights`,
    icon: <TrendingUp />,
  },
  // ... more suggestions
];

const SuggestionChips: React.FC<{ onSuggestionClick: (query: string) => void }> = ({
  onSuggestionClick
}) => (
  <Box sx={{ position: 'fixed', bottom: 100, right: 20 }}>
    {suggestions.map((suggestion) => (
      <Chip
        key={suggestion.label}
        label={suggestion.label}
        icon={suggestion.icon}
        onClick={() => onSuggestionClick(suggestion.query)}
      />
    ))}
  </Box>
);
```

## Deployment

### Frontend Deployment

The React frontend is deployed to Devin Apps:

- **URL**: https://equity-intelligence-app-t4ajy40b.devinapps.com
- **Build Command**: `npm run build`
- **Build Output**: `build/` directory

### Backend Deployment

The FastAPI backend is deployed to Fly.io:

- **URL**: https://app-iuirfrrz.fly.dev
- **CopilotKit Endpoint**: https://app-iuirfrrz.fly.dev/copilotkit
- **Health Check**: https://app-iuirfrrz.fly.dev/healthz

### Environment Variables

#### Backend (Fly.io)
```
OPENAI_API_KEY=<your-openai-api-key>
```

#### Frontend (Build-time)
```
REACT_APP_COPILOT_RUNTIME_URL=https://app-iuirfrrz.fly.dev/copilotkit
```

## Configuration

### CopilotKit Provider Options

```typescript
<CopilotKit
  runtimeUrl="https://app-iuirfrrz.fly.dev/copilotkit"
  showDevConsole={false}  // Set to true for debugging
>
```

### CopilotPopup Options

```typescript
<CopilotPopup
  labels={{
    title: 'PRISM Research Intelligence',
    initial: 'How can I help you analyze your portfolio today?',
  }}
  instructions="You are a financial research assistant for the PRISM platform..."
/>
```

## API Reference

### CopilotKit Endpoint

**POST** `/copilotkit`

The CopilotKit endpoint handles all chat interactions using the AG-UI protocol.

#### Request Format

```json
{
  "messages": [
    {"role": "user", "content": "Analyze AAPL"}
  ],
  "actions": ["getStockInfo", "analyzeCompany", "compareCompanies"]
}
```

#### Response Format

Server-Sent Events (SSE) stream with AG-UI protocol events:

- `RunStarted` - Indicates the start of a response
- `TextMessageStart` - Start of a text message
- `TextMessageContent` - Incremental text content
- `TextMessageEnd` - End of a text message
- `ToolCallStart` - Start of a tool/action call
- `ToolCallEnd` - End of a tool/action call
- `RunFinished` - Indicates the end of a response

### Health Check

**GET** `/healthz`

Returns the health status of the backend.

```json
{"status": "ok"}
```

## File Structure

```
devin-test/
├── src/
│   ├── App.tsx                    # Main app with CopilotKit provider
│   ├── components/
│   │   ├── CopilotChat.tsx        # Chat component with HITL and suggestions
│   │   └── CompanyDashboard.tsx   # Dashboard component
│   └── ...
├── copilot-backend/
│   ├── app/
│   │   └── main.py                # FastAPI server with CopilotKit endpoint
│   ├── pyproject.toml             # Python dependencies
│   └── ...
├── docs/
│   ├── PRISM_ARCHITECTURE.md      # Overall system architecture
│   └── CHAT_ARCHITECTURE.md       # This document
└── package.json                   # Frontend dependencies
```

## Dependencies

### Frontend (package.json)

```json
{
  "@copilotkit/react-core": "^1.3.15",
  "@copilotkit/react-ui": "^1.3.15"
}
```

### Backend (pyproject.toml)

```toml
[tool.poetry.dependencies]
python = ">=3.12,<3.13"
fastapi = {extras = ["standard"], version = "^0.115.0"}
copilotkit = "^0.1.78"
openai = "^2.17.0"
python-dotenv = "^1.2.1"
```

## Troubleshooting

### Common Issues

1. **Chat not connecting**: Verify the backend URL is correct and the server is running
2. **CORS errors**: Ensure the backend CORS configuration allows the frontend origin
3. **Actions not working**: Check that the action names match between frontend and backend
4. **Streaming issues**: Verify SSE is properly configured on the backend

### Debug Mode

Enable the CopilotKit dev console for debugging:

```typescript
<CopilotKit runtimeUrl={url} showDevConsole={true}>
```

## Future Enhancements

1. **Additional Actions**: Add more backend tools for advanced analysis
2. **Persistent Chat History**: Store conversation history in a database
3. **Multi-Agent Support**: Integrate multiple specialized agents
4. **Voice Input**: Add speech-to-text capabilities
5. **Export Functionality**: Allow exporting chat conversations and insights
