# Let's Regulate

An emotional regulation platform for children with AI-powered chat and voice support.

## Project Structure

This repository contains two applications:

### 🌐 Website (`/website`)
Marketing landing page built with React, TypeScript, and Tailwind CSS.

- **Purpose**: Public-facing landing page to promote the app
- **Features**: Hero section, app showcase, feature descriptions, email waitlist
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Dev Server**: `http://localhost:5175`

```bash
cd website
npm install
npm run dev
```

### 📱 App (`/app`)
Main application with emotional regulation tools and AI companions.

- **Purpose**: The actual Let's Regulate application
- **Features**:
  - Text chat with Claude AI (Regulation Buddy)
  - Voice chat with ElevenLabs AI
  - Mood tracking and selection
  - Breathing exercises, movement activities, affirmations
  - Rewards system (stars & coins)
  - User authentication via Supabase
- **Tech Stack**: React 18, TypeScript, Vite, Supabase, Claude API, ElevenLabs API
- **Dev Server**: `http://localhost:5179`

```bash
cd app
npm install
npm run dev
```

## User Flow

1. **Users land on the website** (`/website`) at the marketing page
2. **Click "Get Started" or "Launch App"** buttons to open the app
3. **App opens** (`/app`) where users can register/login and use the platform

## Environment Setup

### Website
No environment variables needed for local development.

### App
Create `/app/.env.local` with:

```bash
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Claude AI
VITE_CLAUDE_API_KEY=your-claude-api-key

# ElevenLabs Voice
VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key
VITE_ELEVENLABS_AGENT_ID=your-agent-id
```

See `/app/.env.example` for reference.

## Development

Run both servers simultaneously in development:

```bash
# Terminal 1 - Website
cd website && npm run dev

# Terminal 2 - App
cd app && npm run dev
```

## Brand

- **Colors**: Rainbow pastels (lavender, mint, peach, sky, rose)
- **Fonts**: Nunito, Sofia Sans, Quicksand
- **Tone**: Warm, nurturing, gentle, playful
- **Target Audience**: Children (3-17), parents, educators

See `/website/BRAND_STYLE_GUIDE.md` for complete brand guidelines.

## Database

The app uses Supabase with the following schema:
- `profiles` - User profiles with role (child/parent/family)
- `sessions` - Chat sessions with mood tracking
- `rewards` - User rewards (stars & coins)
- `ai_logs` - AI interaction logs

See `/app/supabase/migrations/` for schema details.

## Deployment

*Coming soon*

## Contributing

*Coming soon*

## License

*Coming soon*
