# Let's Regulate – Claude Code Ready PRD

> **Version:** 2.0 (Implementation Ready)  
> **Stack:** React 18 + TypeScript + Vite + Supabase + Claude AI + 11Labs  
> **Target:** Mobile PWA (iOS/Android)  
> **Timeline:** 2-3 days focused dev time

---

## 🎯 Build Order

1. **Phase 1** (4 hours): Supabase + Auth + Database
2. **Phase 2** (3 hours): Claude AI Chat Interface
3. **Phase 3** (2 hours): Toolpaths + Rewards
4. **Phase 4** (2 hours): Parent Dashboard
5. **Phase 5** (3 hours): 11Labs Voice Mode
6. **Phase 6** (2 hours): PWA + Polish

---

## 📁 Project Structure

```
lets-regulate/
├── .env.example
├── .env.local
├── vite.config.ts
├── tsconfig.json
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── claude.ts
│   │   └── elevenlabs.ts
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProfileSelector.tsx
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MoodSelector.tsx
│   │   │   └── VoiceToggle.tsx
│   │   ├── tools/
│   │   │   ├── ToolCard.tsx
│   │   │   ├── BreathingExercise.tsx
│   │   │   ├── MovementExercise.tsx
│   │   │   └── AffirmationExercise.tsx
│   │   ├── dashboard/
│   │   │   ├── ParentDashboard.tsx
│   │   │   ├── ProgressCard.tsx
│   │   │   └── SessionHistory.tsx
│   │   └── ui/
│   │       ├── Toast.tsx
│   │       └── LoadingSpinner.tsx
│   ├── types/
│   │   ├── database.types.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useVoice.ts
│   │   └── useRewards.ts
│   └── utils/
│       ├── constants.ts
│       └── helpers.ts
```

---

## 🔧 Environment Variables

### `.env.example`
```bash
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Anthropic Claude
VITE_CLAUDE_API_KEY=sk-ant-xxx

# 11Labs Voice
VITE_ELEVENLABS_API_KEY=xxx
VITE_ELEVENLABS_AGENT_ID=xxx
```

---

## 🗄️ Supabase Schema

### SQL Migration: `001_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE user_role AS ENUM ('child', 'parent', 'family');
CREATE TYPE mood_type AS ENUM ('happy', 'sad', 'angry', 'worried', 'calm', 'excited', 'scared');
CREATE TYPE tool_type AS ENUM ('breathing', 'movement', 'affirmation');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role user_role NOT NULL DEFAULT 'child',
  name TEXT NOT NULL,
  age INTEGER,
  avatar_url TEXT,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood mood_type,
  tool_used tool_type,
  duration_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stars INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- AI logs table
CREATE TABLE ai_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  tool_triggered tool_type,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own + their children's profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Parents can view children profiles" ON profiles
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Sessions: users can view/create their own sessions
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rewards: users can view/update their own rewards
CREATE POLICY "Users can view own rewards" ON rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards" ON rewards
  FOR UPDATE USING (auth.uid() = user_id);

-- AI Logs: users can view their own logs
CREATE POLICY "Users can view own ai_logs" ON ai_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX idx_ai_logs_session_id ON ai_logs(session_id);
CREATE INDEX idx_ai_logs_user_id ON ai_logs(user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 🎨 Component Specifications

### `src/components/auth/LoginForm.tsx`

```typescript
interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

// State: email, password, loading, error
// Validation: email format, password min 6 chars
// Calls: supabase.auth.signInWithPassword()
// Toast: "Welcome back!" on success, error message on fail
```

### `src/components/auth/RegisterForm.tsx`

```typescript
interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

// State: email, password, confirmPassword, name, age, role, loading, error
// Validation: passwords match, email valid, name required, age 3-17 for children
// Calls: supabase.auth.signUp() then creates profile record
// Toast: "Account created!" on success
```

### `src/components/chat/MoodSelector.tsx`

```typescript
interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
  disabled?: boolean;
}

// Renders: 7 emoji buttons for each mood_type
// Layout: Grid 3 columns, large touch targets (min 60px)
// Animation: Scale on press, haptic feedback if supported
// Emojis: 😊 happy, 😢 sad, 😠 angry, 😰 worried, 😌 calm, 🤩 excited, 😨 scared
```

### `src/components/chat/ChatInterface.tsx`

```typescript
interface ChatInterfaceProps {
  userId: string;
  sessionId: string;
}

// State: messages[], input, loading, voiceMode
// Messages format: { id, role: 'user'|'assistant', content, timestamp }
// Auto-scroll to bottom on new message
// Shows typing indicator when AI is responding
// Input: TextArea with auto-grow, max 500 chars
// Send button: Disabled when empty or loading
```

### `src/components/tools/BreathingExercise.tsx`

```typescript
interface BreathingExerciseProps {
  onComplete: () => void;
  onExit: () => void;
}

// Cycle: Breathe In (4s) → Hold (4s) → Breathe Out (4s) → Hold (4s)
// Repeat: 5 cycles total
// Visual: Expanding/contracting circle animation
// Audio: Optional calm background tone
// Text: "Breathe in..." "Hold..." "Breathe out..."
// Completion: Award 5 stars, call onComplete
```

### `src/components/tools/MovementExercise.tsx`

```typescript
interface MovementExerciseProps {
  onComplete: () => void;
  onExit: () => void;
}

// Steps: 6 gentle movements
// 1. "Stretch your arms up high like a tree"
// 2. "Roll your shoulders back slowly"
// 3. "Touch your toes gently"
// 4. "Twist left, then right"
// 5. "Shake out your hands"
// 6. "Take a deep breath and smile"
// Timer: 10 seconds per step
// Visual: Simple illustrations or lottie animations
// Completion: Award 5 stars, call onComplete
```

### `src/components/tools/AffirmationExercise.tsx`

```typescript
interface AffirmationExerciseProps {
  onComplete: () => void;
  onExit: () => void;
}

// Shows: 5 random affirmations from predefined list
// Format: Large text, calm background
// Affirmations list:
// "I am calm and strong"
// "I can handle my feelings"
// "I am safe and loved"
// "I choose to feel peaceful"
// "I am brave and kind"
// User taps to advance
// Final screen: "You did great! 🌟"
// Completion: Award 5 stars, call onComplete
```

### `src/components/dashboard/ParentDashboard.tsx`

```typescript
interface ParentDashboardProps {
  parentId: string;
}

// Fetches: All child profiles, their sessions, rewards
// Displays: 
// - Child cards with avatar, name, total stars/coins
// - This week's activity chart
// - Recent sessions list (last 10)
// - "Add Child Profile" button
// Actions: View child detail, export data (future)
```

---

## 🤖 Claude AI Integration

### `src/lib/claude.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true // Only for MVP, move to Edge Function later
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ToolSuggestion {
  tool: 'breathing' | 'movement' | 'affirmation' | null;
  reason: string;
}

export async function sendMessage(
  messages: ChatMessage[],
  mood?: string
): Promise<{ reply: string; toolSuggestion?: ToolSuggestion }> {
  const systemPrompt = `You are the "Regulation Buddy," a warm, emotionally intelligent AI guide helping children (ages 5-12) understand and regulate their feelings.

TONE: Calm, encouraging, safe, playful but not overly childish.

RULES:
- Use simple words (avoid jargon)
- Keep responses under 3 sentences
- Always validate feelings first
- Offer tools when appropriate
- Never give medical advice
- If child seems distressed, gently suggest talking to a trusted adult

TOOLS AVAILABLE:
- Breathing: For anxiety, overwhelm, anger
- Movement: For restlessness, sadness, tension
- Affirmation: For low confidence, worry, negative self-talk

CURRENT MOOD: ${mood || 'not specified'}

When suggesting a tool, respond with: "Would you like to try [tool name] together?"`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  });

  const reply = response.content[0].text;
  
  // Simple tool detection (enhance with Claude function calling later)
  const toolSuggestion = detectToolSuggestion(reply);

  return { reply, toolSuggestion };
}

function detectToolSuggestion(text: string): ToolSuggestion | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('breathing') || lower.includes('breathe')) {
    return { tool: 'breathing', reason: 'Suggested by AI' };
  }
  if (lower.includes('movement') || lower.includes('move') || lower.includes('stretch')) {
    return { tool: 'movement', reason: 'Suggested by AI' };
  }
  if (lower.includes('affirmation') || lower.includes('remind yourself')) {
    return { tool: 'affirmation', reason: 'Suggested by AI' };
  }
  return undefined;
}
```

---

## 🎤 11Labs Voice Integration

### `src/lib/elevenlabs.ts`

```typescript
interface VoiceConfig {
  agentId: string;
  apiKey: string;
}

export class VoiceManager {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  
  constructor(private config: VoiceConfig) {}

  async connect(onMessage: (text: string) => void): Promise<void> {
    // WebSocket connection to 11Labs Conversational AI
    const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${this.config.agentId}`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('Voice connection established');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'audio') {
        this.playAudio(data.audio);
      }
      if (data.type === 'transcript') {
        onMessage(data.text);
      }
    };
  }

  async startListening(): Promise<void> {
    // Request microphone permission (must be user gesture)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Set up audio processing
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);
    
    // Send audio chunks to WebSocket
    // Implementation details...
  }

  stopListening(): void {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  private playAudio(base64Audio: string): void {
    // Decode and play audio response
    // Implementation details...
  }
}
```

---

## 🔐 Supabase Client Setup

### `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateRewards(userId: string, stars: number, coins: number) {
  const { data, error } = await supabase
    .from('rewards')
    .upsert({ 
      user_id: userId, 
      stars, 
      coins,
      last_updated: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function createSession(userId: string, mood?: string) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: userId, mood })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function logAIMessage(
  sessionId: string, 
  userId: string,
  input: string, 
  output: string,
  toolTriggered?: string
) {
  const { error } = await supabase
    .from('ai_logs')
    .insert({ 
      session_id: sessionId,
      user_id: userId,
      input, 
      output,
      tool_triggered: toolTriggered 
    });
  
  if (error) throw error;
}
```

---

## 🎣 Custom Hooks

### `src/hooks/useAuth.ts`

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const profile = await getProfile(userId);
    setProfile(profile);
  }

  return { user, profile, loading };
}
```

### `src/hooks/useRewards.ts`

```typescript
export function useRewards(userId: string) {
  const [rewards, setRewards] = useState({ stars: 0, coins: 0 });
  const [loading, setLoading] = useState(true);

  async function fetchRewards() {
    const { data } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      setRewards({ stars: data.stars, coins: data.coins });
    }
    setLoading(false);
  }

  async function addReward(stars: number, coins: number = 0) {
    const newStars = rewards.stars + stars;
    const newCoins = rewards.coins + coins;
    
    await updateRewards(userId, newStars, newCoins);
    setRewards({ stars: newStars, coins: newCoins });
    
    // Show toast
    toast.success(`You earned ${stars} stars! ⭐`);
  }

  useEffect(() => {
    fetchRewards();
  }, [userId]);

  return { rewards, addReward, loading };
}
```

---

## 📱 PWA Configuration

### `public/manifest.json`

```json
{
  "name": "Let's Regulate",
  "short_name": "Regulate",
  "description": "Emotional regulation toolkit for children",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F5F0",
  "theme_color": "#8B9D83",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "orientation": "portrait",
  "categories": ["health", "education", "kids"]
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: false, // Using public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

## 🎯 Implementation Checklist

### Phase 1: Foundation (4 hours)
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install dependencies: `@supabase/supabase-js`, `@anthropic-ai/sdk`, `@11labs/client`
- [ ] Set up environment variables
- [ ] Run Supabase SQL migration
- [ ] Create `lib/supabase.ts` with helper functions
- [ ] Build `LoginForm` and `RegisterForm` components
- [ ] Test auth flow end-to-end

### Phase 2: Chat Interface (3 hours)
- [ ] Create `lib/claude.ts` with system prompt
- [ ] Build `MoodSelector` component
- [ ] Build `ChatInterface` component
- [ ] Build `MessageBubble` component
- [ ] Implement message sending/receiving
- [ ] Add loading states and error handling
- [ ] Store messages in `ai_logs` table
- [ ] Test conversation flow

### Phase 3: Toolpaths (2 hours)
- [ ] Build `BreathingExercise` with animation
- [ ] Build `MovementExercise` with steps
- [ ] Build `AffirmationExercise` with affirmations list
- [ ] Create `ToolCard` wrapper component
- [ ] Implement tool completion logic
- [ ] Connect rewards system
- [ ] Test each toolpath

### Phase 4: Parent Dashboard (2 hours)
- [ ] Build `ParentDashboard` layout
- [ ] Create `ProgressCard` component
- [ ] Create `SessionHistory` list
- [ ] Fetch child profiles and sessions
- [ ] Display total stars/coins
- [ ] Add basic filtering/sorting
- [ ] Test with multiple child profiles

### Phase 5: Voice Mode (3 hours)
- [ ] Create `lib/elevenlabs.ts`
- [ ] Build `VoiceToggle` component
- [ ] Implement WebSocket connection
- [ ] Handle audio input/output
- [ ] Add iOS-specific audio permission handling
- [ ] Test voice interaction flow
- [ ] Fallback to text if voice fails

### Phase 6: Polish (2 hours)
- [ ] Add PWA manifest and service worker
- [ ] Test iOS home screen install
- [ ] Implement `Toast` component
- [ ] Add loading spinners
- [ ] Implement error boundaries
- [ ] Add accessibility attributes
- [ ] Test offline functionality
- [ ] Final QA on iPhone

---

## 🧪 Testing Checklist

- [ ] Auth: Register, login, logout, password reset
- [ ] Child can select mood and chat with AI
- [ ] AI suggests appropriate tools based on mood
- [ ] Each toolpath completes and awards stars
- [ ] Rewards persist across sessions
- [ ] Parent can view child progress
- [ ] Voice mode works on iOS (with gesture)
- [ ] PWA installs on iOS home screen
- [ ] App works offline (cached views)
- [ ] No console errors or warnings
- [ ] Data privacy: RLS policies enforced
- [ ] Touch targets ≥ 44px
- [ ] Text readable (dyslexia-friendly font)

---

## 🚀 Deployment

### Supabase
1. Create project at supabase.com
2. Run SQL migration in SQL Editor
3. Copy project URL and anon key
4. Enable Email Auth provider
5. (Optional) Enable Apple Sign-In

### Vercel/Netlify
1. Connect GitHub repo
2. Set environment variables
3. Build command: `npm run build`
4. Deploy
5. Test PWA install on real device

---

## 📊 Success Criteria

- [x] User can register and login
- [x] Child profile created with age/name
- [x] Mood selector works, starts session
- [x] AI responds contextually within 2s
- [x] All 3 toolpaths functional
- [x] Rewards update in real-time
- [x] Parent dashboard shows accurate data
- [x] Voice mode works on iOS with user gesture
- [x] PWA installs without errors
- [x] No auth/database security issues

---

## 🔄 Post-MVP Enhancements

1. **Enhanced AI Tools** - Journaling, creative drawing prompts
2. **Analytics Dashboard** - Mood trends, usage patterns
3. **Multiplayer Challenges** - Sibling breathing contests
4. **School Portal** - Educator access, classroom mode
5. **Offline Mode** - Full PWA with local storage sync
6. **Multi-language** - Spanish, French, Arabic support
7. **Customization** - Avatar builder, theme colors
8. **Voice Packs** - Different AI personalities

---

> **Ready for Claude Code.** Each section is implementation-specific with file paths, type signatures, and clear acceptance criteria.
