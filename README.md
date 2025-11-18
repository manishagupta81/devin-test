# PRISM Investment Research Platform

A comprehensive investment research platform with AI-powered global chat, intent detection, and citation system.

## Features
- React 19.1.0 with TypeScript
- Material-UI components
- Document management system interface
- **Global Chat with Intent Detection** - AI assistant for investment research queries
- **Smart Query Suggestions** - Dynamic prompts based on selected ticker and sector
- **Citation System** - Source file references with page numbers (AlphaSense-inspired)
- **Data Source Routing** - Automatic routing to Files, Database, Mixed, or Internet

## Global Chat Architecture

### Intent Detection & Data Source Routing

The Global Chat feature uses an intelligent intent detection system to automatically categorize user queries and route them to appropriate data sources. Below is the sequence diagram showing the complete flow:

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat UI
    participant IntentDetector as Intent Detector
    participant DataRouter as Data Source Router
    participant FileSearch as File Search
    participant Database as Database
    participant CitationGen as Citation Generator
    participant ResponseGen as Response Generator

    User->>ChatUI: Enter query: "What are manisha's views on IBM?"
    ChatUI->>IntentDetector: detectIntent(text)
    
    Note over IntentDetector: Regex Pattern Matching<br/>1. Check for "view" keyword ✓<br/>2. Check for analyst name "manisha" ✓<br/>3. Match: analyst-opinion pattern
    
    IntentDetector->>IntentDetector: Analyze query patterns
    IntentDetector-->>ChatUI: { intent: "analyst-opinion", dataSource: "files" }
    
    ChatUI->>DataRouter: Route query based on intent
    
    alt dataSource === "files"
        DataRouter->>FileSearch: Search internal research files
        Note over FileSearch: Filter by:<br/>- Author: "manisha"<br/>- Ticker: "IBM"<br/>- Category: internal
        FileSearch-->>DataRouter: Found files: [Project Requirements.pdf]
    else dataSource === "database"
        DataRouter->>Database: Query structured data
        Database-->>DataRouter: Return database results
    else dataSource === "mixed"
        DataRouter->>FileSearch: Search files
        DataRouter->>Database: Query database
        FileSearch-->>DataRouter: File results
        Database-->>DataRouter: Database results
    else dataSource === "internet"
        DataRouter->>DataRouter: Fetch external data (future)
    end
    
    DataRouter->>CitationGen: Generate citations from results
    Note over CitationGen: Create citation objects:<br/>- fileName: "Project Requirements.pdf"<br/>- page: 4<br/>- snippet: "We maintain positive outlook..."
    CitationGen-->>DataRouter: Citations array
    
    DataRouter->>ResponseGen: Generate response with citations
    Note over ResponseGen: Build response:<br/>- Data source indicator: "📁 Searching files"<br/>- Contextual explanation<br/>- Inline citation: "[Project Requirements.pdf, p.4]"
    ResponseGen-->>ChatUI: Response with citations
    
    ChatUI->>User: Display message with:
    Note over ChatUI,User: - Intent chip: "analyst opinion"<br/>- Data source chip: "📁 Files"<br/>- Response text with inline citations<br/>- Citation cards with file/page/snippet
```

### Intent Categories & Data Source Mapping

| Intent Category | Description | Data Source | Example Queries |
|----------------|-------------|-------------|-----------------|
| **analyst-opinion** | Analyst views, opinions, perspectives | 📁 Files | "What are manisha's views on IBM?" |
| **management-meetings** | Management meeting notes, IRNs | 📁 Files | "Recent management meetings in Tech?" |
| **price-targets** | Price target changes, valuations | 📁💾 Mixed | "Has price target changed for MSFT?" |
| **financial-metrics** | Growth rates, margins, profitability | 📁💾 Mixed | "Expected growth rate for XYZ?" |
| **investment-decisions** | Investment thesis, buy/sell decisions | 📁💾 Mixed | "Companies we passed on buying?" |
| **research-reports** | Sector reports, thematic research | 📁 Files | "Latest research on tech sector?" |
| **earnings-thesis** | Earnings impact on thesis | 📁 Files | "Has earnings changed our thesis?" |
| **thematic-analysis** | Cross-document themes, trends | 📁 Files | "Summarize key takeaways on natural gas" |
| **company-sector** | General company/sector information | 📁💾 Mixed | "Tell me about IBM" |
| **historical-analysis** | Historical trends, time-series data | 📁💾 Mixed | "Price target over past two years" |

### Key Components

1. **Intent Detector** (`detectIntent` function)
   - Uses regex pattern matching to identify query intent
   - Analyzes keywords, phrases, and context
   - Returns intent category and appropriate data source

2. **Data Source Router**
   - Routes queries based on detected intent
   - Supports 4 data sources:
     - 📁 **Files**: Internal research notes, IRNs, analyst reports
     - 💾 **Database**: Structured financial data, historical metrics
     - 📁💾 **Mixed**: Queries requiring both files and database
     - 🌐 **Internet**: Real-time market data (future enhancement)

3. **Citation Generator** (`generateCitations` function)
   - Filters files based on query context (ticker, author, keywords)
   - Generates citation objects with file name, page number, and snippet
   - Supports up to 4 most relevant citations per response

4. **Response Generator** (`generateResponse` function)
   - Creates contextual responses based on intent and data source
   - Includes inline citations in response text
   - Adds data source indicators (e.g., "📁 Searching files...")

### Smart Query Suggestions

The chat includes 5 dynamic query suggestions that update based on selected **Ticker** and **Sector**:

1. **Analyst Views on Ticker** (👥) - "What are our analysts' views on {Ticker}?"
   - Backend should look for analyst sentiment and opinions on the specific ticker

2. **Latest Research Summary** (📊) - "What does our latest research say about {Ticker}? Include participants, key takeaways, and how commentary evolved over the past 2 years."
   - Should cover summarization of last 2 years including participants, key takeaways, evolution from oldest to latest, positive/negative sentiment
   - How has management's commentary on specific issues changed over time

3. **Price Target History** (📈) - "What has been the price target for {Ticker} over the past two years?"
   - Track price target changes over past 2 years with historical analysis

4. **Sector Management Notes** (🤝) - "Give me all management notes for {Sector} and summarize. Identify key themes around the industrial cycle and how commentary changed over time."
   - Should cover past 2 years and summarize each management note
   - Identify key themes around the industrial cycle and how commentary has changed over time

5. **Sector Analyst Sentiment** (🌐) - "What are our analysts' views on {Sector} sector? Summarize overall sentiment including 4-5 recent tickers in that sector."
   - Summarize 4-5 recent tickers in that sector and cover their sentiments (superset of #2)
   - Overall analyst sentiment for the entire sector

**Flexible Context Selection:**
- **Ticker Dropdown**: Select from 8 major tickers (AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA, IBM)
- **Sector Dropdown**: Select from 8 sectors (Technology, Healthcare, Financials, Consumer Discretionary, Industrials, Energy, Materials, Real Estate)
- Conversation starters dynamically update when either dropdown changes

Each suggestion includes:
- Category title with icon
- Dynamic question text with {Ticker} or {Sector} placeholders
- **Use** button (populates input field)
- **Copy** button (copies to clipboard)

### Analytics & Logging

All user interactions are logged for analytics:
- `chat_opened` - User opens chat drawer
- `chat_closed` - User closes chat drawer
- `message_sent` - User sends a message (includes intent and dataSource)
- `starter_selected` - User clicks "Use" on conversation starter
- `starter_copied` - User clicks "Copy" on conversation starter
- `citation_clicked` - User clicks on citation card

## Documentation

See `CITATION_REQUIREMENTS.md` for complete technical specifications including:
- Data models (TypeScript interfaces)
- Intent detection logic (regex patterns)
- Citation generation algorithm
- UI component specifications
- Testing scenarios and acceptance criteria
- Future enhancements (real PDF parsing, file navigation, ML-based intent detection)
