import React from 'react';
import { Box, Typography } from '@mui/material';
import { FileItem } from '../types';

interface FileUploadProps {
  onFileUpload: (file: FileItem) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  return (
    <Box sx={{ p: 2, border: '2px dashed #ccc', borderRadius: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        File upload functionality - placeholder for now
      </Typography>
    </Box>
  );
};

export default FileUpload;
