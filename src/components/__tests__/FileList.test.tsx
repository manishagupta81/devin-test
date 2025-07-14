import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import FileList from '../FileList';
import { FileItem } from '../../types';

const theme = createTheme();

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Test Document.pdf',
    author: 'Test Author',
    tags: ['test', 'document'],
    category: 'internal',
    uploadDate: new Date('2024-01-15'),
    size: 1024000,
    type: 'application/pdf',
  },
  {
    id: '2',
    name: 'External File.docx',
    author: 'External Author',
    tags: ['external'],
    category: 'external',
    uploadDate: new Date('2024-01-10'),
    size: 512000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('FileList', () => {
  const mockOnFileOpen = jest.fn();

  beforeEach(() => {
    mockOnFileOpen.mockClear();
  });

  test('renders file list with files', () => {
    renderWithTheme(
      <FileList files={mockFiles} onFileOpen={mockOnFileOpen} category="all" />
    );

    expect(screen.getByText('All Files (2)')).toBeInTheDocument();
    expect(screen.getByText('Test Document.pdf')).toBeInTheDocument();
    expect(screen.getByText('External File.docx')).toBeInTheDocument();
  });

  test('renders empty state when no files', () => {
    renderWithTheme(
      <FileList files={[]} onFileOpen={mockOnFileOpen} category="all" />
    );

    expect(screen.getByText('No files found in any category')).toBeInTheDocument();
    expect(screen.getByText('Upload some files to get started!')).toBeInTheDocument();
  });

  test('calls onFileOpen when file row is clicked', () => {
    renderWithTheme(
      <FileList files={mockFiles} onFileOpen={mockOnFileOpen} category="all" />
    );

    const fileRow = screen.getByText('Test Document.pdf').closest('tr');
    fireEvent.click(fileRow!);

    expect(mockOnFileOpen).toHaveBeenCalledWith(mockFiles[0]);
  });

  test('calls onFileOpen when open button is clicked', () => {
    renderWithTheme(
      <FileList files={mockFiles} onFileOpen={mockOnFileOpen} category="all" />
    );

    const openButtons = screen.getAllByLabelText('Open file');
    fireEvent.click(openButtons[0]);

    expect(mockOnFileOpen).toHaveBeenCalledWith(mockFiles[0]);
  });

  test('displays correct category label', () => {
    renderWithTheme(
      <FileList files={mockFiles} onFileOpen={mockOnFileOpen} category="internal" />
    );

    expect(screen.getByText('Internal (2)')).toBeInTheDocument();
  });

  test('displays file information correctly', () => {
    renderWithTheme(
      <FileList files={mockFiles} onFileOpen={mockOnFileOpen} category="all" />
    );

    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('External Author')).toBeInTheDocument();
    expect(screen.getByText('1000 KB')).toBeInTheDocument();
    expect(screen.getByText('500 KB')).toBeInTheDocument();
  });
});
