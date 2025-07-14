import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  Add,
  Close,
} from '@mui/icons-material';
import { FileItem, FileCategory } from '../types';

interface FileUploadProps {
  onFileUpload: (file: FileItem) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<Exclude<FileCategory, 'all'>>('internal');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (dialogOpen) {
        setTimeout(() => {
          setDialogOpen(false);
        }, 100);
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [dialogOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDialogOpen(false);
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newFile: FileItem = {
        id: Date.now().toString(),
        name: selectedFile.name,
        author: 'Current User',
        tags: tags.length > 0 ? tags : ['uploaded'],
        category,
        uploadDate: new Date(),
        size: selectedFile.size,
        type: selectedFile.type,
        file: selectedFile,
      };

      onFileUpload(newFile);

      setSelectedFile(null);
      setTags([]);
      setNewTag('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload New File
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            border: '2px dashed',
            borderColor: dialogOpen ? 'primary.dark' : (selectedFile ? 'primary.main' : 'grey.300'),
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: dialogOpen ? 'primary.100' : (selectedFile ? 'primary.50' : 'grey.50'),
            cursor: dialogOpen ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            '&:hover': {
              borderColor: dialogOpen ? 'primary.dark' : 'primary.main',
              backgroundColor: dialogOpen ? 'primary.100' : 'primary.50',
            },
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            setDialogOpen(true);
            fileInputRef.current?.click();
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif"
          />
          
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          
          {selectedFile ? (
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          ) : dialogOpen ? (
            <Box>
              <Typography variant="body1" gutterBottom color="primary.main" fontWeight="medium">
                File dialog is open - please select a file
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you don't see the file dialog, check if it opened behind this window
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" gutterBottom>
                Drag and drop a file here, or click to select
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports PDF, Word, Excel, images, and text files
              </Typography>
            </Box>
          )}
        </Box>

        {selectedFile && (
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value as Exclude<FileCategory, 'all'>)}
              >
                <MenuItem value="internal">Internal</MenuItem>
                <MenuItem value="external">External</MenuItem>
                <MenuItem value="ai-generated">AI Generated</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="body2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    deleteIcon={<Close />}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <IconButton onClick={handleAddTag} disabled={!newTag.trim()}>
                  <Add />
                </IconButton>
              </Box>
            </Box>

            {uploading && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Uploading file...
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading}
              startIcon={<CloudUpload />}
              fullWidth
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
