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
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  SmartToy,
  Dashboard,
  Feedback,
} from '@mui/icons-material';
import { FileItem, User, FileCategory } from './types';
import FileList from './components/FileList';
import FileUpload from './components/FileUpload';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const drawerWidth = 280;

// Mock user data
const currentUser: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://via.placeholder.com/40',
};

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
  },
];

function App() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>(files);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFiles(files);
    } else {
      setFilteredFiles(files.filter(file => file.category === selectedCategory));
    }
  }, [files, selectedCategory]);

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

  const handleFeedbackOpen = () => {
    setFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
    setFeedbackText('');
  };

  const handleFeedbackSubmit = () => {
    setFeedbackOpen(false);
    setFeedbackText('');
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  const menuItems = [
    { id: 'all', label: 'All Files', icon: <Dashboard />, count: files.length },
    { id: 'internal', label: 'Internal Files', icon: <Folder />, count: files.filter(f => f.category === 'internal').length },
    { id: 'external', label: 'External Files', icon: <FolderOpen />, count: files.filter(f => f.category === 'external').length },
    { id: 'ai-generated', label: 'AI Generated Reports', icon: <SmartToy />, count: files.filter(f => f.category === 'ai-generated').length },
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
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Devin-test Document Management System
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Feedback />}
                onClick={handleFeedbackOpen}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Feedback
              </Button>
              <Typography variant="body2">
                {currentUser.name}
              </Typography>
              <Avatar 
                src={currentUser.avatar} 
                alt={currentUser.name}
                sx={{ width: 32, height: 32 }}
              >
                {currentUser.name.charAt(0)}
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
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              File Categories
            </Typography>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={selectedCategory === item.id}
                    onClick={() => setSelectedCategory(item.id as FileCategory)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: selectedCategory === item.id ? 'white' : 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    <Chip 
                      label={item.count} 
                      size="small" 
                      color={selectedCategory === item.id ? 'secondary' : 'default'}
                    />
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
          
          <Box sx={{ mb: 3 }}>
            <FileUpload onFileUpload={handleFileUpload} />
          </Box>

          <FileList 
            files={filteredFiles} 
            onFileOpen={handleFileOpen}
            category={selectedCategory}
          />
        </Box>

        {/* Feedback Dialog */}
        <Dialog 
          open={feedbackOpen} 
          onClose={handleFeedbackClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Your feedback"
              placeholder="Please share your thoughts, suggestions, or report any issues..."
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFeedbackClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleFeedbackSubmit}
              variant="contained"
              disabled={!feedbackText.trim()}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Snackbar */}
        <Snackbar
          open={confirmationOpen}
          autoHideDuration={4000}
          onClose={handleConfirmationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleConfirmationClose} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            Thank you for your feedback!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
