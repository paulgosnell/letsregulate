import { useState, useEffect } from 'react';
import { supabase, updateRewards } from '../lib/supabase';
import { toast } from '../components/ui/Toast';

export function useRewards(userId: string) {
  const [rewards, setRewards] = useState({ stars: 0, coins: 0 });
  const [loading, setLoading] = useState(true);

  async function fetchRewards() {
    try {
      const { data } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setRewards({ stars: data.stars, coins: data.coins });
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addReward(stars: number, coins: number = 0) {
    const newStars = rewards.stars + stars;
    const newCoins = rewards.coins + coins;

    try {
      await updateRewards(userId, newStars, newCoins);
      setRewards({ stars: newStars, coins: newCoins });

      // Show toast
      if (stars > 0) {
        toast.success(`You earned ${stars} stars!`);
      }
      if (coins > 0) {
        toast.success(`You earned ${coins} coins!`);
      }
    } catch (error) {
      console.error('Error updating rewards:', error);
      toast.error('Failed to update rewards');
    }
  }

  useEffect(() => {
    if (userId) {
      fetchRewards();
    }
  }, [userId]);

  return { rewards, addReward, loading };
}
