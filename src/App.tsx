import React from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
} from '@mui/material';
import { WealthPlanningPage } from './components/WealthPlanning';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a3a2a',
      dark: '#0f2419',
      light: '#2e7d32',
    },
    secondary: {
      main: '#81c784',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />

        {/* Header */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: '#1a3a2a',
            color: 'white',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 28,
                height: 28,
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '13px' }}>
                  W
                </Typography>
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                Wealth Planning
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Logged in as: test
              </Typography>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Typography variant="body2" sx={{ fontSize: '14px' }}>T</Typography>
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#f5f7f6',
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          <WealthPlanningPage />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
