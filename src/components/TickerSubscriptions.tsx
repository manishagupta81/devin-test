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
} from '@mui/material';
import { Notifications, NotificationsActive } from '@mui/icons-material';
import { TickerSubscription } from '../types';

interface TickerSubscriptionsProps {
  subscriptions: TickerSubscription[];
  onSubscriptionChange: (ticker: string, subscribed: boolean) => Promise<void>;
  availableTickers: string[];
}

const TickerSubscriptions: React.FC<TickerSubscriptionsProps> = ({
  subscriptions,
  onSubscriptionChange,
  availableTickers,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loadingTickers, setLoadingTickers] = useState<Set<string>>(new Set());
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubscriptionToggle = async (ticker: string, subscribed: boolean) => {
    setLoadingTickers(prev => new Set(prev).add(ticker));
    try {
      await onSubscriptionChange(ticker, subscribed);
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

  const subscribedCount = subscriptions.filter(sub => sub.subscribed).length;

  return (
    <Box>
      <Button
        onClick={handleClick}
        startIcon={
          <Badge badgeContent={subscribedCount} color="primary">
            {subscribedCount > 0 ? <NotificationsActive /> : <Notifications />}
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
        Tickers
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
            minWidth: 200,
            maxHeight: 300,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Ticker Subscriptions
          </Typography>
        </Box>
        <Divider />
        {availableTickers.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No tickers available
            </Typography>
          </MenuItem>
        ) : (
          availableTickers.map((ticker) => {
            const subscription = subscriptions.find(sub => sub.ticker === ticker);
            const isSubscribed = subscription?.subscribed || false;
            
            return (
              <MenuItem key={ticker} onClick={(e) => e.stopPropagation()}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isSubscribed}
                      onChange={(e) => handleSubscriptionToggle(ticker, e.target.checked)}
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
        {subscribedCount > 0 && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {subscribedCount} ticker{subscribedCount !== 1 ? 's' : ''} subscribed
              </Typography>
            </Box>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default TickerSubscriptions;
