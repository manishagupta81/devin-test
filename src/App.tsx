import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  FolderOpen,
  SmartToy,
  Dashboard,
  Settings,
  Science,
  Android as AndroidIcon,
  ExpandLess,
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

const drawerWidth = 280;

function App() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Dashboard /> },
    { id: 'ai-reports', label: 'AI Generated Reports', icon: <SmartToy /> },
    { id: 'external-files', label: 'External Files', icon: <FolderOpen /> },
    { id: 'internal-research', label: 'Internal Research', icon: <Science /> },
    { id: 'agents', label: 'Agents', icon: <AndroidIcon /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
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
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  label="Department"
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Select an option</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                </Select>
              </FormControl>
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
                    selected={selectedMenuItem === item.id}
                    onClick={() => setSelectedMenuItem(item.id)}
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
            <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
              <ListItemButton
                sx={{
                  borderRadius: 1,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <ExpandLess />
                </ListItemIcon>
                <ListItemText primary="Collapse" />
              </ListItemButton>
            </Box>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default', 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Toolbar />
          
          {selectedDepartment ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Department: {selectedDepartment}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Content for {selectedDepartment} department would be displayed here.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 2, color: 'text.primary', fontWeight: 'normal' }}>
                No Department Selected
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please select a department from the menu to view<br />
                its information.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
