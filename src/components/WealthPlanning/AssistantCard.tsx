import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import { SmartToy, PlayArrow } from '@mui/icons-material';
import { AgentConfig } from './types';

interface AssistantCardProps {
  agent: AgentConfig;
  onLaunch: (agent: AgentConfig) => void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ agent, onLaunch }) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: { xs: '100%', sm: 440 },
        borderRadius: 3,
        border: '1px solid #e8ece9',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(26, 58, 42, 0.12)',
          transform: 'translateY(-2px)',
        },
        overflow: 'hidden',
      }}
    >
      {/* Card Header Accent */}
      <Box
        sx={{
          height: 6,
          background: 'linear-gradient(90deg, #1a3a2a 0%, #2e7d32 50%, #4caf50 100%)',
        }}
      />

      <CardContent sx={{ p: 3.5 }}>
        {/* Agent Icon & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
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
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1a2e23',
                fontSize: '1.1rem',
                lineHeight: 1.2,
              }}
            >
              {agent.name}
            </Typography>
            <Chip
              label={agent.department.replace('_', ' ')}
              size="small"
              sx={{
                mt: 0.5,
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                bgcolor: 'rgba(26, 58, 42, 0.08)',
                color: '#1a3a2a',
              }}
            />
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#4a5a52',
            mb: 2,
            fontWeight: 500,
          }}
        >
          {agent.description}
        </Typography>

        {/* Capabilities List */}
        <Box sx={{ mb: 3 }}>
          {agent.capabilities.map((capability, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 0.6,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#2e7d32',
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: '#5a6b62', fontSize: '0.85rem' }}
              >
                {capability}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Launch Button */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<PlayArrow />}
          onClick={() => onLaunch(agent)}
          sx={{
            bgcolor: '#1a3a2a',
            color: 'white',
            py: 1.3,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            letterSpacing: '0.3px',
            '&:hover': {
              bgcolor: '#2a5a3a',
              boxShadow: '0 4px 16px rgba(26, 58, 42, 0.25)',
            },
          }}
        >
          Launch Assistant
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssistantCard;
