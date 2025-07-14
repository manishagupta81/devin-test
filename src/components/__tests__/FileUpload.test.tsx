import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material';
import FileUpload from '../FileUpload';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('FileUpload', () => {
  const mockOnFileUpload = jest.fn();

  beforeEach(() => {
    mockOnFileUpload.mockClear();
  });

  test('renders upload component', () => {
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    expect(screen.getByText('Upload New File')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop a file here, or click to select')).toBeInTheDocument();
  });

  test('handles file selection', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  test('handles category selection', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);

    const categorySelect = screen.getByRole('combobox');
    await user.click(categorySelect);
    
    const externalOption = screen.getByText('External');
    await user.click(externalOption);

    expect(screen.getByDisplayValue('external')).toBeInTheDocument();
  });

  test('handles tag addition', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);

    const tagInput = screen.getByPlaceholderText('Add a tag');
    await user.type(tagInput, 'important');
    
    const addButton = screen.getByTestId('AddIcon').closest('button') as HTMLButtonElement;
    await user.click(addButton);

    expect(screen.getByText('important')).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);

    const uploadButton = screen.getByRole('button', { name: /upload file/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test.pdf',
          type: 'application/pdf',
          category: 'internal',
        })
      );
    });
  });

  test('shows error when trying to upload without file', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const uploadButton = screen.queryByRole('button', { name: /upload file/i });
    expect(uploadButton).not.toBeInTheDocument();
  });

  test('shows dialog open state when upload area is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const uploadArea = screen.getByText('Drag and drop a file here, or click to select').closest('div');
    await user.click(uploadArea!);

    expect(screen.getByText('File dialog is open - please select a file')).toBeInTheDocument();
    expect(screen.getByText('If you don\'t see the file dialog, check if it opened behind this window')).toBeInTheDocument();
  });

  test('resets dialog state after file selection', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);

    expect(screen.queryByText('File dialog is open - please select a file')).not.toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });
});
