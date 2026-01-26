export interface FileItem {
  id: string;
  name: string;
  author: string;
  tags: string[];
  category: 'internal' | 'external' | 'ai-generated' | 'irn';
  uploadDate: Date;
  size: number;
  type: string;
  ticker?: string;
  team?: string;
  url?: string;
  file?: File;
  content?: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export type FileCategory = 'internal' | 'external' | 'ai-generated' | 'irn' | 'all';

export interface TickerSubscription {
  ticker: string;
  subscribed: boolean;
  lastUpdate?: Date;
}

export interface TeamSubscription {
  team: string;
  subscribed: boolean;
  lastUpdate?: Date;
}

export type SubscriptionType = 'ticker' | 'team';

export interface SmartQuerySuggestion {
  id: string;
  text: string;
  category: string;
  intent: string;
  icon: string;
  relevanceScore?: number;
}

export interface Sector {
  id: string;
  name: string;
  tickers: string[];
}

export const SECTORS: Sector[] = [
  { id: 'tech', name: 'Technology', tickers: ['AAPL', 'GOOGL', 'MSFT', 'META', 'NVDA', 'AMD'] },
  { id: 'finance', name: 'Financials', tickers: ['JPM', 'BAC', 'GS', 'MS', 'WFC', 'C'] },
  { id: 'healthcare', name: 'Healthcare', tickers: ['JNJ', 'PFE', 'UNH', 'MRK', 'ABBV', 'LLY'] },
  { id: 'energy', name: 'Energy', tickers: ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'PXD'] },
  { id: 'consumer', name: 'Consumer', tickers: ['AMZN', 'WMT', 'HD', 'NKE', 'SBUX', 'MCD'] },
  { id: 'industrial', name: 'Industrials', tickers: ['CAT', 'BA', 'HON', 'UPS', 'GE', 'MMM'] },
];
