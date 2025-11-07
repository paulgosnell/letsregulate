export type {
  UserRole,
  MoodType,
  ToolType,
  Profile,
  Session,
  Reward,
  AILog,
  Database
} from './database.types';

import type { ToolType } from './database.types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ToolSuggestion {
  tool: ToolType | null;
  reason: string;
}
