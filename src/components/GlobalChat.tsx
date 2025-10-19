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
} from '@mui/material';
import {
  Chat,
  Close,
  Send,
  SmartToy,
  Description,
  OpenInNew,
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

const conversationStarters = [
  {
    text: "What are the key revenue drivers for tech companies in Q4?",
    intent: 'company',
    category: 'Company Analysis',
    icon: '📊',
  },
  {
    text: "Show me recent analyst sentiment on semiconductor stocks",
    intent: 'analyst',
    category: 'Analyst Insights',
    icon: '👥',
  },
  {
    text: "What's the consensus outlook on interest rates for 2025?",
    intent: 'team-outlook',
    category: 'Market Outlook',
    icon: '🎯',
  },
  {
    text: "Compare earnings performance across major banks this quarter",
    intent: 'timeframe',
    category: 'Comparative Analysis',
    icon: '📈',
  },
  {
    text: "What are the emerging risks in the energy sector?",
    intent: 'company',
    category: 'Risk Analysis',
    icon: '⚠️',
  },
  {
    text: "Summarize recent M&A activity in healthcare",
    intent: 'timeframe',
    category: 'M&A Intelligence',
    icon: '🤝',
  },
];

const GlobalChat: React.FC<GlobalChatProps> = ({ files }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
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

  const handleStarterClick = (starter: typeof conversationStarters[0]) => {
    setInputValue(starter.text);
    logAnalytics('starter_selected', { text: starter.text, intent: starter.intent });
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
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    margin: '0 auto 16px',
                  }}
                >
                  <SmartToy fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  PRISM Research Intelligence
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Your AI-powered investment research assistant
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                  Ask questions about companies, analysts, market trends, or explore insights across {files.length} research documents
                </Typography>
              </Box>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Start Questions
              </Typography>

              <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
                {conversationStarters.map((starter, index) => (
                  <ListItem
                    key={index}
                    component={Paper}
                    elevation={1}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 3,
                        bgcolor: 'action.hover',
                        transform: 'translateY(-2px)',
                      },
                      borderRadius: 2,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                    onClick={() => handleStarterClick(starter)}
                  >
                    <Box sx={{ mr: 1.5, fontSize: '1.5rem' }}>
                      {starter.icon}
                    </Box>
                    <ListItemText
                      primary={starter.text}
                      secondary={starter.category}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        color: 'primary.main',
                        fontWeight: 500,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
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
