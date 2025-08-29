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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Close,
  Save,
  Cancel,
  AutoAwesome,
  Image as ImageIcon,
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
  MenuButtonEditLink,
  MenuButtonUndo,
  MenuButtonRedo,
  MenuControlsContainer,
  MenuSelectHeading,
} from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { FileItem } from '../types';

interface IRNEditorProps {
  open: boolean;
  onClose: () => void;
  onIRNSave: (irn: FileItem) => void;
  availableTickers?: string[];
  existingTags?: string[];
}

const IRNEditor: React.FC<IRNEditorProps> = ({ 
  open, 
  onClose, 
  onIRNSave, 
  availableTickers = [], 
  existingTags = [] 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [primaryTicker, setPrimaryTicker] = useState<string>('');
  const [secondaryTicker, setSecondaryTicker] = useState<string>('');
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

  const handleGenerateAttributes = () => {
    if (!content.trim()) {
      setError('Please enter some content first to generate attributes');
      return;
    }

    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const words = textContent.toLowerCase().split(/\s+/);
    
    const titleWords = textContent.split(/[.!?]/)[0].split(' ').slice(0, 6);
    const generatedTitle = titleWords.join(' ').replace(/^\w/, c => c.toUpperCase());
    setTitle(generatedTitle || 'Generated IRN');

    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'a', 'an']);
    const keywords = words
      .filter(word => word.length > 3 && !commonWords.has(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topKeywords = Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);

    const generatedTags = Array.from(new Set([...topKeywords, 'irn']));
    setTags(generatedTags);

    if (availableTickers.length > 0) {
      const upperContent = textContent.toUpperCase();
      const mentionedTickers = availableTickers.filter(ticker => 
        upperContent.includes(ticker.toUpperCase())
      );
      
      if (mentionedTickers.length > 0) {
        setPrimaryTicker(mentionedTickers[0]);
        if (mentionedTickers.length > 1) {
          setSecondaryTicker(mentionedTickers[1]);
        }
      } else {
        setPrimaryTicker(availableTickers[0]);
      }
    }
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
        ticker: primaryTicker || undefined,
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
    setPrimaryTicker('');
    setSecondaryTicker('');
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
          {/* Title Field */}
          <TextField
            label="Name of the File"
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
                Image.configure({
                  inline: true,
                  allowBase64: true,
                }),
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
                  <MenuDivider />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file && rteRef.current?.editor) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            const src = reader.result as string;
                            rteRef.current?.editor?.chain().focus().setImage({ src }).run();
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    title="Insert Image"
                  >
                    <ImageIcon />
                  </IconButton>
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

          {/* Primary Ticker */}
          {availableTickers.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Primary Ticker</InputLabel>
              <Select
                value={primaryTicker}
                onChange={(e) => setPrimaryTicker(e.target.value)}
                label="Primary Ticker"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {availableTickers.map((ticker) => (
                  <MenuItem key={ticker} value={ticker}>
                    {ticker}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Secondary Ticker */}
          {availableTickers.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Secondary Ticker</InputLabel>
              <Select
                value={secondaryTicker}
                onChange={(e) => setSecondaryTicker(e.target.value)}
                label="Secondary Ticker"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {availableTickers.map((ticker) => (
                  <MenuItem key={ticker} value={ticker}>
                    {ticker}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Tags Section */}
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
            
            {/* Manual Tag Entry */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add a custom tag"
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

          {/* Generate Attributes Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleGenerateAttributes}
              disabled={!content.trim()}
              startIcon={<AutoAwesome />}
              size="large"
            >
              Generate Attributes with AI
            </Button>
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
