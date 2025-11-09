import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../ui/Toast';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { UserRole } from '../../types';
import './AuthForms.css';

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
    <div className="auth-form">
      <h1 className="auth-title">Join Let's Regulate</h1>
      <p className="auth-subtitle">Create your account to get started</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Your name"
            autoComplete="name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">I am a *</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="form-input"
            disabled={loading}
          >
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="family">Family (Shared)</option>
          </select>
        </div>

        {role === 'child' && (
          <div className="form-group">
            <label htmlFor="age" className="form-label">Age (3-17)</label>
            <input
              id="age"
              type="number"
              min="3"
              max="17"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="form-input"
              placeholder="Your age"
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="your@email.com"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password *</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            placeholder="Re-enter password"
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          Create Account
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-switch">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="link-button">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
