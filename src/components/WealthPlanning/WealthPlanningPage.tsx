import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AssistantCard from './AssistantCard';
import ChatView from './ChatView';
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
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);

  const handleLaunch = (agent: AgentConfig) => {
    setSelectedAgent(agent);
  };

  const handleBack = () => {
    setSelectedAgent(null);
  };

  // Full-page chat view when agent is selected
  if (selectedAgent) {
    return <ChatView agent={selectedAgent} onBack={handleBack} />;
  }

  // Agent cards view
  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          px: 3,
          py: 6,
        }}
      >
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
    </Box>
  );
};

export default WealthPlanningPage;
