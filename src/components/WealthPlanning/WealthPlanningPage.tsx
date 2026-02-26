import React, { useState } from 'react';
import { Box, Typography, AppBar, Toolbar } from '@mui/material';
import AssistantCard from './AssistantCard';
import ChatModal from './ChatModal';
import { AgentConfig } from './types';

const agents: AgentConfig[] = [
  {
    agent_id: 'insurance_advisory',
    department: 'wealth_planning',
    name: 'Insurance Advisory Assistant',
    description: 'This assistant helps with:',
    capabilities: [
      'Policy comparison',
      'Multi-provider insurance evaluation',
      'Coverage analysis',
      'Premium structure breakdown',
      'Risk gap identification',
    ],
  },
];

const WealthPlanningPage: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);

  const handleLaunch = (agent: AgentConfig) => {
    setSelectedAgent(agent);
    setChatOpen(true);
  };

  const handleClose = () => {
    setChatOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7f6' }}>
      {/* Wealth Planning Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: '#1a3a2a',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: 56 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.5px',
              fontSize: '1.1rem',
            }}
          >
            Wealth Planning
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 56px - 64px)',
          px: 3,
          py: 6,
        }}
      >
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a2e23',
            mb: 1,
            textAlign: 'center',
          }}
        >
          AI Assistants
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#6b7c72',
            mb: 5,
            textAlign: 'center',
            maxWidth: 480,
          }}
        >
          Select an assistant to get started with AI-powered advisory services.
        </Typography>

        {/* Agent Cards Grid */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {agents.map((agent) => (
            <AssistantCard
              key={agent.agent_id}
              agent={agent}
              onLaunch={handleLaunch}
            />
          ))}
        </Box>
      </Box>

      {/* Chat Modal */}
      {selectedAgent && (
        <ChatModal
          open={chatOpen}
          onClose={handleClose}
          agent={selectedAgent}
        />
      )}
    </Box>
  );
};

export default WealthPlanningPage;
