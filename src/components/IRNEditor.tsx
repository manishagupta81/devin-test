import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Close,
  Save,
  Cancel,
} from '@mui/icons-material';
import { 
  RichTextEditor, 
  type RichTextEditorRef,
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonUnderline,
  MenuButtonStrikethrough,
  MenuDivider,
  MenuButtonOrderedList,
  MenuButtonBulletedList,
  MenuButtonBlockquote,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonUndo,
  MenuButtonRedo,
  MenuControlsContainer,
  MenuSelectHeading,
} from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { FileItem } from '../types';

interface IRNEditorProps {
  open: boolean;
  onClose: () => void;
  onIRNSave: (irn: FileItem) => void;
}

const IRNEditor: React.FC<IRNEditorProps> = ({ open, onClose, onIRNSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rteRef = useRef<RichTextEditorRef>(null);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title for your IRN');
      return;
    }

    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (!textContent) {
      setError('Please enter some content for your IRN');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newIRN: FileItem = {
        id: Date.now().toString(),
        name: title.trim(),
        author: 'Current User',
        tags: tags.length > 0 ? tags : ['irn'],
        category: 'irn',
        uploadDate: new Date(),
        size: new Blob([content]).size,
        type: 'text/html',
        content: content.trim(),
      };

      onIRNSave(newIRN);
      handleClose();
    } catch (err) {
      setError('Failed to save IRN. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setTags([]);
    setNewTag('');
    setError(null);
    setSaving(false);
    if (rteRef.current) {
      rteRef.current.editor?.commands.clearContent();
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Create New IRN (Internal Research Note)
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            placeholder="Enter a descriptive title for your IRN"
          />

          <Box>
            <Typography variant="body2" gutterBottom>
              Content *
            </Typography>
            <RichTextEditor
              ref={rteRef}
              extensions={[
                StarterKit,
                Placeholder.configure({
                  placeholder: 'Enter your research notes, analysis, or any other content here...',
                }),
              ]}
              content={content}
              onUpdate={({ editor }) => {
                setContent(editor.getHTML());
              }}
              renderControls={() => (
                <MenuControlsContainer>
                  <MenuButtonBold />
                  <MenuButtonItalic />
                  <MenuButtonUnderline />
                  <MenuButtonStrikethrough />
                  <MenuDivider />
                  <MenuSelectHeading />
                  <MenuDivider />
                  <MenuButtonBulletedList />
                  <MenuButtonOrderedList />
                  <MenuDivider />
                  <MenuButtonBlockquote />
                  <MenuButtonCode />
                  <MenuButtonCodeBlock />
                  <MenuDivider />
                  <MenuButtonEditLink />
                  <MenuDivider />
                  <MenuButtonUndo />
                  <MenuButtonRedo />
                </MenuControlsContainer>
              )}
              RichTextFieldProps={{
                variant: 'outlined',
              }}
              sx={{
                minHeight: 300,
                '& .ProseMirror': {
                  minHeight: 250,
                  padding: 2,
                },
              }}
            />
          </Box>

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
                sx={{ flexGrow: 1 }}
              />
              <IconButton onClick={handleAddTag} disabled={!newTag.trim()}>
                <Add />
              </IconButton>
            </Box>
          </Box>

          {saving && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Saving IRN...
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={saving}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !title.trim() || !content.trim()}
          startIcon={<Save />}
        >
          {saving ? 'Saving...' : 'Save IRN'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IRNEditor;
