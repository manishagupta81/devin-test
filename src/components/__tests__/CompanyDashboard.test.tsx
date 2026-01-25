import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the services with inline functions
jest.mock('../../services/yahooFinance', () => ({
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
      fiftyTwoWeekHigh: 199.62,
      fiftyTwoWeekLow: 124.17,
      regularMarketDayHigh: 180.12,
      regularMarketDayLow: 176.89,
      regularMarketOpen: 177.25,
      regularMarketPreviousClose: 176.27,
    }),
    getHistoricalData: jest.fn().mockResolvedValue({
      data: [
        { date: '2024-01-01', open: 170, high: 172, low: 169, close: 171, volume: 50000000 },
        { date: '2024-01-02', open: 171, high: 175, low: 170, close: 174, volume: 55000000 },
      ],
    }),
    getAvailableSymbols: jest.fn().mockReturnValue(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD']),
  },
}));

jest.mock('../../services/openaiService', () => ({
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

import CompanyDashboard from '../CompanyDashboard';
import yahooFinanceService from '../../services/yahooFinance';

describe('CompanyDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<CompanyDashboard />);
    });
  });

  it('calls getAvailableSymbols on mount', async () => {
    await act(async () => {
      render(<CompanyDashboard />);
    });
    
    expect(yahooFinanceService.getAvailableSymbols).toHaveBeenCalled();
  });

  it('calls getQuote with AAPL on mount', async () => {
    await act(async () => {
      render(<CompanyDashboard />);
    });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    
    expect(yahooFinanceService.getQuote).toHaveBeenCalledWith('AAPL');
  });

  it('calls getHistoricalData on mount', async () => {
    await act(async () => {
      render(<CompanyDashboard />);
    });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    
    expect(yahooFinanceService.getHistoricalData).toHaveBeenCalled();
  });

  it('fetches data for the selected ticker', async () => {
    await act(async () => {
      render(<CompanyDashboard />);
    });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Should fetch quote for AAPL at minimum
    expect((yahooFinanceService.getQuote as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
    expect((yahooFinanceService.getQuote as jest.Mock)).toHaveBeenCalledWith('AAPL');
  });
});
