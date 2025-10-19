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
} from '@mui/icons-material';
import { FileItem } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  intent?: string;
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

  const detectIntent = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(analyst|expert|researcher|author|recommendation|rating|upgrade|downgrade)\b/)) {
      return 'analyst';
    }
    
    if (lowerText.match(/\b(outlook|forecast|prediction|consensus|guidance|estimate|target|projection)\b/)) {
      return 'team-outlook';
    }
    
    if (lowerText.match(/\b(q[1-4]|quarter|year|month|week|recent|latest|2024|2025|compare|trend|historical|performance)\b/)) {
      return 'timeframe';
    }
    
    if (lowerText.match(/\b(company|stock|ticker|corporation|firm|equity|sector|industry|revenue|earnings|valuation|margin|growth)\b/)) {
      return 'company';
    }
    
    return 'general';
  };

  const generateResponse = (userMessage: string, intent: string): string => {
    const fileCount = files.length;
    const internalDocs = files.filter(f => f.category === 'internal').length;
    const externalDocs = files.filter(f => f.category === 'external').length;
    const aiDocs = files.filter(f => f.category === 'ai-generated').length;
    
    switch (intent) {
      case 'team-outlook':
        return `I'm analyzing ${fileCount} research documents (${internalDocs} internal, ${externalDocs} external, ${aiDocs} AI-generated) to provide market outlook insights. I can help you understand consensus views, divergent opinions, and emerging trends across different teams and time periods. What specific market or sector would you like to explore?`;
      
      case 'company':
        return `I have access to ${fileCount} investment research documents covering company analysis, earnings reports, and sector insights. I can help you find fundamental analysis, valuation metrics, competitive positioning, and growth drivers. Which company or sector are you researching?`;
      
      case 'analyst':
        return `Searching through ${fileCount} documents from various analysts and research teams. I can help you track specific analyst views, compare recommendations, identify sentiment shifts, and surface key insights from expert commentary. Which analyst or research theme interests you?`;
      
      case 'timeframe':
        return `I can analyze ${fileCount} documents across different time periods to identify trends, track performance metrics, and compare historical data. This includes quarterly earnings, annual reports, and event-driven analysis. What time period or comparative analysis would you like to see?`;
      
      default:
        return `Welcome to PRISM Research Intelligence. I have ${fileCount} documents available (${internalDocs} internal research, ${externalDocs} external sources, ${aiDocs} AI analysis). I can help you with:\n\n• Company & sector analysis\n• Analyst insights & recommendations\n• Market outlook & forecasts\n• Time-based trends & comparisons\n\nWhat would you like to research today?`;
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

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    const intent = detectIntent(inputValue);
    userMessage.intent = intent;

    setMessages(prev => [...prev, userMessage]);
    logAnalytics('message_sent', { text: inputValue, intent });

    setInputValue('');

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue, intent),
        sender: 'assistant',
        timestamp: new Date(),
        intent,
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
                    {message.intent && (
                      <Chip
                        label={message.intent.replace('-', ' ')}
                        size="small"
                        sx={{
                          mt: 1.5,
                          height: 22,
                          fontSize: '0.7rem',
                          textTransform: 'capitalize',
                          bgcolor: message.sender === 'user' ? 'primary.dark' : 'primary.light',
                          color: message.sender === 'user' ? 'white' : 'primary.dark',
                          fontWeight: 500,
                        }}
                      />
                    )}
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
