# Citation System Requirements for PRISM Global Chat

## Overview
Implement a citation system for the PRISM Global Chat feature that displays source file references with page numbers and contextual snippets, similar to AlphaSense's Smart Summaries. Citations should appear below assistant responses, be clickable, and provide transparency about which documents informed the AI's answer.

## Business Context
Investment research professionals need to verify AI-generated insights by reviewing the original source documents. The citation system should:
- Build trust by showing exactly which files and pages were referenced
- Enable quick navigation to source documents
- Provide contextual snippets to preview relevance
- Track user engagement with citations for analytics

## Functional Requirements

### 1. Data Model

#### 1.1 Citation Interface
Create a TypeScript interface for citations:

```typescript
interface Citation {
  fileName: string;      // Name of the source file
  page: number;          // Page number within the file
  snippet: string;       // Contextual text excerpt from the page
  fileId: string;        // Unique identifier to locate/open the file
}
```

#### 1.2 Message Interface Extension
Extend the existing Message interface to include citations:

```typescript
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  intent?: string;
  dataSource?: 'files' | 'database' | 'internet' | 'mixed';
  citations?: Citation[];  // NEW: Array of citations for this message
}
```

### 2. Citation Generation Logic

#### 2.1 Function: generateCitations(intent: string, userMessage: string): Citation[]

**Purpose**: Generate relevant citations based on the user's query and detected intent.

**Inputs**:
- `intent`: The detected intent category (e.g., 'analyst-opinion', 'price-targets', 'management-meetings')
- `userMessage`: The user's original query text

**Logic**:
1. **Filter Relevant Files**: Search through available files and filter based on:
   - **Ticker Match**: If the query mentions a company ticker (e.g., "IBM", "AAPL"), include files with matching `ticker` field
   - **Author Match**: If the query mentions an author name (e.g., "manisha's view"), include files by that author
   - **Intent-Based Filtering**:
     - `analyst-opinion` → Internal research files (`category === 'internal'`)
     - `management-meetings` → Files with "meeting" or "irn" in filename
     - `research-reports` → Internal or external research files
     - `price-targets` → Files with "price", "target", or "valuation" in filename
     - Other intents → Apply similar keyword/category matching

2. **Select Top Citations**: Limit to 3-4 most relevant files (to avoid overwhelming the user)

3. **Generate Page Numbers**: 
   - **Current Implementation**: Random page numbers (1-20) for demo purposes
   - **Production Requirement**: Parse actual file content to find relevant page numbers where the information appears

4. **Generate Snippets**: Create contextual text excerpts
   - **Current Implementation**: Template-based snippets matching the intent type
   - **Production Requirement**: Extract actual text from the relevant page using:
     - PDF parsing libraries (e.g., pdf-parse, pdfjs-dist)
     - Text search to find sentences containing query keywords
     - Truncate to ~150 characters with ellipsis

**Output**: Array of Citation objects (0-4 citations)

**Example**:
```typescript
// Query: "what are manisha's view on IBM?"
// Intent: "analyst-opinion"
// Returns:
[
  {
    fileName: "IBM Analysis Q4 2024.pdf",
    page: 5,
    snippet: "We maintain a positive outlook on IBM based on strong fundamentals and market positioning...",
    fileId: "file-123"
  },
  {
    fileName: "Tech Sector Overview.pdf",
    page: 12,
    snippet: "IBM's cloud revenue growth accelerated to 15% YoY, exceeding our expectations...",
    fileId: "file-456"
  }
]
```

### 3. Response Text Integration

#### 3.1 Inline Citations in Response
Modify the `generateResponse` function to include inline citations at the end of the response text:

**Format**: `\n\nBased on: [File1.pdf, p.5], [File2.pdf, p.12]`

**Example**:
```
📁 Searching files

Searching through 3 internal research notes and 2 external reports to find analyst opinions. I can surface specific analyst views, compare perspectives across team members, and identify consensus or divergent opinions on companies and sectors.

Based on: [IBM Analysis Q4 2024.pdf, p.5], [Tech Sector Overview.pdf, p.12]
```

**Implementation**:
```typescript
const generateResponse = (userMessage: string, intent: string, dataSource: string, citations: Citation[]): string => {
  // ... existing response generation logic ...
  
  const citationText = citations.length > 0 
    ? `\n\nBased on: ${citations.map((c) => `[${c.fileName}, p.${c.page}]`).join(', ')}`
    : '';
  
  return `${mainResponseText}${citationText}`;
};
```

### 4. UI Components

#### 4.1 Sources Section
Display citations below the assistant message in a dedicated "Sources" section.

**Visual Design**:
- Section header: "📚 Sources (N)" where N is the citation count
- Divider line above the section (1px solid, divider color)
- Vertical stack of citation cards with 8px gap between cards

#### 4.2 Citation Card Component
Each citation should be displayed as an interactive card with:

**Layout**:
```
┌─────────────────────────────────────────────┐
│ 📄  [File Name]  [p.5]  🔗                  │
│     "Snippet text goes here..."             │
└─────────────────────────────────────────────┐
```

**Elements**:
1. **Document Icon** (📄 / Description icon from MUI)
   - Size: 18px
   - Color: primary.main
   - Position: Left side, top-aligned

2. **File Name** (Typography)
   - Variant: caption
   - Font weight: 600
   - Color: text.primary

3. **Page Number Chip** (MUI Chip)
   - Label: "p.{pageNumber}"
   - Size: small
   - Height: 18px
   - Font size: 0.65rem
   - Background: primary.main
   - Color: white
   - Font weight: 600

4. **Open Icon** (🔗 / OpenInNew icon from MUI)
   - Size: 14px
   - Color: text.secondary
   - Position: Right side (ml: auto)

5. **Snippet Text** (Typography)
   - Variant: caption
   - Font size: 0.7rem
   - Color: text.secondary
   - Font style: italic
   - Line height: 1.4
   - Display: block (below the file name row)

**Styling**:
- Background: action.hover
- Padding: 12px (1.5 spacing units)
- Border: 1px solid divider
- Border radius: 12px (1.5 spacing units)
- Cursor: pointer
- Transition: all 0.2s

**Hover State**:
- Background: action.selected
- Border color: primary.main
- Transform: translateX(4px) (slight slide to the right)

#### 4.3 Complete JSX Structure
```tsx
{message.citations && message.citations.length > 0 && (
  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
      📚 Sources ({message.citations.length})
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {message.citations.map((citation, idx) => (
        <Paper
          key={idx}
          elevation={0}
          sx={{
            p: 1.5,
            bgcolor: 'action.hover',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            '&:hover': {
              bgcolor: 'action.selected',
              borderColor: 'primary.main',
              transform: 'translateX(4px)',
            },
          }}
          onClick={() => handleCitationClick(citation)}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Description sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {citation.fileName}
                </Typography>
                <Chip
                  label={`p.${citation.page}`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <OpenInNew sx={{ fontSize: 14, color: 'text.secondary', ml: 'auto' }} />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic', display: 'block', lineHeight: 1.4 }}>
                {citation.snippet}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  </Box>
)}
```

### 5. User Interactions

#### 5.1 Citation Click Handler
Implement a click handler that:
1. Logs analytics event with citation details
2. Opens the source file at the specified page

```typescript
const handleCitationClick = (citation: Citation) => {
  // Log analytics
  logAnalytics('citation_clicked', { 
    fileName: citation.fileName, 
    page: citation.page,
    fileId: citation.fileId 
  });
  
  // Navigate to file (implementation depends on your file viewer)
  // Option 1: Open in new tab/window
  // Option 2: Navigate to file detail page with page parameter
  // Option 3: Open inline PDF viewer at specific page
  
  console.log(`Opening file: ${citation.fileName} at page ${citation.page}`);
  // TODO: Implement actual file navigation
};
```

### 6. Integration Points

#### 6.1 Message Send Flow
Update the `handleSendMessage` function to generate and attach citations:

```typescript
const handleSendMessage = () => {
  if (!inputValue.trim()) return;

  const { intent, dataSource } = detectIntent(inputValue);
  const citations = generateCitations(intent, inputValue);  // NEW

  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputValue,
    sender: 'user',
    timestamp: new Date(),
    intent,
    dataSource,
  };

  setMessages(prev => [...prev, userMessage]);
  logAnalytics('message_sent', { 
    text: inputValue, 
    intent, 
    dataSource,
    citationCount: citations.length  // NEW
  });

  setInputValue('');

  setTimeout(() => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: generateResponse(inputValue, intent, dataSource, citations),  // UPDATED
      sender: 'assistant',
      timestamp: new Date(),
      intent,
      dataSource,
      citations,  // NEW
    };
    setMessages(prev => [...prev, assistantMessage]);
  }, 500);
};
```

#### 6.2 Required Imports
Add these Material-UI icons to your imports:

```typescript
import {
  Chat,
  Close,
  Send,
  SmartToy,
  Description,    // NEW: For document icon
  OpenInNew,      // NEW: For open/link icon
} from '@mui/icons-material';
```

### 7. Analytics Events

Track the following events for product analytics:

| Event | Trigger | Data Payload |
|-------|---------|--------------|
| `message_sent` | User sends a message | `{ text, intent, dataSource, citationCount }` |
| `citation_clicked` | User clicks a citation card | `{ fileName, page, fileId }` |

### 8. Edge Cases & Behavior

#### 8.1 No Citations Found
- If `generateCitations` returns an empty array, do NOT display the Sources section
- The inline citation text should also be omitted from the response
- This is expected behavior when no relevant files match the query

#### 8.2 Multiple Citations
- Display up to 4 citations per response
- Order by relevance (most relevant first)
- If more than 4 relevant files exist, select the top 4

#### 8.3 Citation Visibility
- Citations should only appear on assistant messages, never on user messages
- Citations are part of the message state and persist in the conversation history

### 9. Testing Requirements

#### 9.1 Manual Testing Scenarios
Test with these sample queries to verify intent detection and citation generation:

| Query | Expected Intent | Expected Data Source | Expected Citations |
|-------|----------------|---------------------|-------------------|
| "what are manisha's view on IBM?" | analyst-opinion | Files | Files by author "Manisha" or with ticker "IBM" |
| "has the price target changed for microsoft?" | price-targets | Mixed | Files with "price"/"target" in name or ticker "MSFT" |
| "what recent management meetings have taken place in Tech?" | management-meetings | Files | Files with "meeting"/"irn" in name |
| "Latest research on tech sector?" | research-reports | Files | Internal/external research files |

#### 9.2 UI Testing
- [ ] Citations display correctly below assistant messages
- [ ] Citation cards have proper hover effects (background change, border color, slide animation)
- [ ] Page number chips are styled correctly (blue background, white text)
- [ ] Snippets are italicized and properly truncated
- [ ] Clicking a citation logs the analytics event to console
- [ ] Sources section only appears when citations exist

#### 9.3 Responsive Testing
- [ ] Citation cards stack vertically on mobile
- [ ] Text wraps properly in citation cards
- [ ] Icons scale appropriately on different screen sizes

### 10. Future Enhancements (Out of Scope for Initial Implementation)

#### 10.1 Real File Parsing
- Integrate PDF parsing library (pdf-parse, pdfjs-dist)
- Extract actual text from pages
- Use NLP to find most relevant sentences
- Generate accurate page numbers based on content location

#### 10.2 File Navigation
- Implement actual file opening functionality
- Support deep linking to specific pages in PDF viewer
- Highlight relevant text on the page

#### 10.3 Citation Ranking
- Implement relevance scoring algorithm
- Consider recency, author authority, document type
- Allow users to sort citations by relevance/date

#### 10.4 Citation Persistence
- Store citations in backend database
- Enable citation history across sessions
- Support citation export/sharing

## Technical Notes

### Dependencies
- Material-UI (MUI) v5+ for UI components
- React 18+ with TypeScript
- Existing FileItem interface from `src/types/index.ts`

### File Locations
- Citation logic: `src/components/GlobalChat.tsx`
- Type definitions: `src/types/index.ts` (if separating Citation interface)
- Analytics: Console logging (replace with actual analytics service)

### Performance Considerations
- Citation generation should complete in <100ms
- Limit file filtering to avoid blocking UI
- Consider memoizing citation results for repeated queries

## Acceptance Criteria

✅ Citations appear below assistant messages with file name, page number, and snippet
✅ Citation cards are clickable and log analytics events
✅ Inline citations appear in response text when citations exist
✅ Sources section only displays when citations are available
✅ Hover effects work correctly on citation cards
✅ All 10 sample queries generate appropriate citations
✅ No TypeScript errors or console warnings
✅ UI matches the design specifications (spacing, colors, typography)

## Reference Implementation
See PR #12 in manishagupta81/devin-test for complete working implementation.
