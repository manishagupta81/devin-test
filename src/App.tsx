import React, { useState, useEffect } from 'react';
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
import { FileItem, FileCategory, TickerSubscription, TeamSubscription } from './types';
import FileList from './components/FileList';
import FileUpload from './components/FileUpload';
import SubscriptionsManager from './components/SubscriptionsManager';

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

// Mock initial files
const initialFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Requirements.pdf',
    author: 'Alice Smith',
    tags: ['requirements', 'project'],
    category: 'internal',
    uploadDate: new Date('2024-01-15'),
    size: 2048000,
    type: 'application/pdf',
    ticker: 'AAPL',
    team: 'Engineering',
  },
  {
    id: '2',
    name: 'External API Documentation.docx',
    author: 'Bob Johnson',
    tags: ['api', 'documentation'],
    category: 'external',
    uploadDate: new Date('2024-01-10'),
    size: 1024000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ticker: 'GOOGL',
    team: 'Marketing',
  },
  {
    id: '3',
    name: 'AI Analysis Report.xlsx',
    author: 'AI Assistant',
    tags: ['analysis', 'report', 'ai'],
    category: 'ai-generated',
    uploadDate: new Date('2024-01-20'),
    size: 512000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ticker: 'MSFT',
    team: 'Sales',
  },
];

function App() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('overview');
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [tickerSubscriptions, setTickerSubscriptions] = useState<TickerSubscription[]>([]);
  const [teamSubscriptions, setTeamSubscriptions] = useState<TeamSubscription[]>([]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Dashboard /> },
    { id: 'ai-reports', label: 'AI Generated Reports', icon: <SmartToy /> },
    { id: 'external-files', label: 'External Files', icon: <FolderOpen /> },
    { id: 'internal-research', label: 'Internal Research', icon: <Science /> },
    { id: 'agents', label: 'Agents', icon: <AndroidIcon /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  useEffect(() => {
    let filtered: FileItem[] = [];
    switch (selectedMenuItem) {
      case 'ai-reports':
        filtered = files.filter(file => file.category === 'ai-generated');
        break;
      case 'external-files':
        filtered = files.filter(file => file.category === 'external');
        break;
      case 'internal-research':
        filtered = files.filter(file => file.category === 'internal');
        break;
      case 'overview':
        filtered = files;
        break;
      default:
        filtered = [];
    }
    setFilteredFiles(filtered);
  }, [files, selectedMenuItem]);

  const handleFileUpload = (newFile: FileItem) => {
    setFiles(prev => [...prev, newFile]);
  };

  const handleFileOpen = (file: FileItem) => {
    if (file.url) {
      window.open(file.url, '_blank');
    } else if (file.file) {
      const url = URL.createObjectURL(file.file);
      window.open(url, '_blank');
    } else {
      alert(`Opening ${file.name}...`);
    }
  };

  const getFileCategory = (): FileCategory => {
    switch (selectedMenuItem) {
      case 'ai-reports':
        return 'ai-generated';
      case 'external-files':
        return 'external';
      case 'internal-research':
        return 'internal';
      case 'overview':
        return 'all';
      default:
        return 'all';
    }
  };

  const handleSubscriptionChange = async (ticker: string, subscribed: boolean): Promise<void> => {
    try {
      const { mockSubscriptionApi } = await import('./services/mockApi');
      
      const result = await mockSubscriptionApi.updateSubscription({
        ticker,
        subscribed,
        userId: 'test-user',
        type: 'ticker',
      });
      
      setTickerSubscriptions(prev => 
        prev.map(sub => 
          sub.ticker === ticker 
            ? { ...sub, subscribed, lastUpdate: new Date() }
            : sub
        )
      );

      console.log(`Successfully ${subscribed ? 'subscribed to' : 'unsubscribed from'} ${ticker}`, result);
    } catch (error) {
      console.error('API call failed, updating local state only:', error);
      
      setTickerSubscriptions(prev => 
        prev.map(sub => 
          sub.ticker === ticker 
            ? { ...sub, subscribed, lastUpdate: new Date() }
            : sub
        )
      );
      
      throw error;
    }
  };

  const getAvailableTickers = (): string[] => {
    return Array.from(new Set(files.map(file => file.ticker).filter(Boolean))) as string[];
  };

  const getAvailableTeams = (): string[] => {
    return Array.from(new Set(files.map(file => file.team).filter(Boolean))) as string[];
  };

  const handleTeamSubscriptionChange = async (team: string, subscribed: boolean): Promise<void> => {
    try {
      const { mockSubscriptionApi } = await import('./services/mockApi');
      
      const result = await mockSubscriptionApi.updateSubscription({
        team,
        subscribed,
        userId: 'test-user',
        type: 'team',
      });
      
      setTeamSubscriptions(prev => 
        prev.map(sub => 
          sub.team === team 
            ? { ...sub, subscribed, lastUpdate: new Date() }
            : sub
        )
      );

      console.log(`Successfully ${subscribed ? 'subscribed to' : 'unsubscribed from'} team ${team}`, result);
    } catch (error) {
      console.error('API call failed, updating local state only:', error);
      
      setTeamSubscriptions(prev => 
        prev.map(sub => 
          sub.team === team 
            ? { ...sub, subscribed, lastUpdate: new Date() }
            : sub
        )
      );
      
      throw error;
    }
  };

  useEffect(() => {
    const availableTickers = Array.from(new Set(files.map(file => file.ticker).filter(Boolean)));
    const newTickerSubscriptions = availableTickers.map(ticker => ({
      ticker: ticker!,
      subscribed: false,
      lastUpdate: new Date(),
    }));
    setTickerSubscriptions(newTickerSubscriptions);

    const availableTeams = Array.from(new Set(files.map(file => file.team).filter(Boolean)));
    const newTeamSubscriptions = availableTeams.map(team => ({
      team: team!,
      subscribed: false,
      lastUpdate: new Date(),
    }));
    setTeamSubscriptions(newTeamSubscriptions);
  }, [files]);

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
              <SubscriptionsManager 
                tickerSubscriptions={tickerSubscriptions}
                teamSubscriptions={teamSubscriptions}
                onTickerSubscriptionChange={handleSubscriptionChange}
                onTeamSubscriptionChange={handleTeamSubscriptionChange}
                availableTickers={getAvailableTickers()}
                availableTeams={getAvailableTeams()}
              />
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
            p: 3,
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          
          {!selectedDepartment ? (
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 200px)',
              textAlign: 'center'
            }}>
              <Box>
                <Typography variant="h4" sx={{ mb: 2, color: 'text.primary', fontWeight: 'normal' }}>
                  No Department Selected
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please select a department from the menu to view<br />
                  its information.
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              {(selectedMenuItem === 'overview' || selectedMenuItem === 'ai-reports' || selectedMenuItem === 'external-files' || selectedMenuItem === 'internal-research') && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <FileUpload onFileUpload={handleFileUpload} />
                  </Box>
                  <FileList 
                    files={filteredFiles} 
                    onFileOpen={handleFileOpen}
                    category={getFileCategory()}
                  />
                </>
              )}
              
              {selectedMenuItem === 'agents' && (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Agents
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Agent management functionality would be implemented here.
                  </Typography>
                </Box>
              )}
              
              {selectedMenuItem === 'settings' && (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Settings
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Application settings would be configured here.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
