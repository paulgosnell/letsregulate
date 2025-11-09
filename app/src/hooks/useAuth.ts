import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getProfile } from '../lib/supabase';
import { Profile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Initializing auth check');
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        setLoading(false);
        return;
      }

      console.log('useAuth: Session found:', !!session?.user);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('useAuth: Loading profile for user', session.user.id);
        loadProfile(session.user.id);
      } else {
        console.log('useAuth: No session, setting loading to false');
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
    console.log(`useAuth: loadProfile called for ${userId}, retries: ${retries}`);
    try {
      const profileData = await getProfile(userId);
      console.log('useAuth: Profile loaded successfully', profileData);
      setProfile(profileData);
      setLoading(false);
      console.log('useAuth: Loading set to false');
    } catch (error: any) {
      console.error('useAuth: Error loading profile:', error);

      // Retry if profile not found (might be creating via trigger)
      if (retries > 0 && (error.code === 'PGRST116' || error.message?.includes('No rows'))) {
        console.log(`useAuth: Retrying profile load... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadProfile(userId, retries - 1);
      }

      console.log('useAuth: All retries exhausted, setting loading to false');
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
