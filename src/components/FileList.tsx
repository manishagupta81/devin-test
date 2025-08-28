import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
  Avatar,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  OpenInNew,
  PictureAsPdf,
  Description,
  TableChart,
  Image,
  VideoFile,
  AudioFile,
  InsertDriveFile,
  NoteAlt,
} from '@mui/icons-material';
import { FileItem, FileCategory } from '../types';

interface FileListProps {
  files: FileItem[];
  onFileOpen: (file: FileItem) => void;
  category: FileCategory;
}

const getFileIcon = (type: string, category?: string) => {
  if (category === 'irn') return <NoteAlt color="primary" />;
  if (type.includes('pdf')) return <PictureAsPdf color="error" />;
  if (type.includes('word') || type.includes('document')) return <Description color="primary" />;
  if (type.includes('sheet') || type.includes('excel')) return <TableChart color="success" />;
  if (type.includes('image')) return <Image color="secondary" />;
  if (type.includes('video')) return <VideoFile color="info" />;
  if (type.includes('audio')) return <AudioFile color="warning" />;
  return <InsertDriveFile />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'internal': return 'primary';
    case 'external': return 'secondary';
    case 'ai-generated': return 'success';
    case 'irn': return 'info';
    default: return 'default';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'internal': return 'Internal';
    case 'external': return 'External';
    case 'ai-generated': return 'AI Generated';
    case 'irn': return 'IRN';
    default: return category;
  }
};

const FileList: React.FC<FileListProps> = ({ files, onFileOpen, category }) => {
  if (files.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 200,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <InsertDriveFile sx={{ fontSize: 64, color: 'text.secondary' }} />
        <Typography variant="h6" color="text.secondary">
          No files found in {category === 'all' ? 'any category' : getCategoryLabel(category)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload some files to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {category === 'all' ? 'All Files' : getCategoryLabel(category)} ({files.length})
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell>File</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Ticker</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow 
                key={file.id} 
                hover
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                  } 
                }}
                onClick={() => {
                  if (file.category === 'irn' && file.content) {
                    const blob = new Blob([file.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                  } else {
                    onFileOpen(file);
                  }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getFileIcon(file.type, file.category)}
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {file.category === 'irn' ? 'IRN' : file.type.split('/').pop()?.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {file.author.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">
                      {file.author}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={getCategoryLabel(file.category)}
                    color={getCategoryColor(file.category) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                
                <TableCell>
                  {file.ticker ? (
                    <Chip 
                      label={file.ticker}
                      color="info"
                      size="small"
                      variant="filled"
                      sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  {file.team ? (
                    <Chip 
                      label={file.team}
                      color="secondary"
                      size="small"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {file.tags.slice(0, 2).map((tag) => (
                      <Chip 
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    ))}
                    {file.tags.length > 2 && (
                      <Tooltip title={file.tags.slice(2).join(', ')}>
                        <Chip 
                          label={`+${file.tags.length - 2}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatFileSize(file.size)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(file.uploadDate)}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Tooltip title="Open file">
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (file.category === 'irn' && file.content) {
                          const blob = new Blob([file.content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        } else {
                          onFileOpen(file);
                        }
                      }}
                      color="primary"
                    >
                      <OpenInNew fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FileList;
