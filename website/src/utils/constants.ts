// App Configuration
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5179';

export const colors = {
  seaGlass: '#8B9D83',
  sage: '#A8B5A0',
  sandyBeige: '#E8DCC4',
  softCream: '#F5F5F0',
  mutedTeal: '#6B8E8E',
  warmGray: '#9CA3AF',
  white: '#FFFFFF'
};

export const socialLinks = {
  instagram: 'https://instagram.com/letsregulate',
  facebook: 'https://facebook.com/letsregulate',
  youtube: 'https://youtube.com/@letsregulate',
};

export const navLinks = [
  { label: 'About', href: '#what-it-is' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Schools', href: '#audiences' },
  { label: 'Contact', href: '#cta' },
];
