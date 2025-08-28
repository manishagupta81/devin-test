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
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import {
  Add,
  Close,
  Save,
  Cancel,
  AutoAwesome,
  Tune,
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

type IRNMode = 'generate' | 'select';

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
  const [mode, setMode] = useState<IRNMode>('select');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>('');
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

  const handleGenerateContent = () => {
    if (!content.trim()) {
      setError('Please enter some content first to generate tags and title');
      return;
    }

    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const words = textContent.toLowerCase().split(/\s+/);
    
    if (!title.trim()) {
      const titleWords = textContent.split(/[.!?]/)[0].split(' ').slice(0, 6);
      const generatedTitle = titleWords.join(' ').replace(/^\w/, c => c.toUpperCase());
      setTitle(generatedTitle || 'Generated IRN');
    }

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

    const generatedTags = Array.from(new Set([...tags, ...topKeywords, 'irn']));
    setTags(generatedTags);
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
        ticker: selectedTicker || undefined,
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
    setMode('select');
    setTitle('');
    setContent('');
    setTags([]);
    setSelectedTicker('');
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
          {/* Mode Selection */}
          <Box>
            <Typography variant="body2" gutterBottom>
              Content Mode
            </Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, newMode) => newMode && setMode(newMode)}
              size="small"
              fullWidth
            >
              <ToggleButton value="select" aria-label="select mode">
                <Tune sx={{ mr: 1 }} />
                Select Tags & Ticker
              </ToggleButton>
              <ToggleButton value="generate" aria-label="generate mode">
                <AutoAwesome sx={{ mr: 1 }} />
                Generate Tags & Name
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Title Field */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              placeholder="Enter a descriptive title for your IRN"
            />
            {mode === 'generate' && (
              <Button
                variant="outlined"
                onClick={handleGenerateContent}
                disabled={!content.trim()}
                size="small"
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <AutoAwesome />
              </Button>
            )}
          </Box>

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

          {/* Ticker Selection */}
          {mode === 'select' && availableTickers.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Ticker (Optional)</InputLabel>
              <Select
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value)}
                label="Ticker (Optional)"
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
            
            {mode === 'select' ? (
              <>
                {/* Tag Selection from Existing Tags */}
                {existingTags.length > 0 && (
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel>Select from existing tags</InputLabel>
                    <Select
                      multiple
                      value={tags.filter(tag => existingTags.includes(tag))}
                      onChange={(e) => {
                        const selectedExistingTags = e.target.value as string[];
                        const customTags = tags.filter(tag => !existingTags.includes(tag));
                        setTags([...selectedExistingTags, ...customTags]);
                      }}
                      input={<OutlinedInput label="Select from existing tags" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {existingTags.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                          <Checkbox checked={tags.includes(tag)} />
                          <ListItemText primary={tag} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                
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
              </>
            ) : (
              /* Generate Mode - Show generated tags with option to add more */
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add additional tags"
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
            )}
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
