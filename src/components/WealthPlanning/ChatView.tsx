import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Send,
  SmartToy,
  ArrowBack,
  PlayArrow,
  GroupAdd,
  History,
  Search,
} from '@mui/icons-material';
import { AgentConfig, ChatMessage } from './types';

interface ChatViewProps {
  agent: AgentConfig;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ agent, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Hi there!\n\nI'm the ${agent.name}. I can help you with policy comparison, multi-provider insurance evaluation, coverage analysis, premium structure breakdown, and risk gap identification.\n\nHow would you like to begin?`,
        timestamp: new Date(),
      },
    ]);
  }, [agent.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(input.trim()),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sidebarWidth = 300;

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Left Sidebar - Agent Info */}
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          borderRight: '1px solid #e0e0e0',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Agent Header */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid #e8ece9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: '#1a3a2a',
                width: 48,
                height: 48,
              }}
            >
              <SmartToy sx={{ fontSize: 26 }} />
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, lineHeight: 1.2, color: '#1a2e23' }}
              >
                {agent.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7c72' }}>
                {agent.description}
              </Typography>
            </Box>
          </Box>
          {/* Capabilities */}
          <Box sx={{ mt: 1 }}>
            {agent.capabilities.map((cap, idx) => (
              <Typography
                key={idx}
                variant="caption"
                sx={{
                  display: 'block',
                  color: '#5a6b62',
                  py: 0.3,
                  fontSize: '0.75rem',
                }}
              >
                {cap}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Sidebar Actions */}
        <List sx={{ px: 1, py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={onBack}
              sx={{ borderRadius: 1, py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ArrowBack sx={{ fontSize: 20, color: '#5a6b62' }} />
              </ListItemIcon>
              <ListItemText
                primary="Back to Assistants"
                primaryTypographyProps={{ fontSize: '0.85rem', color: '#3a4a42' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PlayArrow sx={{ fontSize: 20, color: '#5a6b62' }} />
              </ListItemIcon>
              <ListItemText
                primary="New Agent Run"
                primaryTypographyProps={{ fontSize: '0.85rem', color: '#3a4a42' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <GroupAdd sx={{ fontSize: 20, color: '#5a6b62' }} />
              </ListItemIcon>
              <ListItemText
                primary="Add to Team"
                primaryTypographyProps={{ fontSize: '0.85rem', color: '#3a4a42' }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ mx: 2 }} />

        {/* Agent History */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History sx={{ fontSize: 18, color: '#6b7c72' }} />
            <Typography variant="body2" sx={{ color: '#3a4a42', fontWeight: 600, fontSize: '0.85rem' }}>
              Your Agent History
            </Typography>
          </Box>
          <Search sx={{ fontSize: 18, color: '#6b7c72', cursor: 'pointer' }} />
        </Box>
      </Box>

      {/* Right Side - Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#faf8f5',
        }}
      >
        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            px: { xs: 2, md: 6 },
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 1.5,
                maxWidth: '800px',
                mx: 'auto',
                width: '100%',
              }}
            >
              {msg.role === 'assistant' && (
                <Avatar
                  sx={{
                    bgcolor: '#1a3a2a',
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <SmartToy sx={{ fontSize: 20 }} />
                </Avatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  px: 2.5,
                  maxWidth: '75%',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  backgroundColor: msg.role === 'user' ? '#1a3a2a' : 'white',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                  border: msg.role === 'assistant' ? '1px solid #e8ece9' : 'none',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '0.95rem' }}
                >
                  {msg.content}
                </Typography>
              </Paper>
              {msg.role === 'user' && (
                <Avatar
                  sx={{
                    bgcolor: '#1a3a2a',
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>T</Typography>
                </Avatar>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            px: { xs: 2, md: 6 },
            pb: 3,
            pt: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              maxWidth: 800,
              width: '100%',
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                border: '1px solid #d4d8d6',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'flex-end',
                px: 2,
                py: 0.5,
                bgcolor: 'white',
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    py: 1,
                    fontSize: '0.95rem',
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{
                  bgcolor: input.trim() ? '#1a3a2a' : 'transparent',
                  color: input.trim() ? 'white' : '#999',
                  '&:hover': { bgcolor: input.trim() ? '#2a5a3a' : 'transparent' },
                  '&.Mui-disabled': { color: '#bbb' },
                  borderRadius: 2,
                  width: 36,
                  height: 36,
                  mb: 0.5,
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </IconButton>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function getSimulatedResponse(userInput: string): string {
  const lower = userInput.toLowerCase();

  if (lower.includes('policy') || lower.includes('compare')) {
    return 'I can help you compare insurance policies. To provide a thorough comparison, I\'ll need:\n\n1. The policy types you\'re considering\n2. Coverage amounts required\n3. Specific providers you\'re evaluating\n\nCould you share those details?';
  }
  if (lower.includes('premium') || lower.includes('cost') || lower.includes('price')) {
    return 'Premium structures vary based on several factors:\n\n- Coverage type and limits\n- Policyholder profile and risk factors\n- Provider pricing models\n\nI can break down the premium components including base rate, risk adjustments, and any applicable riders. What specific policy type would you like me to analyze?';
  }
  if (lower.includes('coverage') || lower.includes('gap')) {
    return 'Coverage gap analysis is critical for comprehensive risk management. I\'ll review your current coverage against potential risk exposures to identify any gaps.\n\nCould you describe your current insurance portfolio so I can begin the analysis?';
  }
  if (lower.includes('risk')) {
    return 'Risk assessment involves evaluating both the likelihood and potential impact of various scenarios.\n\nI can help you:\n- Identify key risk factors\n- Recommend appropriate coverage levels\n- Map risks to suitable insurance products\n\nWhat specific risks are you looking to address?';
  }
  if (lower.includes('provider') || lower.includes('vendor') || lower.includes('insurer')) {
    return 'I can evaluate multiple insurance providers across these dimensions:\n\n- Financial stability ratings\n- Claim settlement ratios\n- Premium competitiveness\n- Service quality metrics\n\nWhich providers or coverage types would you like me to evaluate?';
  }
  return 'Thank you for your question. As your Insurance Advisory Assistant, I can help with:\n\n- Policy comparisons\n- Coverage analysis\n- Premium breakdowns\n- Risk gap identification\n\nCould you provide more specific details about what you\'d like to explore?';
}

export default ChatView;
