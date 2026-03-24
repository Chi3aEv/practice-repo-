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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders the header', async () => {
    render(<App />);
    expect(await screen.findByText('🤖 DevOps AI Tool')).toBeInTheDocument();
  });

  it('renders all tab buttons', async () => {
    render(<App />);
    expect(await screen.findByText('Log Analyzer')).toBeInTheDocument();
    expect(await screen.findByText('Metrics')).toBeInTheDocument();
    expect(await screen.findByText('Alerts')).toBeInTheDocument();
  });

  it('shows Log Analyzer tab by default', async () => {
    render(<App />);
    expect(await screen.findByPlaceholderText('Paste your logs here...')).toBeInTheDocument();
  });

  it('switches to Metrics tab on click', async () => {
    render(<App />);
    await userEvent.click(await screen.findByText('Metrics'));
    await waitFor(() => expect(screen.getByText('Ingest Metric')).toBeInTheDocument());
  });

  it('switches to Alerts tab on click', async () => {
    render(<App />);
    await userEvent.click(await screen.findByText('Alerts'));
    await waitFor(() => expect(screen.getByText('Submit Alert for AI Analysis')).toBeInTheDocument());
  });
});
