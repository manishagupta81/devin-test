export interface FileItem {
  id: string;
  name: string;
  author: string;
  tags: string[];
  category: 'internal' | 'external' | 'ai-generated';
  uploadDate: Date;
  size: number;
  type: string;
  ticker?: string;
  url?: string;
  file?: File;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export type FileCategory = 'internal' | 'external' | 'ai-generated' | 'all';

export interface TickerSubscription {
  ticker: string;
  subscribed: boolean;
  lastUpdate?: Date;
}
