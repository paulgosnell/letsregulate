import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../ui/Toast';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { UserRole } from '../../types';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState<UserRole>('child');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password || !confirmPassword || !name) {
      toast.error('Please fill in all required fields');
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

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (role === 'child' && age) {
      const ageNum = parseInt(age);
      if (ageNum < 3 || ageNum > 17) {
        toast.error('Age must be between 3 and 17 for children');
        return;
      }
    }

    setLoading(true);

    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Wait for trigger to create basic profile, then update with form data
      // The database trigger creates a basic profile, we update it with the user's info
      await new Promise(resolve => setTimeout(resolve, 500));

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role,
          name,
          age: age ? parseInt(age) : null,
          preferences: {}
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      // Rewards are automatically created by database trigger

      toast.success('Account created! Please check your email to confirm.');
      onSuccess();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Creating your account..." />;
  }

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-700 mb-2">Join Let's Regulate</h1>
        <p className="text-slate-500">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-slate-600">Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Your name"
            autoComplete="name"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-semibold text-slate-600">I am a *</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="input-field"
            disabled={loading}
          >
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="family">Family (Shared)</option>
          </select>
        </div>

        {role === 'child' && (
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-semibold text-slate-600">Age (3-17)</label>
            <input
              id="age"
              type="number"
              min="3"
              max="17"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input-field"
              placeholder="Your age"
              disabled={loading}
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-600">Email *</label>
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
          <label htmlFor="password" className="block text-sm font-semibold text-slate-600">Password *</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-600">Confirm Password *</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="Re-enter password"
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-primary w-full mt-6" disabled={loading}>
          Create Account
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-lavender-dark font-semibold hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
