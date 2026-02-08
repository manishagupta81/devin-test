import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  TrendingUp,
  Assessment,
  Compare,
  Warning,
  Lightbulb,
} from '@mui/icons-material';
import { CopilotPopup } from '@copilotkit/react-ui';
import { useCopilotReadable } from '@copilotkit/react-core';
import { DashboardStateContext } from '../App';
import '@copilotkit/react-ui/styles.css';

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

// Suggestion chips component
interface SuggestionChipsProps {
  onSuggestionClick: (suggestion: string) => void;
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
      query: `Provide a comprehensive analysis of ${companyNames[selectedTicker] || selectedTicker} (${selectedTicker}) including key metrics, recent performance, and outlook.`
    },
    { 
      label: 'Compare competitors', 
      icon: <Compare sx={{ fontSize: 16 }} />,
      query: `Compare ${companyNames[selectedTicker] || selectedTicker} with its main competitors in terms of market position, financials, and growth prospects.`
    },
    { 
      label: 'Show risk factors', 
      icon: <Warning sx={{ fontSize: 16 }} />,
      query: `What are the key risk factors and potential headwinds for ${companyNames[selectedTicker] || selectedTicker}?`
    },
    { 
      label: 'Investment thesis', 
      icon: <Lightbulb sx={{ fontSize: 16 }} />,
      query: `Generate an investment thesis for ${companyNames[selectedTicker] || selectedTicker} including bull case, bear case, and key catalysts.`
    },
    { 
      label: 'Market outlook', 
      icon: <TrendingUp sx={{ fontSize: 16 }} />,
      query: `What is the current market outlook for ${companyNames[selectedTicker] || selectedTicker} and its sector?`
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {suggestions.map((suggestion, index) => (
        <Chip
          key={index}
          label={suggestion.label}
          icon={suggestion.icon}
          onClick={() => onSuggestionClick(suggestion.query)}
          sx={{
            cursor: 'pointer',
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
  const setSelectedTicker = dashboardContext?.setSelectedTicker;

  // State for human-in-the-loop approval
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: (() => void) | null;
  }>({
    open: false,
    title: '',
    description: '',
    action: null,
  });

  // Make dashboard state readable by the copilot
  useCopilotReadable({
    description: 'The currently selected stock ticker symbol',
    value: selectedTicker,
  });

  useCopilotReadable({
    description: 'The company name for the selected ticker',
    value: companyNames[selectedTicker] || selectedTicker,
  });

  useCopilotReadable({
    description: 'List of available stock tickers that can be analyzed',
    value: availableTickers.join(', '),
  });

  // Handle approval dialog responses
  const handleApprove = () => {
    if (approvalDialog.action) {
      approvalDialog.action();
    }
    setApprovalDialog({ ...approvalDialog, open: false, action: null });
  };

  const handleReject = () => {
    setApprovalDialog({ ...approvalDialog, open: false, action: null });
  };

  // Function to request approval for an action (Human-in-the-Loop)
  const requestApproval = (title: string, description: string, action: () => void) => {
    setApprovalDialog({
      open: true,
      title,
      description,
      action,
    });
  };

  // Handle suggestion chip click - demonstrates HITL for certain actions
  const handleSuggestionClick = (query: string) => {
    // For investment thesis and comparison queries, show approval dialog
    if (query.includes('investment thesis') || query.includes('Compare')) {
      requestApproval(
        'Generate Analysis',
        `This will use AI to generate a detailed analysis. Do you want to proceed?`,
        () => {
          console.log('User approved analysis for query:', query);
        }
      );
    }
  };

  return (
    <>
      <CopilotPopup
        instructions={`You are PRISM Research Intelligence, an AI-powered investment research assistant for the Equity Investments team.

Current Context:
- Selected Ticker: ${selectedTicker}
- Company: ${companyNames[selectedTicker] || selectedTicker}
- Available Tickers: ${availableTickers.join(', ')}

Your capabilities:
1. Analyze companies and provide investment insights
2. Compare competitors and market positioning
3. Identify risk factors and opportunities
4. Generate investment reports
5. Perform trade analysis
6. Provide market outlook and sector analysis

Guidelines:
- Be concise and professional in your responses
- Focus on actionable insights for equity research
- Reference specific data points and metrics when available
- Provide balanced analysis including both bull and bear cases
- When users ask to change tickers, remind them they can use the dropdown in the dashboard header

Remember: You are assisting professional equity analysts, so maintain a high level of financial sophistication in your responses.`}
        labels={{
          title: 'PRISM Research Intelligence',
          initial: `Hi! I'm your AI research assistant. I'm currently analyzing ${companyNames[selectedTicker] || selectedTicker} (${selectedTicker}). 

Here are some things I can help you with:
- Analyze company fundamentals and performance
- Compare with competitors
- Identify risk factors and opportunities
- Generate investment thesis

How can I help you today?`,
          placeholder: 'Ask about companies, analysis, or insights...',
        }}
        shortcut="mod+/"
        className="prism-copilot-popup"
      />

      <ApprovalDialog
        open={approvalDialog.open}
        title={approvalDialog.title}
        description={approvalDialog.description}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Suggestion chips displayed in a fixed position */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 1000,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 1,
          boxShadow: 3,
          maxWidth: 300,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Quick Actions:
        </Typography>
        <SuggestionChips 
          onSuggestionClick={handleSuggestionClick} 
          selectedTicker={selectedTicker} 
        />
      </Box>
    </>
  );
};

export default CopilotChat;
