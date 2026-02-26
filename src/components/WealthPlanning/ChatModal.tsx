import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
} from '@mui/material';
import { Close, Send, SmartToy } from '@mui/icons-material';
import { AgentConfig, ChatMessage } from './types';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  agent: AgentConfig;
}

const ChatModal: React.FC<ChatModalProps> = ({ open, onClose, agent }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm the ${agent.name}. I can help you with policy comparison, multi-provider insurance evaluation, coverage analysis, premium structure breakdown, and risk gap identification. How can I assist you today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [open, agent.name]);

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

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(input.trim()),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: '600px',
          maxHeight: '80vh',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: '#1a3a2a',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          px: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              width: 36,
              height: 36,
            }}
          >
            <SmartToy sx={{ fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {agent.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {agent.department} Department
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Messages Area */}
      <DialogContent
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2.5,
          backgroundColor: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              gap: 1,
            }}
          >
            {msg.role === 'assistant' && (
              <Avatar
                sx={{
                  bgcolor: '#1a3a2a',
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  mt: 0.5,
                }}
              >
                <SmartToy sx={{ fontSize: 18 }} />
              </Avatar>
            )}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                px: 2,
                maxWidth: '80%',
                borderRadius: 2,
                backgroundColor: msg.role === 'user' ? '#1a3a2a' : 'white',
                color: msg.role === 'user' ? 'white' : 'text.primary',
                border: msg.role === 'assistant' ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {msg.content}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  opacity: 0.6,
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </DialogContent>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #e0e0e0',
          backgroundColor: 'white',
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f8f9fa',
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!input.trim()}
          sx={{
            bgcolor: '#1a3a2a',
            color: 'white',
            '&:hover': { bgcolor: '#2a5a3a' },
            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#999' },
            borderRadius: 2,
            width: 40,
            height: 40,
          }}
        >
          <Send sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Dialog>
  );
};

function getSimulatedResponse(userInput: string): string {
  const lower = userInput.toLowerCase();

  if (lower.includes('policy') || lower.includes('compare')) {
    return 'I can help you compare insurance policies. To provide a thorough comparison, I\'ll need the policy types you\'re considering, the coverage amounts, and any specific providers you\'re evaluating. Could you share those details?';
  }
  if (lower.includes('premium') || lower.includes('cost') || lower.includes('price')) {
    return 'Premium structures vary based on coverage type, policyholder profile, and provider. I can break down the premium components including base rate, risk adjustments, and any applicable riders. What specific policy type would you like me to analyze?';
  }
  if (lower.includes('coverage') || lower.includes('gap')) {
    return 'Coverage gap analysis is critical for comprehensive risk management. I\'ll review your current coverage against potential risk exposures to identify any gaps. Could you describe your current insurance portfolio?';
  }
  if (lower.includes('risk')) {
    return 'Risk assessment involves evaluating both the likelihood and potential impact of various scenarios. I can help identify key risk factors and recommend appropriate coverage levels. What specific risks are you looking to address?';
  }
  if (lower.includes('provider') || lower.includes('vendor') || lower.includes('insurer')) {
    return 'I can evaluate multiple insurance providers across dimensions like financial stability, claim settlement ratios, premium competitiveness, and service quality. Which providers or coverage types would you like me to evaluate?';
  }
  return 'Thank you for your question. As your Insurance Advisory Assistant, I can help with policy comparisons, coverage analysis, premium breakdowns, and risk gap identification. Could you provide more specific details about what you\'d like to explore?';
}

export default ChatModal;
