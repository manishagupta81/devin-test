// Yahoo Finance API Service
// Uses Yahoo Finance public endpoints for stock data

export interface StockQuote {
  symbol: string;
  shortName: string;
  longName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  trailingPE: number;
  forwardPE: number;
  dividendYield: number;
  beta: number;
  sector?: string;
  industry?: string;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  symbol: string;
  data: HistoricalDataPoint[];
}

// Synthetic stock data for demo purposes (Yahoo Finance requires API key for production)
const syntheticStockData: Record<string, StockQuote> = {
  AAPL: {
    symbol: 'AAPL',
    shortName: 'Apple Inc.',
    longName: 'Apple Inc.',
    regularMarketPrice: 178.72,
    regularMarketChange: 2.34,
    regularMarketChangePercent: 1.33,
    regularMarketVolume: 52300000,
    marketCap: 2890000000000,
    fiftyTwoWeekHigh: 199.62,
    fiftyTwoWeekLow: 143.90,
    trailingPE: 28.4,
    forwardPE: 26.2,
    dividendYield: 0.54,
    beta: 1.28,
    sector: 'Technology',
    industry: 'Consumer Electronics',
  },
  MSFT: {
    symbol: 'MSFT',
    shortName: 'Microsoft',
    longName: 'Microsoft Corporation',
    regularMarketPrice: 378.91,
    regularMarketChange: 4.52,
    regularMarketChangePercent: 1.21,
    regularMarketVolume: 21500000,
    marketCap: 2810000000000,
    fiftyTwoWeekHigh: 420.82,
    fiftyTwoWeekLow: 309.45,
    trailingPE: 35.2,
    forwardPE: 31.8,
    dividendYield: 0.72,
    beta: 0.89,
    sector: 'Technology',
    industry: 'Software - Infrastructure',
  },
  GOOGL: {
    symbol: 'GOOGL',
    shortName: 'Alphabet',
    longName: 'Alphabet Inc.',
    regularMarketPrice: 141.80,
    regularMarketChange: -0.71,
    regularMarketChangePercent: -0.50,
    regularMarketVolume: 18200000,
    marketCap: 1780000000000,
    fiftyTwoWeekHigh: 155.20,
    fiftyTwoWeekLow: 115.83,
    trailingPE: 24.1,
    forwardPE: 21.5,
    dividendYield: 0,
    beta: 1.05,
    sector: 'Technology',
    industry: 'Internet Content & Information',
  },
  AMZN: {
    symbol: 'AMZN',
    shortName: 'Amazon',
    longName: 'Amazon.com, Inc.',
    regularMarketPrice: 155.20,
    regularMarketChange: 1.24,
    regularMarketChangePercent: 0.81,
    regularMarketVolume: 35600000,
    marketCap: 1610000000000,
    fiftyTwoWeekHigh: 189.77,
    fiftyTwoWeekLow: 118.35,
    trailingPE: 62.5,
    forwardPE: 42.3,
    dividendYield: 0,
    beta: 1.16,
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
  },
  META: {
    symbol: 'META',
    shortName: 'Meta',
    longName: 'Meta Platforms, Inc.',
    regularMarketPrice: 384.27,
    regularMarketChange: 7.89,
    regularMarketChangePercent: 2.10,
    regularMarketVolume: 14800000,
    marketCap: 987000000000,
    fiftyTwoWeekHigh: 542.81,
    fiftyTwoWeekLow: 274.38,
    trailingPE: 28.9,
    forwardPE: 23.4,
    dividendYield: 0.42,
    beta: 1.24,
    sector: 'Technology',
    industry: 'Internet Content & Information',
  },
  NVDA: {
    symbol: 'NVDA',
    shortName: 'NVIDIA',
    longName: 'NVIDIA Corporation',
    regularMarketPrice: 615.27,
    regularMarketChange: 20.85,
    regularMarketChangePercent: 3.51,
    regularMarketVolume: 42100000,
    marketCap: 1520000000000,
    fiftyTwoWeekHigh: 974.00,
    fiftyTwoWeekLow: 394.36,
    trailingPE: 65.2,
    forwardPE: 38.7,
    dividendYield: 0.02,
    beta: 1.72,
    sector: 'Technology',
    industry: 'Semiconductors',
  },
  AMD: {
    symbol: 'AMD',
    shortName: 'AMD',
    longName: 'Advanced Micro Devices, Inc.',
    regularMarketPrice: 142.35,
    regularMarketChange: 3.21,
    regularMarketChangePercent: 2.31,
    regularMarketVolume: 28900000,
    marketCap: 230000000000,
    fiftyTwoWeekHigh: 227.30,
    fiftyTwoWeekLow: 93.12,
    trailingPE: 45.8,
    forwardPE: 28.4,
    dividendYield: 0,
    beta: 1.68,
    sector: 'Technology',
    industry: 'Semiconductors',
  },
};

// Generate synthetic historical data for charts
function generateHistoricalData(symbol: string, days: number = 90): HistoricalDataPoint[] {
  const quote = syntheticStockData[symbol];
  if (!quote) return [];

  const data: HistoricalDataPoint[] = [];
  const basePrice = quote.regularMarketPrice;
  const volatility = quote.beta * 0.02; // Daily volatility based on beta
  
  let currentPrice = basePrice * 0.85; // Start 15% lower than current
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Random walk with upward drift
    const drift = (basePrice - currentPrice) / (i + 1) * 0.1;
    const randomChange = (Math.random() - 0.45) * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + drift + randomChange, currentPrice * 0.95);
    
    const dayVolatility = volatility * currentPrice;
    const open = currentPrice + (Math.random() - 0.5) * dayVolatility;
    const close = currentPrice;
    const high = Math.max(open, close) + Math.random() * dayVolatility * 0.5;
    const low = Math.min(open, close) - Math.random() * dayVolatility * 0.5;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(quote.regularMarketVolume * (0.8 + Math.random() * 0.4)),
    });
  }

  return data;
}

// Generate intraday data for 1-day chart
function generateIntradayData(symbol: string): HistoricalDataPoint[] {
  const quote = syntheticStockData[symbol];
  if (!quote) return [];

  const data: HistoricalDataPoint[] = [];
  const basePrice = quote.regularMarketPrice - quote.regularMarketChange;
  const volatility = quote.beta * 0.003; // Intraday volatility
  
  let currentPrice = basePrice;
  const today = new Date();
  today.setHours(9, 30, 0, 0); // Market open

  for (let i = 0; i < 78; i++) { // 6.5 hours of trading in 5-min intervals
    const time = new Date(today);
    time.setMinutes(time.getMinutes() + i * 5);
    
    // Trend towards current price
    const progress = i / 78;
    const targetPrice = basePrice + quote.regularMarketChange * progress;
    const drift = (targetPrice - currentPrice) * 0.1;
    const randomChange = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice = currentPrice + drift + randomChange;
    
    const dayVolatility = volatility * currentPrice;
    const open = currentPrice + (Math.random() - 0.5) * dayVolatility;
    const close = currentPrice;
    const high = Math.max(open, close) + Math.random() * dayVolatility * 0.3;
    const low = Math.min(open, close) - Math.random() * dayVolatility * 0.3;
    
    data.push({
      date: time.toISOString(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(quote.regularMarketVolume / 78 * (0.5 + Math.random())),
    });
  }

  return data;
}

export const yahooFinanceService = {
  // Get stock quote
  getQuote: async (symbol: string): Promise<StockQuote | null> => {
    // Return synthetic data for demo
    const upperSymbol = symbol.toUpperCase();
    return syntheticStockData[upperSymbol] || null;
  },

  // Get multiple quotes
  getQuotes: async (symbols: string[]): Promise<StockQuote[]> => {
    return symbols
      .map(s => syntheticStockData[s.toUpperCase()])
      .filter((q): q is StockQuote => q !== null);
  },

  // Get historical data for charts
  getHistoricalData: async (
    symbol: string, 
    range: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' = '3M'
  ): Promise<ChartData> => {
    let days: number;
    switch (range) {
      case '1D': 
        return { symbol, data: generateIntradayData(symbol) };
      case '5D': days = 5; break;
      case '1M': days = 30; break;
      case '3M': days = 90; break;
      case '6M': days = 180; break;
      case '1Y': days = 365; break;
      case '5Y': days = 1825; break;
      default: days = 90;
    }
    
    return {
      symbol,
      data: generateHistoricalData(symbol, days),
    };
  },

  // Get available symbols
  getAvailableSymbols: (): string[] => {
    return Object.keys(syntheticStockData);
  },

  // Search for symbols
  searchSymbols: async (query: string): Promise<StockQuote[]> => {
    const upperQuery = query.toUpperCase();
    return Object.values(syntheticStockData).filter(
      stock => 
        stock.symbol.includes(upperQuery) || 
        stock.shortName.toUpperCase().includes(upperQuery) ||
        stock.longName.toUpperCase().includes(upperQuery)
    );
  },
};

export default yahooFinanceService;
