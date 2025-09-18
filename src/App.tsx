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
import {
  Chat,
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      dark: '#1b5e20',
      light: '#4caf50',
    },
    secondary: {
      main: '#81c784',
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            width: '100%',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            color: 'black',
            boxShadow: 'none',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">
                Logged in as: test
              </Typography>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400' }}>
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
            bgcolor: 'background.default', 
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 64px)',
            textAlign: 'center',
            position: 'relative'
          }}>
            <Typography variant="h2" sx={{ 
              color: 'text.primary', 
              fontWeight: 'normal',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
            }}>
              Advisor Virtual Assistant Playground
            </Typography>
            
            <Box sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 3,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}>
              <Chat sx={{ color: 'white', fontSize: 28 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
