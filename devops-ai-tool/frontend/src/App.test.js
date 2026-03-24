import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock child components to avoid dependency issues
jest.mock('./components/LogAnalyzer', () => {
  return function MockLogAnalyzer() {
    return <div data-testid="log-analyzer">Log Analyzer Component</div>;
  };
});

jest.mock('./components/MetricsDashboard', () => {
  return function MockMetricsDashboard() {
    return <div data-testid="metrics-dashboard">Metrics Dashboard Component</div>;
  };
});

jest.mock('./components/AlertsPanel', () => {
  return function MockAlertsPanel() {
    return <div data-testid="alerts-panel">Alerts Panel Component</div>;
  };
});

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

  it('renders all navigation tabs', () => {
    render(<App />);
    expect(screen.getByText('Log Analyzer')).toBeInTheDocument();
    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('renders Log Analyzer tab by default', () => {
    render(<App />);
    expect(screen.getByTestId('log-analyzer')).toBeInTheDocument();
  });

  it('switches to Metrics tab when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const metricsButton = screen.getByRole('button', { name: /Metrics/i });
    await user.click(metricsButton);

    expect(screen.getByTestId('metrics-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('log-analyzer')).not.toBeInTheDocument();
  });

  it('switches to Alerts tab when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const alertsButton = screen.getByRole('button', { name: /Alerts/i });
    await user.click(alertsButton);

    expect(screen.getByTestId('alerts-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('log-analyzer')).not.toBeInTheDocument();
  });
});
