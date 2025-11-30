import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../ui/Toast';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Welcome back!');
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Signing in..." />;
  }

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-700 mb-2">Welcome Back!</h1>
        <p className="text-slate-500">Sign in to continue your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-600">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="your@email.com"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-slate-600">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••"
            autoComplete="current-password"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          Sign In
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-lavender-dark font-semibold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
