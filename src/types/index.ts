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
