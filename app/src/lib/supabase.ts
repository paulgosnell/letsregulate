import { createClient } from '@supabase/supabase-js';
import { MoodType, ToolType } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Helper functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateRewards(userId: string, stars: number, coins: number) {
  const { data, error } = await supabase
    .from('rewards')
    .upsert({
      user_id: userId,
      stars,
      coins,
      last_updated: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createSession(userId: string, mood?: MoodType) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: userId, mood })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function logAIMessage(
  sessionId: string,
  userId: string,
  input: string,
  output: string,
  toolTriggered?: ToolType
) {
  const { error } = await supabase
    .from('ai_logs')
    .insert({
      session_id: sessionId,
      user_id: userId,
      input,
      output,
      tool_triggered: toolTriggered
    });

  if (error) throw error;
}

// New conversation persistence functions
export interface DBChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export async function saveMessage(
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: Record<string, any>
) {
  const { data, error } = await supabase
    .from('ai_logs')
    .insert({
      session_id: sessionId,
      user_id: userId,
      role,
      content,
      metadata: metadata || {},
      // Keep input/output for backwards compatibility
      input: role === 'user' ? content : '',
      output: role === 'assistant' ? content : ''
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function loadConversationHistory(
  sessionId: string,
  limit: number = 20
): Promise<DBChatMessage[]> {
  const { data, error } = await supabase
    .from('ai_logs')
    .select('id, role, content, created_at, metadata')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(msg => ({
    id: msg.id,
    role: msg.role || 'assistant',
    content: msg.content || msg.output || '',
    created_at: msg.created_at,
    metadata: msg.metadata || {}
  }));
}

export async function loadRecentConversations(
  userId: string,
  limit: number = 50
): Promise<DBChatMessage[]> {
  const { data, error } = await supabase
    .from('ai_logs')
    .select('id, role, content, created_at, metadata, session_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(msg => ({
    id: msg.id,
    role: msg.role || 'assistant',
    content: msg.content || msg.output || '',
    created_at: msg.created_at,
    metadata: msg.metadata || {}
  }));
}
