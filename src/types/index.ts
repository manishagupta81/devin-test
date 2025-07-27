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
  team?: string;
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

export interface TeamSubscription {
  team: string;
  subscribed: boolean;
  lastUpdate?: Date;
}

export type SubscriptionType = 'ticker' | 'team';

export interface AIUseCase {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'planned' | 'completed';
  priority: 'high' | 'medium' | 'low';
  department: string;
  lastUpdated: Date;
  owner: string;
}

export interface AIPromptTool {
  id: string;
  title: string;
  description: string;
  category: 'prompt' | 'agent' | 'utility';
  department: string;
  tags: string[];
  usage: number;
  rating: number;
  lastUpdated: Date;
  author: string;
}

export interface AIWorkshop {
  id: string;
  title: string;
  description: string;
  type: 'past' | 'upcoming';
  date: Date;
  duration: string;
  department: string;
  instructor: string;
  attendees: number;
  maxAttendees?: number;
}

export interface AITeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  expertise: string[];
  email: string;
}

export interface AIDepartment {
  id: string;
  name: string;
  description: string;
  useCases: AIUseCase[];
  promptsTools: AIPromptTool[];
  workshops: AIWorkshop[];
  teamMembers: AITeamMember[];
}

export interface AIBestPractice {
  id: string;
  title: string;
  description: string;
  category: 'governance' | 'ethics' | 'usage' | 'security';
  importance: 'critical' | 'important' | 'recommended';
  lastUpdated: Date;
}

export interface AIEnablementResource {
  id: string;
  title: string;
  description: string;
  type: 'training' | 'tool' | 'guide' | 'template';
  url?: string;
  department?: string;
  lastUpdated: Date;
}
