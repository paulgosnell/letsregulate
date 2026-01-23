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
│   │   │   ├── conversation/  # ConversationUI, LumaAvatar, ModeToggle, etc.
│   │   │   ├── tools/      # BreathingExercise, MovementExercise, AffirmationExercise
│   │   │   └── ui/         # Toast, LoadingSpinner, Logo, WaveBackground
│   │   ├── hooks/          # useAuth, useRewards
│   │   ├── lib/            # gemini-conversation.ts, prompts.ts, supabase.ts
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Constants, helpers
│   └── supabase/migrations/
├── website/                # Marketing landing page
│   └── src/
│       ├── components/     # Hero, HowItWorks, Audiences, etc.
│       └── pages/          # Home, DesignSystem
└── supabase/functions/     # Edge functions (gemini-text, gemini-vision, gemini-voice-session)
```

## Development Commands

### App (Main Application)
```bash
cd app
npm install
npm run dev          # Dev server at http://localhost:5173
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
- **AI**: Gemini 2.5 (unified - text, voice, and vision)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Supabase

- **Project**: Lets Regulate (`wgrqgcwabpebxtkwmnkb`)
- **Region**: eu-west-2

### Edge Functions
- `gemini-text` - Text chat via Gemini API
- `gemini-vision` - Image/camera analysis via Gemini API
- `gemini-voice-session` - WebSocket URL for Gemini Live API (real-time voice)

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
```

### Supabase Edge Functions (Secrets)
```bash
GEMINI_API_KEY=<configured in Supabase secrets>
```

## Architecture Notes

### App Flow
1. User authenticates via Supabase Auth (email/password)
2. Profile created on registration with role selection
3. User selects current mood → creates session
4. Chat with "Luma" AI (Gemini-powered regulation buddy)
5. AI suggests tools based on mood/conversation
6. User completes tools (breathing, movement, affirmation) → earns stars

### Unified AI Integration (Gemini)
All AI features use Gemini via secure Supabase Edge Functions:

- **Text Chat**: `gemini-text` edge function → Gemini 2.0 Flash
- **Voice Chat**: `gemini-voice-session` edge function → Gemini 2.5 Live API (WebSocket)
- **Vision/Camera**: `gemini-vision` edge function → Gemini 2.0 Flash with image input

### Conversation UI
The `ConversationUI` component supports three modes:
- **Text**: Traditional chat interface
- **Voice**: Real-time voice with Luma avatar animation
- **Video**: Camera + voice with vision analysis

The Luma avatar (mascot) animates based on audio amplitude during voice conversations.

### Key Files
- `lib/gemini-conversation.ts` - Unified conversation class
- `lib/prompts.ts` - Luma personality and system prompts
- `components/conversation/LumaAvatar.tsx` - Animated mascot
- `components/conversation/ConversationUI.tsx` - Main conversation orchestrator

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
- **Mascot**: Luma - friendly creature from videos in Supabase storage

See `/website/BRAND_STYLE_GUIDE.md` for complete guidelines.

## Production URLs

- **Website**: https://www.letsregulateapp.com/
- **App**: https://app.letsregulateapp.com/ (or similar subdomain)

## Current Status

MVP complete with:
1. Core emotional regulation tools working
2. Unified Gemini AI (text, voice, vision)
3. Luma mascot with audio-reactive animation
4. Secure edge functions for all API calls
5. Basic auth and session management
