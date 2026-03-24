jest.mock('react-toastify/dist/ReactToastify.css', () => ({}));
jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('./index.css', () => ({}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.js';

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    expect(screen.getByText('🤖 DevOps AI Tool')).toBeInTheDocument();
  });

  it('renders all tab buttons', () => {
    render(<App />);
    expect(screen.getByText('Log Analyzer')).toBeInTheDocument();
    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('shows Log Analyzer tab by default', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Paste your logs here...')).toBeInTheDocument();
  });

  it('switches to Metrics tab on click', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Metrics'));
    expect(screen.getByText('Ingest Metric')).toBeInTheDocument();
  });

  it('switches to Alerts tab on click', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Alerts'));
    expect(screen.getByText('Submit Alert for AI Analysis')).toBeInTheDocument();
  });
});
