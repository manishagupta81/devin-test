import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  TrendingUp,
  Assessment,
  Compare,
  Warning,
  Lightbulb,
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { DashboardStateContext } from '../App';

// Company name mapping
const companyNames: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corporation',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com Inc.',
  META: 'Meta Platforms Inc.',
  NVDA: 'NVIDIA Corporation',
  AMD: 'Advanced Micro Devices Inc.',
};

// Available tickers
const availableTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD'];

// Message interface
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Human-in-the-loop approval dialog component
interface ApprovalDialogProps {
  open: boolean;
  title: string;
  description: string;
  onApprove: () => void;
  onReject: () => void;
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  open,
  title,
  description,
  onApprove,
  onReject,
}) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="warning" />
        Approval Required
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onReject}
          startIcon={<Cancel />}
          color="error"
          variant="outlined"
        >
          Reject
        </Button>
        <Button
          onClick={onApprove}
          startIcon={<CheckCircle />}
          color="success"
          variant="contained"
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Suggestion chips component - now inside the chat
interface SuggestionChipsProps {
  onSuggestionClick: (suggestion: string, requiresApproval: boolean) => void;
  selectedTicker: string;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ 
  onSuggestionClick, 
  selectedTicker 
}) => {
  const suggestions = [
    { 
      label: `Analyze ${selectedTicker}`, 
      icon: <Assessment sx={{ fontSize: 16 }} />,
      query: `Provide a comprehensive analysis of ${companyNames[selectedTicker] || selectedTicker} (${selectedTicker}) including key metrics, recent performance, and outlook.`,
      requiresApproval: false,
    },
    { 
      label: 'Compare competitors', 
      icon: <Compare sx={{ fontSize: 16 }} />,
      query: `Compare ${companyNames[selectedTicker] || selectedTicker} with its main competitors in terms of market position, financials, and growth prospects.`,
      requiresApproval: true,
    },
    { 
      label: 'Show risk factors', 
      icon: <Warning sx={{ fontSize: 16 }} />,
      query: `What are the key risk factors and potential headwinds for ${companyNames[selectedTicker] || selectedTicker}?`,
      requiresApproval: false,
    },
    { 
      label: 'Investment thesis', 
      icon: <Lightbulb sx={{ fontSize: 16 }} />,
      query: `Generate an investment thesis for ${companyNames[selectedTicker] || selectedTicker} including bull case, bear case, and key catalysts.`,
      requiresApproval: true,
    },
    { 
      label: 'Market outlook', 
      icon: <TrendingUp sx={{ fontSize: 16 }} />,
      query: `What is the current market outlook for ${companyNames[selectedTicker] || selectedTicker} and its sector?`,
      requiresApproval: false,
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {suggestions.map((suggestion, index) => (
        <Chip
          key={index}
          label={suggestion.label}
          icon={suggestion.icon}
          onClick={() => onSuggestionClick(suggestion.query, suggestion.requiresApproval)}
          sx={{
            cursor: 'pointer',
            fontSize: '0.75rem',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white',
            },
          }}
          variant="outlined"
          size="small"
        />
      ))}
    </Box>
  );
};

const CopilotChat: React.FC = () => {
  const dashboardContext = useContext(DashboardStateContext);
  const selectedTicker = dashboardContext?.selectedTicker || 'AAPL';

  // Chat state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State for competitor selection in compare action
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedCompetitor1, setSelectedCompetitor1] = useState('MSFT');
  const [selectedCompetitor2, setSelectedCompetitor2] = useState('GOOGL');

  // State for human-in-the-loop approval
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    pendingQuery: string;
  }>({
    open: false,
    title: '',
    description: '',
    pendingQuery: '',
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate mock response for demo purposes
  const generateMockResponse = (query: string, ticker: string): string => {
    const company = companyNames[ticker] || ticker;
    
    if (query.toLowerCase().includes('analysis') || query.toLowerCase().includes('analyze')) {
      return `**${company} Analysis Summary**\n\n` +
        `**Key Metrics:**\n` +
        `- Revenue (TTM): $42.8B (+15% YoY)\n` +
        `- Gross Margin: 28.3%\n` +
        `- EPS: $6.42 (+4.7% YoY)\n\n` +
        `**Outlook:** Positive momentum with strong services growth and AI investments driving future growth potential.`;
    }
    
    if (query.toLowerCase().includes('compare') || query.toLowerCase().includes('competitor')) {
      return `**Competitive Analysis: ${company}**\n\n` +
        `Compared to peers:\n` +
        `- Market Position: Leader in premium segment\n` +
        `- Revenue Growth: Above industry average\n` +
        `- Margin Profile: Strong gross margins vs competitors\n` +
        `- Innovation: Significant R&D investment in AI/ML`;
    }
    
    if (query.toLowerCase().includes('risk')) {
      return `**Risk Factors for ${company}:**\n\n` +
        `1. **China Exposure:** Regulatory and competitive pressures\n` +
        `2. **Supply Chain:** Concentration risk with key suppliers\n` +
        `3. **Competition:** Increasing pressure in mid-tier segments\n` +
        `4. **Macro:** Consumer spending sensitivity`;
    }
    
    if (query.toLowerCase().includes('thesis') || query.toLowerCase().includes('investment')) {
      return `**Investment Thesis: ${company}**\n\n` +
        `**Bull Case:**\n` +
        `- Services revenue acceleration\n` +
        `- AI integration driving upgrade cycle\n` +
        `- Strong cash generation\n\n` +
        `**Bear Case:**\n` +
        `- Hardware growth deceleration\n` +
        `- China market share loss\n\n` +
        `**Key Catalysts:** New product launches, AI features, services growth`;
    }
    
    if (query.toLowerCase().includes('outlook') || query.toLowerCase().includes('market')) {
      return `**Market Outlook: ${company}**\n\n` +
        `The technology sector remains well-positioned with:\n` +
        `- Strong enterprise spending on AI infrastructure\n` +
        `- Consumer demand resilient in premium segments\n` +
        `- Favorable interest rate environment\n\n` +
        `${company} is expected to benefit from these tailwinds.`;
    }
    
    return `Thank you for your question about ${company}. Based on current data, the company shows strong fundamentals with positive momentum in key growth areas. Would you like me to provide more specific analysis on any particular aspect?`;
  };

  // Send message to backend
  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay and generate response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: generateMockResponse(query, selectedTicker),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Handle approval dialog responses
  const handleApprove = () => {
    const query = approvalDialog.pendingQuery;
    setApprovalDialog({ ...approvalDialog, open: false, pendingQuery: '' });
    sendMessage(query);
  };

  const handleReject = () => {
    setApprovalDialog({ ...approvalDialog, open: false, pendingQuery: '' });
  };

  // Handle suggestion chip click
  const handleSuggestionClick = (query: string, requiresApproval: boolean) => {
    // Check if this is a compare competitors request
    if (query.toLowerCase().includes('compare') && query.toLowerCase().includes('competitor')) {
      setCompareDialogOpen(true);
      return;
    }
    
    if (requiresApproval) {
      setApprovalDialog({
        open: true,
        title: 'Generate Analysis',
        description: `This will use AI to generate a detailed analysis for ${companyNames[selectedTicker] || selectedTicker}. Do you want to proceed?`,
        pendingQuery: query,
      });
    } else {
      sendMessage(query);
    }
  };

  // Handle compare competitors action
  const handleCompareApprove = () => {
    setCompareDialogOpen(false);
    
    // Update the dashboard with the selected competitors
    if (dashboardContext?.setCompetitors) {
      dashboardContext.setCompetitors(selectedCompetitor1, selectedCompetitor2);
    }
    
    // Add user message
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: `Compare ${companyNames[selectedCompetitor1] || selectedCompetitor1} vs ${companyNames[selectedCompetitor2] || selectedCompetitor2}` 
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Add assistant response indicating dashboard was updated
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I've updated the **Competitor Analysis** section on the dashboard to compare **${companyNames[selectedCompetitor1] || selectedCompetitor1}** vs **${companyNames[selectedCompetitor2] || selectedCompetitor2}**.\n\nYou can see the side-by-side comparison with:\n- Stock prices and daily changes\n- Market capitalization\n- P/E ratios\n- 52-week ranges\n- AI-generated analysis summary\n\nScroll to the top of the dashboard to view the comparison.`,
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
  };

  const handleCompareReject = () => {
    setCompareDialogOpen(false);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Chat toggle button - only show when chat is closed */}
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            boxShadow: 3,
            zIndex: 1000,
          }}
          aria-label="Open Chat"
        >
          <ChatIcon />
        </IconButton>
      )}

      {/* Chat panel */}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 380,
            height: 550,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              PRISM Research Intelligence
            </Typography>
            <IconButton
              onClick={() => setIsOpen(false)}
              size="small"
              sx={{ color: 'white' }}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              backgroundColor: '#f5f5f5',
            }}
          >
            {/* Initial message */}
            {messages.length === 0 && (
              <Box sx={{ mb: 2 }}>
                <Paper sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Hi! I'm your AI research assistant. I'm currently analyzing{' '}
                    <strong>{companyNames[selectedTicker] || selectedTicker}</strong> ({selectedTicker}).
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Here are some things I can help you with:
                  </Typography>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li><Typography variant="body2">Analyze company fundamentals</Typography></li>
                    <li><Typography variant="body2">Compare with competitors</Typography></li>
                    <li><Typography variant="body2">Identify risk factors</Typography></li>
                    <li><Typography variant="body2">Generate investment thesis</Typography></li>
                  </ul>
                </Paper>
              </Box>
            )}

            {/* Chat messages */}
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '85%',
                    backgroundColor: message.role === 'user' ? 'primary.main' : 'white',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Paper sx={{ p: 1.5, backgroundColor: 'white', borderRadius: 2 }}>
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Suggestion chips - inside the chat panel */}
          <Box sx={{ px: 2, py: 1, backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Quick Actions:
            </Typography>
            <SuggestionChips 
              onSuggestionClick={handleSuggestionClick} 
              selectedTicker={selectedTicker} 
            />
          </Box>

          {/* Input area */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              backgroundColor: 'white',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about companies, analysis, or insights..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!inputValue.trim() || isLoading}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Approval Dialog */}
      <ApprovalDialog
        open={approvalDialog.open}
        title={approvalDialog.title}
        description={approvalDialog.description}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Compare Competitors Dialog */}
      <Dialog open={compareDialogOpen} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Compare color="primary" />
          Compare Competitors
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select two competitors to compare. The dashboard will be updated with a side-by-side analysis.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Competitor 1</InputLabel>
              <Select
                value={selectedCompetitor1}
                label="Competitor 1"
                onChange={(e) => setSelectedCompetitor1(e.target.value as string)}
              >
                {availableTickers.filter(t => t !== selectedCompetitor2).map(ticker => (
                  <MenuItem key={ticker} value={ticker}>
                    {ticker} - {companyNames[ticker]?.split(' ')[0] || ticker}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="h6" color="text.secondary">vs</Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Competitor 2</InputLabel>
              <Select
                value={selectedCompetitor2}
                label="Competitor 2"
                onChange={(e) => setSelectedCompetitor2(e.target.value as string)}
              >
                {availableTickers.filter(t => t !== selectedCompetitor1).map(ticker => (
                  <MenuItem key={ticker} value={ticker}>
                    {ticker} - {companyNames[ticker]?.split(' ')[0] || ticker}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCompareReject}
            startIcon={<Cancel />}
            color="error"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCompareApprove}
            startIcon={<CheckCircle />}
            color="success"
            variant="contained"
          >
            Compare & Update Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CopilotChat;
