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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Business,
} from '@mui/icons-material';
import CompanyDashboard from './components/CompanyDashboard';
import GlobalChat from './components/GlobalChat';

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

const drawerWidth = 280;

function App() {
  const menuItems = [
    { id: 'company-dashboard', label: 'Company Dashboard', icon: <Business /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{ 
            width: `calc(100% - ${drawerWidth}px)`, 
            ml: `${drawerWidth}px`,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            color: 'black',
            boxShadow: 'none',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  backgroundColor: 'primary.main',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                    P
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  PRISM
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 2 }}>
                Equities
              </Typography>
            </Box>
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

        {/* Sidebar */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 2, position: 'relative', height: 'calc(100vh - 64px)' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={true}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default', 
            p: 3,
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          <CompanyDashboard />
        </Box>

        <GlobalChat files={[]} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
