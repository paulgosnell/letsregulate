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
