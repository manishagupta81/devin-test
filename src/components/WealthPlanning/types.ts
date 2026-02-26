export interface AgentConfig {
  agent_id: string;
  department: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
