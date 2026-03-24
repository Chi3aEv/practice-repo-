import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ToastContainer } from 'react-toastify';

// Mock react-toastify to avoid rendering issues in tests
jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
}));

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('DevOps AI Tool');
  });

  it('renders navigation tabs', () => {
    render(<App />);
    expect(screen.getByText('Log Analyzer')).toBeInTheDocument();
    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('renders default tab content (Log Analyzer)', () => {
    render(<App />);
    // The LogAnalyzer component should be rendered by default
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});