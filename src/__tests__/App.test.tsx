import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  test('renders main application', () => {
    render(<App />);

    expect(screen.getByText('Devin-test Document Management System')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('File Categories')).toBeInTheDocument();
  });

  test('renders sidebar navigation', () => {
    render(<App />);

    expect(screen.getByText('All Files')).toBeInTheDocument();
    expect(screen.getByText('Internal Files')).toBeInTheDocument();
    expect(screen.getByText('External Files')).toBeInTheDocument();
    expect(screen.getByText('AI Generated Reports')).toBeInTheDocument();
  });

  test('renders file upload component', () => {
    render(<App />);

    expect(screen.getByText('Upload New File')).toBeInTheDocument();
  });

  test('renders initial files', () => {
    render(<App />);

    expect(screen.getByText('Project Requirements.pdf')).toBeInTheDocument();
    expect(screen.getByText('External API Documentation.docx')).toBeInTheDocument();
    expect(screen.getByText('AI Analysis Report.xlsx')).toBeInTheDocument();
  });

  test('filters files by category', () => {
    render(<App />);

    const internalButton = screen.getByText('Internal Files');
    fireEvent.click(internalButton);

    expect(screen.getByText('Internal (1)')).toBeInTheDocument();
    expect(screen.getByText('Project Requirements.pdf')).toBeInTheDocument();
    expect(screen.queryByText('External API Documentation.docx')).not.toBeInTheDocument();
  });

  test('shows correct file counts in sidebar', () => {
    render(<App />);

    expect(screen.getByText('All Files')).toBeInTheDocument();
    expect(screen.getByText('Internal Files')).toBeInTheDocument();
    expect(screen.getByText('External Files')).toBeInTheDocument();
    expect(screen.getByText('AI Generated Reports')).toBeInTheDocument();
    
    const counts = screen.getAllByText('1');
    expect(counts).toHaveLength(3); // Internal, External, AI-generated each have 1 file
    
    const totalCount = screen.getByText('3');
    expect(totalCount).toBeInTheDocument();
  });
});
