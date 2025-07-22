import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Badge,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Notifications, NotificationsActive } from '@mui/icons-material';
import { TickerSubscription, TeamSubscription } from '../types';

interface SubscriptionsManagerProps {
  tickerSubscriptions: TickerSubscription[];
  teamSubscriptions: TeamSubscription[];
  onTickerSubscriptionChange: (ticker: string, subscribed: boolean) => Promise<void>;
  onTeamSubscriptionChange: (team: string, subscribed: boolean) => Promise<void>;
  availableTickers: string[];
  availableTeams: string[];
}

const SubscriptionsManager: React.FC<SubscriptionsManagerProps> = ({
  tickerSubscriptions,
  teamSubscriptions,
  onTickerSubscriptionChange,
  onTeamSubscriptionChange,
  availableTickers,
  availableTeams,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loadingTickers, setLoadingTickers] = useState<Set<string>>(new Set());
  const [loadingTeams, setLoadingTeams] = useState<Set<string>>(new Set());
  const [tabValue, setTabValue] = useState(0);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTickerSubscriptionToggle = async (ticker: string, subscribed: boolean) => {
    setLoadingTickers(prev => new Set(prev).add(ticker));
    try {
      await onTickerSubscriptionChange(ticker, subscribed);
    } catch (error) {
      console.error(`Failed to ${subscribed ? 'subscribe to' : 'unsubscribe from'} ${ticker}:`, error);
    } finally {
      setLoadingTickers(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticker);
        return newSet;
      });
    }
  };

  const handleTeamSubscriptionToggle = async (team: string, subscribed: boolean) => {
    setLoadingTeams(prev => new Set(prev).add(team));
    try {
      await onTeamSubscriptionChange(team, subscribed);
    } catch (error) {
      console.error(`Failed to ${subscribed ? 'subscribe to' : 'unsubscribe from'} team ${team}:`, error);
    } finally {
      setLoadingTeams(prev => {
        const newSet = new Set(prev);
        newSet.delete(team);
        return newSet;
      });
    }
  };

  const subscribedTickerCount = tickerSubscriptions.filter(sub => sub.subscribed).length;
  const subscribedTeamCount = teamSubscriptions.filter(sub => sub.subscribed).length;
  const totalSubscribedCount = subscribedTickerCount + subscribedTeamCount;

  return (
    <Box>
      <Button
        onClick={handleClick}
        startIcon={
          <Badge badgeContent={totalSubscribedCount} color="primary">
            {totalSubscribedCount > 0 ? <NotificationsActive /> : <Notifications />}
          </Badge>
        }
        variant="outlined"
        size="small"
        sx={{
          textTransform: 'none',
          borderColor: 'grey.300',
          color: 'text.primary',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
          },
        }}
      >
        Subscriptions
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 250,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Subscription Management
          </Typography>
        </Box>
        <Divider />
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Tickers" />
          <Tab label="Teams" />
        </Tabs>
        
        {tabValue === 0 && (
          <Box>
            {availableTickers.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  No tickers available
                </Typography>
              </MenuItem>
            ) : (
              availableTickers.map((ticker) => {
                const subscription = tickerSubscriptions.find(sub => sub.ticker === ticker);
                const isSubscribed = subscription?.subscribed || false;
                
                return (
                  <MenuItem key={ticker} onClick={(e) => e.stopPropagation()}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSubscribed}
                          onChange={(e) => handleTickerSubscriptionToggle(ticker, e.target.checked)}
                          size="small"
                          disabled={loadingTickers.has(ticker)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                              color: isSubscribed ? 'primary.main' : 'text.primary',
                            }}
                          >
                            {ticker}
                          </Typography>
                          {loadingTickers.has(ticker) ? (
                            <CircularProgress size={12} />
                          ) : isSubscribed ? (
                            <Typography variant="caption" color="success.main">
                              ✓
                            </Typography>
                          ) : null}
                        </Box>
                      }
                      sx={{ margin: 0, width: '100%' }}
                    />
                  </MenuItem>
                );
              })
            )}
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            {availableTeams.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  No teams available
                </Typography>
              </MenuItem>
            ) : (
              availableTeams.map((team) => {
                const subscription = teamSubscriptions.find(sub => sub.team === team);
                const isSubscribed = subscription?.subscribed || false;
                
                return (
                  <MenuItem key={team} onClick={(e) => e.stopPropagation()}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSubscribed}
                          onChange={(e) => handleTeamSubscriptionToggle(team, e.target.checked)}
                          size="small"
                          disabled={loadingTeams.has(team)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: isSubscribed ? 'secondary.main' : 'text.primary',
                            }}
                          >
                            {team}
                          </Typography>
                          {loadingTeams.has(team) ? (
                            <CircularProgress size={12} />
                          ) : isSubscribed ? (
                            <Typography variant="caption" color="success.main">
                              ✓
                            </Typography>
                          ) : null}
                        </Box>
                      }
                      sx={{ margin: 0, width: '100%' }}
                    />
                  </MenuItem>
                );
              })
            )}
          </Box>
        )}
        
        {totalSubscribedCount > 0 && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {subscribedTickerCount} ticker{subscribedTickerCount !== 1 ? 's' : ''}, {subscribedTeamCount} team{subscribedTeamCount !== 1 ? 's' : ''} subscribed
              </Typography>
            </Box>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default SubscriptionsManager;
