# Let's Regulate

An emotional regulation toolkit for children (ages 5-12), built with React, TypeScript, Supabase, and Claude AI.

## Features

- **Mood Tracking**: Children can select their current mood
- **AI Chat Companion**: Talk to the "Regulation Buddy" powered by Claude AI
- **Regulation Tools**:
  - Breathing exercises with visual guides
  - Movement exercises with step-by-step instructions
  - Positive affirmations
- **Rewards System**: Earn stars and coins for completing exercises
- **Parent Dashboard**: (Coming soon) Track progress and view session history

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (Authentication + PostgreSQL)
- **AI**: Anthropic Claude API
- **PWA**: Vite PWA Plugin
- **Styling**: CSS with custom variables

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account
- Anthropic API key

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Copy your project URL and anon key from Settings > API

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Fill in your credentials:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLAUDE_API_KEY=your-claude-api-key
VITE_ELEVENLABS_API_KEY=your-elevenlabs-key (optional)
VITE_ELEVENLABS_AGENT_ID=your-agent-id (optional)
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## Project Structure

```
lets-regulate/
├── src/
│   ├── components/
│   │   ├── auth/          # Login & Registration
│   │   ├── chat/          # Mood selector, chat interface
│   │   ├── tools/         # Exercise components
│   │   └── ui/            # Toast, Loading spinner
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Supabase, Claude integration
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Constants & helpers
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/
│   ├── manifest.json      # PWA manifest
│   └── icons/             # App icons
└── supabase/
    └── migrations/        # Database schema
```

## Usage

1. **Sign Up**: Create an account (child or parent)
2. **Select Mood**: Choose how you're feeling
3. **Chat**: Talk to the Regulation Buddy about your feelings
4. **Try Tools**: Use breathing, movement, or affirmation exercises
5. **Earn Rewards**: Collect stars for completing exercises

## Security Notes

⚠️ **Important**: The current implementation uses `dangerouslyAllowBrowser: true` for the Claude API client. This is **only for MVP/development**. For production:

1. Move Claude API calls to Supabase Edge Functions
2. Never expose API keys in client-side code
3. Implement proper rate limiting
4. Enable RLS (Row Level Security) policies in Supabase

## Roadmap

- [ ] Parent dashboard with analytics
- [ ] Voice mode with 11Labs integration
- [ ] Offline PWA support
- [ ] Multi-language support
- [ ] Customizable avatars
- [ ] Journaling feature
- [ ] School/educator portal

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
