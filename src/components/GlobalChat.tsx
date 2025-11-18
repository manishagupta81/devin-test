import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Paper,
  Fab,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Button,
  FormControl,
} from '@mui/material';
import {
  Chat,
  Close,
  Send,
  SmartToy,
  Description,
  OpenInNew,
  ContentCopy,
  NearMe,
} from '@mui/icons-material';
import { FileItem } from '../types';

interface Citation {
  fileName: string;
  page: number;
  snippet: string;
  fileId: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  intent?: string;
  dataSource?: 'files' | 'database' | 'internet' | 'mixed';
  citations?: Citation[];
}

interface GlobalChatProps {
  files: FileItem[];
}

interface ConversationStarter {
  text: string;
  intent: string;
  category: string;
  icon: string;
  tags: string[];
  description: string;
}

const availableTickers = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'IBM', name: 'IBM Corporation' },
];

const getConversationStarters = (ticker: string): ConversationStarter[] => [
  {
    category: 'Analyst Sentiment',
    description: 'Summarize internal analyst sentiment and recommendations.',
    text: `What are our analysts' views on ${ticker} as of January 2023?`,
    intent: 'analyst-opinion',
    icon: '👥',
    tags: ['Analyst', 'Views', 'Sentiment'],
  },
  {
    category: 'Portfolio Rationale',
    description: "Explain rationale behind PM's current positioning or conviction.",
    text: `Why does the portfolio manager favor ${ticker}? Include context since January 2023.`,
    intent: 'investment-decisions',
    icon: '📊',
    tags: ['Portfolio', 'Rationale', 'Ticker'],
  },
  {
    category: 'Price Target Timeline',
    description: 'Track revisions to price targets over time.',
    text: `Show how the price target for ${ticker} has changed since January 2023.`,
    intent: 'price-targets',
    icon: '📈',
    tags: ['Price Target', 'Timeline'],
  },
  {
    category: 'Executive Meetings',
    description: 'Pull meeting notes and summaries across a specific sector and company.',
    text: `List recent management meetings related to ${ticker} in the Technology sector since January 2023.`,
    intent: 'management-meetings',
    icon: '🤝',
    tags: ['Meetings', 'Sector', 'Research'],
  },
  {
    category: 'Executive Interactions',
    description: 'Identify executive interactions and key takeaways.',
    text: `Have we met with ${ticker}'s CFO or other key executives since January 2023? Summarize key discussion points.`,
    intent: 'management-meetings',
    icon: '👔',
    tags: ['Executives', 'Meetings', 'Insights'],
  },
  {
    category: 'Sector Research',
    description: 'Aggregate and summarize current sector-level reports.',
    text: `Summarize the latest research reports on the Technology sector as of January 2023.`,
    intent: 'research-reports',
    icon: '📑',
    tags: ['Research', 'Sector', 'Reports'],
  },
  {
    category: 'Comparative Valuation',
    description: 'Analyze comparative valuation and performance context.',
    text: `Summarize ${ticker}'s performance and valuation relative to its peers in Technology since January 2023.`,
    intent: 'financial-metrics',
    icon: '💰',
    tags: ['Performance', 'Valuation', 'Peers'],
  },
];

const GlobalChat: React.FC<GlobalChatProps> = ({ files }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('NVDA');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const logAnalytics = (action: string, data?: any) => {
    const analyticsEvent = {
      action,
      timestamp: new Date().toISOString(),
      data,
    };
    console.log('[Analytics]', analyticsEvent);
  };

  const detectIntent = (text: string): { intent: string; dataSource: 'files' | 'database' | 'internet' | 'mixed' } => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(view|opinion|favor|think|believe|perspective)\b.*\b(on|about)\b/i) ||
        lowerText.match(/\b(analyst|expert|researcher|author).*\b(view|opinion|favor|think)\b/i)) {
      return { intent: 'analyst-opinion', dataSource: 'files' };
    }
    
    if (lowerText.match(/\b(management meeting|met|meeting with|ceo|cfo|management team|executive)\b/i) ||
        lowerText.match(/\b(management.*saying|management.*focus|key takeaway|meetings.*taken place|meetings.*have)\b/i)) {
      return { intent: 'management-meetings', dataSource: 'files' };
    }
    
    if (lowerText.match(/\b(price target|target price|pt changed|price objective)\b/i)) {
      return { intent: 'price-targets', dataSource: 'mixed' };
    }
    
    if (lowerText.match(/\b(growth rate|profit margin|revenue|earnings|ebitda|operating margin|roe|roic)\b/i) ||
        lowerText.match(/\b(margin over|companies.*operating with)\b/i)) {
      return { intent: 'financial-metrics', dataSource: 'mixed' };
    }
    
    if (lowerText.match(/\b(passed on|valuation concern|investment decision|buy|sell|hold decision)\b/i) ||
        lowerText.match(/\b(thesis.*change|change.*thesis)\b/i)) {
      return { intent: 'investment-decisions', dataSource: 'mixed' };
    }
    
    if (lowerText.match(/\b(latest research|recent research|research on|research report|sector report)\b/i)) {
      return { intent: 'research-reports', dataSource: 'files' };
    }
    
    if (lowerText.match(/\b(earnings|quarterly result|q[1-4] result).*\b(thesis|view|outlook)\b/i)) {
      return { intent: 'earnings-thesis', dataSource: 'files' };
    }
    
    if (lowerText.match(/\b(summarize|highlight|key takeaway|theme|trend across)\b/i)) {
      return { intent: 'thematic-analysis', dataSource: 'files' };
    }
    
    if (lowerText.match(/\b(company|stock|ticker|corporation|firm|equity|sector|industry)\b/i)) {
      return { intent: 'company-sector', dataSource: 'mixed' };
    }
    
    if (lowerText.match(/\b(over past|last|historical|trend|evolution|over time)\b/i)) {
      return { intent: 'historical-analysis', dataSource: 'mixed' };
    }
    
    return { intent: 'general', dataSource: 'files' };
  };

  const generateCitations = (intent: string, userMessage: string): Citation[] => {
    const citations: Citation[] = [];
    const lowerMessage = userMessage.toLowerCase();
    
    const relevantFiles = files.filter(file => {
      const lowerName = file.name.toLowerCase();
      const lowerAuthor = file.author.toLowerCase();
      
      if (file.ticker && lowerMessage.includes(file.ticker.toLowerCase())) {
        return true;
      }
      
      if (lowerMessage.includes(lowerAuthor)) {
        return true;
      }
      
      if (intent === 'analyst-opinion' && file.category === 'internal') {
        return true;
      }
      if (intent === 'management-meetings' && (lowerName.includes('meeting') || lowerName.includes('irn'))) {
        return true;
      }
      if (intent === 'research-reports' && (file.category === 'internal' || file.category === 'external')) {
        return true;
      }
      if (intent === 'price-targets' && (lowerName.includes('price') || lowerName.includes('target') || lowerName.includes('valuation'))) {
        return true;
      }
      
      return false;
    });
    
    const selectedFiles = relevantFiles.slice(0, Math.min(4, relevantFiles.length));
    
    selectedFiles.forEach((file, index) => {
      const pageNumber = Math.floor(Math.random() * 20) + 1;
      
      let snippet = '';
      switch (intent) {
        case 'analyst-opinion':
          snippet = `"We maintain a positive outlook on ${file.ticker || 'the company'} based on strong fundamentals and market positioning..."`;
          break;
        case 'management-meetings':
          snippet = `"Management emphasized their focus on operational efficiency and margin expansion in the coming quarters..."`;
          break;
        case 'price-targets':
          snippet = `"We are raising our price target to $${Math.floor(Math.random() * 200 + 100)} based on improved earnings visibility..."`;
          break;
        case 'financial-metrics':
          snippet = `"Revenue growth is expected to accelerate to ${Math.floor(Math.random() * 20 + 10)}% YoY with EBITDA margins expanding..."`;
          break;
        case 'research-reports':
          snippet = `"Our sector analysis indicates strong tailwinds from digital transformation and increasing demand..."`;
          break;
        default:
          snippet = `"Key insights from our analysis suggest continued momentum in the sector..."`;
      }
      
      citations.push({
        fileName: file.name,
        page: pageNumber,
        snippet: snippet,
        fileId: file.id,
      });
    });
    
    return citations;
  };

  const generateResponse = (userMessage: string, intent: string, dataSource: string, citations: Citation[]): string => {
    const fileCount = files.length;
    const internalDocs = files.filter(f => f.category === 'internal').length;
    const externalDocs = files.filter(f => f.category === 'external').length;
    const aiDocs = files.filter(f => f.category === 'ai-generated').length;
    
    const dataSourceText = dataSource === 'files' ? '📁 Searching files' : 
                          dataSource === 'database' ? '💾 Querying database' :
                          dataSource === 'mixed' ? '📁💾 Searching files & database' : '🌐 Searching';
    
    const citationText = citations.length > 0 
      ? `\n\nBased on: ${citations.map((c, i) => `[${c.fileName}, p.${c.page}]`).join(', ')}`
      : '';
    
    switch (intent) {
      case 'analyst-opinion':
        return `${dataSourceText}\n\nSearching through ${internalDocs} internal research notes and ${externalDocs} external reports to find analyst opinions. I can surface specific analyst views, compare perspectives across team members, and identify consensus or divergent opinions on companies and sectors.${citationText}`;
      
      case 'management-meetings':
        return `${dataSourceText}\n\nAnalyzing ${fileCount} documents for management meeting notes, executive interactions, and key takeaways. I can help you track meeting history, identify evolving themes, and surface important management commentary on strategy, outlook, and market conditions.${citationText}`;
      
      case 'price-targets':
        return `${dataSourceText}\n\nSearching ${fileCount} research documents and historical database records for price target information. I can track price target changes over time, compare analyst targets, and identify catalysts for target adjustments.${citationText}`;
      
      case 'financial-metrics':
        return `${dataSourceText}\n\nQuerying financial data across ${fileCount} documents and database records. I can help you analyze growth rates, margins, profitability metrics, and compare companies based on specific financial criteria.${citationText}`;
      
      case 'investment-decisions':
        return `${dataSourceText}\n\nAnalyzing investment decision history and thesis documents. I can help you understand why certain investments were made or passed on, track valuation concerns, and review subsequent performance of companies we evaluated.${citationText}`;
      
      case 'research-reports':
        return `${dataSourceText}\n\nSearching through ${fileCount} research reports (${internalDocs} internal, ${externalDocs} external, ${aiDocs} AI-generated). I can surface the latest sector research, thematic reports, and company-specific analysis.${citationText}`;
      
      case 'earnings-thesis':
        return `${dataSourceText}\n\nAnalyzing earnings reports and investment thesis documents. I can help you understand how recent earnings have impacted our views, identify thesis changes, and track evolving outlooks on companies.${citationText}`;
      
      case 'thematic-analysis':
        return `${dataSourceText}\n\nPerforming thematic analysis across ${fileCount} documents. I can synthesize key themes, identify patterns across management meetings and research notes, and provide comprehensive summaries on specific topics.${citationText}`;
      
      case 'company-sector':
        return `${dataSourceText}\n\nSearching ${fileCount} documents covering company and sector analysis. I can provide insights on fundamentals, competitive positioning, industry trends, and investment opportunities.${citationText}`;
      
      case 'historical-analysis':
        return `${dataSourceText}\n\nAnalyzing historical data and trends across documents and database records. I can track how metrics, views, and themes have evolved over time and identify important inflection points.${citationText}`;
      
      default:
        return `${dataSourceText}\n\nWelcome to PRISM Research Intelligence. I have ${fileCount} documents available (${internalDocs} internal research, ${externalDocs} external sources, ${aiDocs} AI analysis). I can help you with:\n\n• Analyst opinions & views\n• Management meeting insights\n• Price targets & financial metrics\n• Investment decisions & thesis\n• Research reports & thematic analysis\n\nWhat would you like to research today?`;
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    logAnalytics('chat_opened');
  };

  const handleClose = () => {
    setIsOpen(false);
    logAnalytics('chat_closed');
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const { intent, dataSource } = detectIntent(inputValue);
    const citations = generateCitations(intent, inputValue);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      intent,
      dataSource,
    };

    setMessages(prev => [...prev, userMessage]);
    logAnalytics('message_sent', { text: inputValue, intent, dataSource, citationCount: citations.length });

    setInputValue('');

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue, intent, dataSource, citations),
        sender: 'assistant',
        timestamp: new Date(),
        intent,
        dataSource,
        citations,
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
  };

  const handleStarterClick = (starter: ConversationStarter) => {
    setInputValue(starter.text);
    logAnalytics('starter_selected', { text: starter.text, intent: starter.intent, ticker: selectedTicker });
  };

  const handleCopyStarter = (starter: ConversationStarter, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(starter.text);
    logAnalytics('starter_copied', { text: starter.text, intent: starter.intent, ticker: selectedTicker });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCitationClick = (citation: Citation) => {
    logAnalytics('citation_clicked', { fileName: citation.fileName, page: citation.page });
    console.log(`Opening file: ${citation.fileName} at page ${citation.page}`);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Chat />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100%',
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SmartToy sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                  PRISM Research
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  AI Investment Assistant
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>

          {messages.length === 0 ? (
            <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Ticker-Based Conversation Starters
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select a company ticker to personalize your prompts.
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Select
                    value={selectedTicker}
                    onChange={(e) => setSelectedTicker(e.target.value)}
                    sx={{
                      bgcolor: 'background.paper',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                    }}
                  >
                    {availableTickers.map((ticker) => (
                      <MenuItem key={ticker.symbol} value={ticker.symbol}>
                        {ticker.symbol} - {ticker.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {getConversationStarters(selectedTicker).map((starter, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 3,
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ fontSize: '1.5rem' }}>
                        {starter.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {starter.category}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                          {starter.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                          {starter.tags.map((tag, tagIdx) => (
                            <Chip
                              key={tagIdx}
                              label={tag}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: 'primary.light',
                                color: 'primary.dark',
                                fontWeight: 500,
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5, fontStyle: 'italic' }}>
                          "{starter.text}"
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<NearMe />}
                            onClick={() => handleStarterClick(starter)}
                            sx={{
                              textTransform: 'none',
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                            }}
                          >
                            Use
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ContentCopy />}
                            onClick={(e) => handleCopyStarter(starter, e)}
                            sx={{
                              textTransform: 'none',
                              borderColor: 'divider',
                              color: 'text.secondary',
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'action.hover',
                              },
                            }}
                          >
                            Copy
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    elevation={message.sender === 'user' ? 2 : 1}
                    sx={{
                      p: 2,
                      maxWidth: '85%',
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      border: message.sender === 'assistant' ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        whiteSpace: 'pre-line',
                        lineHeight: 1.6,
                      }}
                    >
                      {message.text}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
                      {message.intent && (
                        <Chip
                          label={message.intent.replace(/-/g, ' ')}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            textTransform: 'capitalize',
                            bgcolor: message.sender === 'user' ? 'primary.dark' : 'primary.light',
                            color: message.sender === 'user' ? 'white' : 'primary.dark',
                            fontWeight: 500,
                          }}
                        />
                      )}
                      {message.dataSource && (
                        <Chip
                          label={message.dataSource === 'files' ? '📁 Files' : 
                                 message.dataSource === 'database' ? '💾 Database' :
                                 message.dataSource === 'mixed' ? '📁💾 Mixed' : '🌐 Web'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            bgcolor: message.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'grey.200',
                            color: message.sender === 'user' ? 'white' : 'text.secondary',
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        opacity: 0.7,
                        fontSize: '0.7rem',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>

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
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          )}

          <Divider />

          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask about companies, analysts, or insights..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                  },
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default GlobalChat;
