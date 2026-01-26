import React, { useMemo } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
  Divider,
  InputBase,
} from '@mui/material';
import {
  Close,
  TrendingUp,
  History,
  Lightbulb,
  Search,
  AutoAwesome,
} from '@mui/icons-material';
import { SmartQuerySuggestion, SECTORS } from '../types';

interface SmartQueryDrawerProps {
  open: boolean;
  onClose: () => void;
  onQuerySelect: (query: string) => void;
  selectedTickers: string[];
  selectedSectors: string[];
}

const generateContextualSuggestions = (
  tickers: string[],
  sectors: string[]
): SmartQuerySuggestion[] => {
  const suggestions: SmartQuerySuggestion[] = [];

  if (tickers.length > 0) {
    tickers.forEach((ticker) => {
      suggestions.push({
        id: `${ticker}-analyst`,
        text: `What are analysts saying about ${ticker}?`,
        category: 'Analyst Insights',
        intent: 'analyst-opinion',
        icon: '👥',
      });
      suggestions.push({
        id: `${ticker}-earnings`,
        text: `Summarize recent earnings for ${ticker}`,
        category: 'Earnings Analysis',
        intent: 'earnings-thesis',
        icon: '📊',
      });
      suggestions.push({
        id: `${ticker}-management`,
        text: `What did ${ticker} management discuss in recent meetings?`,
        category: 'Management Insights',
        intent: 'management-meetings',
        icon: '🎯',
      });
      suggestions.push({
        id: `${ticker}-price`,
        text: `What are the current price targets for ${ticker}?`,
        category: 'Price Targets',
        intent: 'price-targets',
        icon: '💰',
      });
    });
  }

  if (sectors.length > 0) {
    sectors.forEach((sector) => {
      const sectorData = SECTORS.find(s => s.name === sector);
      const sectorTickers = sectorData?.tickers.slice(0, 3).join(', ') || '';
      
      suggestions.push({
        id: `${sector}-outlook`,
        text: `What's the outlook for the ${sector} sector?`,
        category: 'Sector Analysis',
        intent: 'company-sector',
        icon: '🔮',
      });
      suggestions.push({
        id: `${sector}-risks`,
        text: `What are the key risks in ${sector}?`,
        category: 'Risk Analysis',
        intent: 'thematic-analysis',
        icon: '⚠️',
      });
      suggestions.push({
        id: `${sector}-compare`,
        text: `Compare top performers in ${sector} (${sectorTickers})`,
        category: 'Comparative Analysis',
        intent: 'financial-metrics',
        icon: '📈',
      });
    });
  }

  if (tickers.length === 0 && sectors.length === 0) {
    suggestions.push(
      {
        id: 'general-1',
        text: 'What are the key market themes this quarter?',
        category: 'Market Overview',
        intent: 'thematic-analysis',
        icon: '🌐',
      },
      {
        id: 'general-2',
        text: 'Show me recent analyst upgrades and downgrades',
        category: 'Analyst Activity',
        intent: 'analyst-opinion',
        icon: '📋',
      },
      {
        id: 'general-3',
        text: 'What companies have upcoming earnings?',
        category: 'Earnings Calendar',
        intent: 'earnings-thesis',
        icon: '📅',
      },
      {
        id: 'general-4',
        text: 'Summarize recent M&A activity',
        category: 'M&A Intelligence',
        intent: 'thematic-analysis',
        icon: '🤝',
      }
    );
  }

  return suggestions;
};

const trendingQueries: SmartQuerySuggestion[] = [
  {
    id: 'trending-1',
    text: 'Impact of Fed rate decisions on tech stocks',
    category: 'Trending',
    intent: 'thematic-analysis',
    icon: '🔥',
  },
  {
    id: 'trending-2',
    text: 'AI chip demand outlook for 2025',
    category: 'Trending',
    intent: 'company-sector',
    icon: '🔥',
  },
  {
    id: 'trending-3',
    text: 'Healthcare sector M&A pipeline',
    category: 'Trending',
    intent: 'thematic-analysis',
    icon: '🔥',
  },
];

const recentQueries: SmartQuerySuggestion[] = [
  {
    id: 'recent-1',
    text: 'NVDA earnings beat analysis',
    category: 'Recent',
    intent: 'earnings-thesis',
    icon: '🕐',
  },
  {
    id: 'recent-2',
    text: 'Bank sector stress test results',
    category: 'Recent',
    intent: 'thematic-analysis',
    icon: '🕐',
  },
];

const SmartQueryDrawer: React.FC<SmartQueryDrawerProps> = ({
  open,
  onClose,
  onQuerySelect,
  selectedTickers,
  selectedSectors,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const contextualSuggestions = useMemo(
    () => generateContextualSuggestions(selectedTickers, selectedSectors),
    [selectedTickers, selectedSectors]
  );

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm) return contextualSuggestions;
    const lower = searchTerm.toLowerCase();
    return contextualSuggestions.filter(
      s => s.text.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower)
    );
  }, [contextualSuggestions, searchTerm]);

  const handleQueryClick = (query: string) => {
    onQuerySelect(query);
    onClose();
  };

  const renderSuggestionList = (
    suggestions: SmartQuerySuggestion[],
    title: string,
    icon: React.ReactNode
  ) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 1 }}>
        {icon}
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          {title}
        </Typography>
        <Chip label={suggestions.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
      </Box>
      <List sx={{ p: 0 }}>
        {suggestions.map((suggestion) => (
          <ListItem
            key={suggestion.id}
            component={Paper}
            elevation={0}
            sx={{
              mb: 1,
              cursor: 'pointer',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
                transform: 'translateX(4px)',
              },
            }}
            onClick={() => handleQueryClick(suggestion.text)}
          >
            <ListItemIcon sx={{ minWidth: 36, fontSize: '1.2rem' }}>
              {suggestion.icon}
            </ListItemIcon>
            <ListItemText
              primary={suggestion.text}
              secondary={suggestion.category}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: 500,
              }}
              secondaryTypographyProps={{
                variant: 'caption',
                color: 'primary.main',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 380 },
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome />
            <Typography variant="h6" fontWeight={600}>
              SMART Queries
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1,
              bgcolor: 'grey.100',
              borderRadius: 2,
            }}
          >
            <Search sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{ fontSize: '0.9rem' }}
            />
          </Paper>

          {(selectedTickers.length > 0 || selectedSectors.length > 0) && (
            <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 0.5 }}>
                Current Context:
              </Typography>
              {selectedTickers.map((ticker) => (
                <Chip
                  key={ticker}
                  label={ticker}
                  size="small"
                  sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
                />
              ))}
              {selectedSectors.map((sector) => (
                <Chip
                  key={sector}
                  label={sector}
                  size="small"
                  sx={{ bgcolor: 'secondary.main', color: 'primary.dark', fontWeight: 600 }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {filteredSuggestions.length > 0 && renderSuggestionList(
            filteredSuggestions,
            selectedTickers.length > 0 || selectedSectors.length > 0
              ? 'Based on Your Selection'
              : 'Suggested Queries',
            <Lightbulb sx={{ fontSize: 18, color: 'warning.main' }} />
          )}

          {!searchTerm && (
            <>
              <Divider sx={{ my: 2 }} />
              {renderSuggestionList(
                trendingQueries,
                'Trending Now',
                <TrendingUp sx={{ fontSize: 18, color: 'error.main' }} />
              )}

              {renderSuggestionList(
                recentQueries,
                'Recent Queries',
                <History sx={{ fontSize: 18, color: 'info.main' }} />
              )}
            </>
          )}
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            Press <strong>Ctrl+K</strong> to toggle this panel
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SmartQueryDrawer;
