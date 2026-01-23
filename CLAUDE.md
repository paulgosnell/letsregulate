# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Let's Regulate is an emotional regulation platform for children (ages 5-12) with AI-powered chat and voice support. This is a **Thrive Venture Labs** project.

## Repository Structure

This monorepo contains two Vite + React + TypeScript applications:

```
letsregulate/
├── app/                    # Main application (emotional regulation tools)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # Login, Register forms
│   │   │   ├── chat/       # ChatInterface, MoodSelector, VoiceChat
│   │   │   ├── tools/      # BreathingExercise, MovementExercise, AffirmationExercise
│   │   │   └── ui/         # Toast, LoadingSpinner, Logo, WaveBackground
│   │   ├── hooks/          # useAuth, useChat, useRewards
│   │   ├── lib/            # claude.ts, supabase.ts, openai-realtime.ts
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Constants, helpers
│   └── supabase/migrations/
├── website/                # Marketing landing page
│   └── src/
│       ├── components/     # Hero, HowItWorks, Audiences, etc.
│       └── pages/          # Home, DesignSystem
└── supabase/functions/     # Edge functions (openai-realtime-session)
```

## Development Commands

### App (Main Application)
```bash
cd app
npm install
npm run dev          # Dev server at http://localhost:5179
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Website (Landing Page)
```bash
cd website
npm install
npm run dev          # Dev server at http://localhost:5175
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
```

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 with custom pastel color palette
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions)
- **AI Chat**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Voice AI**: Gemini 2.5 Live API (WebSocket-based real-time voice)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Supabase

- **Project**: Lets Regulate (`wgrqgcwabpebxtkwmnkb`)
- **Region**: eu-west-2

### Database Schema
- `profiles` - User profiles (child/parent/family roles)
- `sessions` - Chat sessions with mood tracking
- `rewards` - Stars and coins earned
- `ai_logs` - Conversation history and AI interaction logs

### Key Types
```typescript
type UserRole = 'child' | 'parent' | 'family';
type MoodType = 'happy' | 'sad' | 'angry' | 'worried' | 'calm' | 'excited' | 'scared';
type ToolType = 'breathing' | 'movement' | 'affirmation';
```

## Environment Variables

### App (`/app/.env.local`)
```bash
VITE_SUPABASE_URL=<configured in Vercel>
VITE_SUPABASE_ANON_KEY=<configured in Vercel>
VITE_CLAUDE_API_KEY=<configured in Vercel>
GEMINI_API_KEY=<configured in Supabase Edge Function secrets>
```

## Architecture Notes

### App Flow
1. User authenticates via Supabase Auth (email/password)
2. Profile created on registration with role selection
3. User selects current mood → creates session
4. Chat with Claude AI "Regulation Buddy"
5. AI suggests tools based on mood/conversation
6. User completes tools (breathing, movement, affirmation) → earns stars

### AI Integration
- **Text Chat**: Direct Claude API calls via `lib/claude.ts` (MVP uses `dangerouslyAllowBrowser: true` - needs Edge Function for production)
- **Voice Chat**: Gemini 2.5 Live API for real-time voice (see global `~/.claude/rules/gemini-voice-agent.md`)

### Conversation Persistence
- Messages saved to `ai_logs` table
- History loaded per session
- Recent conversations available for context

## Brand Guidelines

- **Colors**: Rainbow pastels (lavender, mint, peach, sky, rose) defined in `tailwind.config.js`
- **Primary**: Lavender (`#C4A7E7`)
- **Background**: Cream (`#F5F5F0`)
- **Fonts**: Nunito, Sofia Sans, Quicksand
- **Tone**: Warm, nurturing, gentle, playful

See `/website/BRAND_STYLE_GUIDE.md` for complete guidelines.

## Production URLs

- **Website**: https://www.letsregulateapp.com/
- **App**: https://app.letsregulateapp.com/ (or similar subdomain)

## Current Focus

Shipping MVP with:
1. Core emotional regulation tools working
2. Gemini 2.5 voice integration (complete)
3. Basic auth and session management
4. Move Claude API calls to Edge Function (security)
