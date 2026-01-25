import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the services
jest.mock('../services/yahooFinance', () => ({
  __esModule: true,
  default: {
    getQuote: jest.fn().mockResolvedValue({
      symbol: 'AAPL',
      shortName: 'Apple Inc.',
      regularMarketPrice: 178.72,
      regularMarketChange: 2.45,
      regularMarketChangePercent: 1.39,
      regularMarketVolume: 45678900,
      marketCap: 2800000000000,
    }),
    getHistoricalData: jest.fn().mockResolvedValue({
      data: [
        { date: '2024-01-01', open: 170, high: 172, low: 169, close: 171, volume: 50000000 },
      ],
    }),
    getAvailableSymbols: jest.fn().mockReturnValue(['AAPL', 'MSFT', 'GOOGL']),
  },
}));

jest.mock('../services/openaiService', () => ({
  generateCompanyIntelligence: jest.fn().mockResolvedValue({
    salesPerEmployee: [{ year: '2019', value: 1.85 }],
    cashFlowMargins: [{ year: '2019', operatingCF: 24.5, freeCF: 21.2 }],
    historicalGrowthRate: [{ year: '2019', revenue: 5.2, earnings: 8.5, eps: 9.1 }],
    profitabilityMargins: [{ year: '2019', ebitda: 28.5, ebit: 24.2, netMargin: 21.5 }],
    epsHistory: [{ year: '2019', eps: 2.97, growth: 8.5 }],
  }),
  generateMarketCommentary: jest.fn().mockResolvedValue('Test market commentary'),
  generateInvestmentSummary: jest.fn().mockResolvedValue({
    executiveSummary: 'Test executive summary',
    keyInsights: ['Insight 1'],
    riskFactors: ['Risk 1'],
    opportunities: ['Opportunity 1'],
  }),
}));

// Mock recharts
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

import App from '../App';

describe('App', () => {
  test('renders main application with PRISM branding', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('PRISM')).toBeInTheDocument();
  });

  test('renders Equities as the default department', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Equities')).toBeInTheDocument();
  });

  test('renders Company Dashboard menu item', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Company Dashboard')).toBeInTheDocument();
  });

  test('renders logged in user info', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText('Logged in as: test')).toBeInTheDocument();
  });
});
