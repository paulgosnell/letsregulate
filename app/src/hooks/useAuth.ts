import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getProfile } from '../lib/supabase';
import { Profile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        setLoading(false);
        return;
      }

      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string, retries = 3) {
    try {
      const profileData = await getProfile(userId);
      setProfile(profileData);
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading profile:', error);

      // Retry if profile not found (might be creating via trigger)
      if (retries > 0 && (error.code === 'PGRST116' || error.message?.includes('No rows'))) {
        console.log(`Retrying profile load... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadProfile(userId, retries - 1);
      }

      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return { user, profile, loading, signOut };
}
