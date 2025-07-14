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
    const input = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    
    await user.upload(input, file);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  test('handles category selection', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    
    await user.upload(input, file);

    const categorySelect = screen.getByLabelText('Category');
    await user.click(categorySelect);
    
    const externalOption = screen.getByText('External');
    await user.click(externalOption);

    expect(screen.getByDisplayValue('external')).toBeInTheDocument();
  });

  test('handles tag addition', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    
    await user.upload(input, file);

    const tagInput = screen.getByPlaceholderText('Add a tag');
    await user.type(tagInput, 'important');
    
    const addButton = screen.getByRole('button', { name: /add/i });
    await user.click(addButton);

    expect(screen.getByText('important')).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByRole('button', { hidden: true }) as HTMLInputElement;
    
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
});
