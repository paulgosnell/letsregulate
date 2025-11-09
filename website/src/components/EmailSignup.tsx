import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface EmailSignupProps {
  placeholder?: string;
  buttonText?: string;
  onSubmit: (email: string) => Promise<void>;
}

export default function EmailSignup({
  placeholder = 'Enter your email',
  buttonText = 'Join Waitlist',
  onSubmit
}: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email);
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Oops! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center p-6 bg-white rounded-2xl shadow-sm"
          >
            <div className="flex justify-center mb-3">
              <Sparkles className="w-10 h-10 text-lavender-dark" />
            </div>
            <p className="text-lg font-semibold text-lavender-dark">
              Thanks! We'll be in touch soon.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-6 py-4 rounded-full border-2 border-lavender focus:border-lavender
                       focus:outline-none focus:ring-4 focus:ring-lavender focus:ring-opacity-20
                       transition-all duration-300 min-h-[44px]"
              disabled={loading}
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={buttonText}
            >
              {loading ? 'Joining...' : buttonText}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-2 text-center"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
