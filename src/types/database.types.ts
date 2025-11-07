export type UserRole = 'child' | 'parent' | 'family';
export type MoodType = 'happy' | 'sad' | 'angry' | 'worried' | 'calm' | 'excited' | 'scared';
export type ToolType = 'breathing' | 'movement' | 'affirmation';

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  name: string;
  age: number | null;
  avatar_url: string | null;
  parent_id: string | null;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  mood: MoodType | null;
  tool_used: ToolType | null;
  duration_seconds: number | null;
  completed: boolean;
  created_at: string;
}

export interface Reward {
  id: string;
  user_id: string;
  stars: number;
  coins: number;
  last_updated: string;
}

export interface AILog {
  id: string;
  session_id: string | null;
  user_id: string;
  input: string;
  output: string;
  tool_triggered: ToolType | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
          id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Session, 'id' | 'created_at'>>;
      };
      rewards: {
        Row: Reward;
        Insert: Omit<Reward, 'id' | 'last_updated'> & {
          id?: string;
          last_updated?: string;
        };
        Update: Partial<Omit<Reward, 'id'>>;
      };
      ai_logs: {
        Row: AILog;
        Insert: Omit<AILog, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<AILog, 'id' | 'created_at'>>;
      };
    };
  };
}
