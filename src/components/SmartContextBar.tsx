import React, { useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Collapse,
  Autocomplete,
  TextField,
  Typography,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Add,
  Close,
} from '@mui/icons-material';
import { SECTORS, Sector } from '../types';

interface SmartContextBarProps {
  selectedTickers: string[];
  selectedSectors: string[];
  onTickersChange: (tickers: string[]) => void;
  onSectorsChange: (sectors: string[]) => void;
  availableTickers: string[];
}

const SmartContextBar: React.FC<SmartContextBarProps> = ({
  selectedTickers,
  selectedSectors,
  onTickersChange,
  onSectorsChange,
  availableTickers,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTickerInput, setShowTickerInput] = useState(false);
  const [showSectorInput, setShowSectorInput] = useState(false);

  const allTickers = Array.from(new Set([
    ...availableTickers,
    ...SECTORS.flatMap(s => s.tickers),
  ])).sort();

  const handleRemoveTicker = (ticker: string) => {
    onTickersChange(selectedTickers.filter(t => t !== ticker));
  };

  const handleRemoveSector = (sector: string) => {
    onSectorsChange(selectedSectors.filter(s => s !== sector));
  };

  const handleAddTicker = (ticker: string | null) => {
    if (ticker && !selectedTickers.includes(ticker)) {
      onTickersChange([...selectedTickers, ticker]);
    }
    setShowTickerInput(false);
  };

  const handleAddSector = (sector: Sector | null) => {
    if (sector && !selectedSectors.includes(sector.name)) {
      onSectorsChange([...selectedSectors, sector.name]);
    }
    setShowSectorInput(false);
  };

  const hasSelections = selectedTickers.length > 0 || selectedSectors.length > 0;

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 0,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'grey.50',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: 48,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            mr: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Context:
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexWrap: 'nowrap',
            overflow: 'auto',
            flex: 1,
            '&::-webkit-scrollbar': {
              height: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.300',
              borderRadius: 2,
            },
          }}
        >
          {selectedTickers.map((ticker) => (
            <Chip
              key={ticker}
              label={ticker}
              size="small"
              onDelete={() => handleRemoveTicker(ticker)}
              deleteIcon={<Close sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-deleteIcon': {
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    color: 'white',
                  },
                },
              }}
            />
          ))}

          {selectedSectors.map((sector) => (
            <Chip
              key={sector}
              label={sector}
              size="small"
              onDelete={() => handleRemoveSector(sector)}
              deleteIcon={<Close sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: 'secondary.main',
                color: 'primary.dark',
                fontWeight: 600,
                '& .MuiChip-deleteIcon': {
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                },
              }}
            />
          ))}

          {!hasSelections && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No tickers or sectors selected
            </Typography>
          )}

          {showTickerInput ? (
            <Autocomplete
              size="small"
              options={allTickers.filter(t => !selectedTickers.includes(t))}
              onChange={(_, value) => handleAddTicker(value)}
              onBlur={() => setShowTickerInput(false)}
              autoFocus
              openOnFocus
              sx={{ minWidth: 120 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ticker"
                  variant="outlined"
                  size="small"
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 28,
                      fontSize: '0.8rem',
                    },
                  }}
                />
              )}
            />
          ) : (
            <Tooltip title="Add ticker">
              <IconButton
                size="small"
                onClick={() => setShowTickerInput(true)}
                sx={{
                  bgcolor: 'primary.light',
                  color: 'white',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                }}
              >
                <Add sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Tooltip title={isExpanded ? 'Collapse' : 'Expand selectors'}>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ ml: 1 }}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={isExpanded}>
        <Box
          sx={{
            px: 2,
            pb: 2,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Add Tickers
            </Typography>
            <Autocomplete
              multiple
              size="small"
              options={allTickers}
              value={selectedTickers}
              onChange={(_, value) => onTickersChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search tickers..."
                  variant="outlined"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                ))
              }
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Add Sectors
            </Typography>
            <Autocomplete
              multiple
              size="small"
              options={SECTORS}
              getOptionLabel={(option) => option.name}
              value={SECTORS.filter(s => selectedSectors.includes(s.name))}
              onChange={(_, value) => onSectorsChange(value.map(v => v.name))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search sectors..."
                  variant="outlined"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.name}
                    size="small"
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'primary.dark',
                      fontWeight: 600,
                    }}
                  />
                ))
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.tickers.slice(0, 4).join(', ')}
                      {option.tickers.length > 4 && ` +${option.tickers.length - 4} more`}
                    </Typography>
                  </Box>
                </li>
              )}
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SmartContextBar;
