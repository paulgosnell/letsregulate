# Let's Regulate — Landing Page PRD

> **Version:** 1.0 (Claude Code Ready)  
> **Stack:** React 18 + TypeScript + Vite + Framer Motion + Tailwind CSS  
> **Target:** Responsive Marketing Landing Page  
> **Timeline:** 2-3 hours focused dev time

---

## 🎯 Purpose

To introduce Let's Regulate as an empowering, emotional-wellbeing platform for children, parents, and schools — showcasing its mission, visual calm, and human warmth.

**Goal:** Encourage sign-ups, app interest, and emotional connection with the brand.

---

## 📐 Project Structure

```
lets-regulate-landing/
├── .env.example
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   ├── og-image.png
│   └── favicon.ico
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── WhatItIs.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── WhyItMatters.tsx
│   │   ├── Audiences.tsx
│   │   ├── CallToAction.tsx
│   │   ├── Footer.tsx
│   │   ├── WaveBackground.tsx
│   │   ├── BreathingAnimation.tsx
│   │   └── EmailSignup.tsx
│   ├── assets/
│   │   └── images/
│   └── utils/
│       └── constants.ts
```

---

## 🎨 Design System

### Color Palette
```typescript
// src/utils/constants.ts
export const colors = {
  seaGlass: '#8B9D83',      // Primary CTA, accent
  sage: '#A8B5A0',          // Secondary accent
  sandyBeige: '#E8DCC4',    // Section backgrounds
  softCream: '#F5F5F0',     // Main background
  mutedTeal: '#6B8E8E',     // Text, icons
  warmGray: '#9CA3AF',      // Secondary text
  white: '#FFFFFF'
};
```

### Typography
- **Primary Font:** 'Nunito', 'Quicksand', or 'Sofia Sans' (rounded sans-serif)
- **Headings:** 600-700 weight
- **Body:** 400-500 weight
- **Size Scale:** Mobile-first (base 16px, scale up for desktop)

### Animations
- Gentle wave movement (breathing rhythm)
- Floating bubbles (subtle, non-distracting)
- Fade-in-up on scroll
- Smooth scroll between sections

---

## 📄 Page Sections

### 1. Header / Hero Section

**Purpose:** Instantly communicate calm, connection, and purpose.

**Design:**
- Pale cream background with soft beach tone fade
- Logo: top center or left-aligned
- Hero CTA: "Get your free emotional toolkit" (sea-glass turquoise button)
- Hero visual: flowing wave shapes with subtle breathing animation
- Optional: calm illustration of child and parent using mindfulness

**Copy:**
```
Headline: "A lifelong toolkit for emotional wellbeing"
Subheadline: "Helping children feel safe, strong and seen."

Body: "Let's Regulate gives families and schools the tools to understand emotions, 
find calm, and grow confident together."

CTA Buttons: [Get Started] [Learn More]
```

**Component:** `src/components/Hero.tsx`

---

### 2. What It Is

**Purpose:** Introduce the concept clearly and warmly.

**Design:**
- Two columns: animation/illustration on left, text on right (stack on mobile)
- Very light teal or sandy beige tint background
- Gentle wave divider at bottom

**Copy:**
```
Heading: "What is Let's Regulate?"

Body: "Let's Regulate is an AI-powered wellbeing toolkit for children — blending 
mindfulness, breathwork, and creative play to build emotional balance.

Children learn to recognise their feelings, calm their bodies, and find confidence 
through guided games, stories, and exercises."
```

**Component:** `src/components/WhatItIs.tsx`

---

### 3. How It Works

**Purpose:** Show ease and personalisation.

**Design:**
- Three columns (stack on mobile)
- Soft icons with short text under each
- Gentle wave divider between sections
- Number badges (1, 2, 3) in circles

**Copy:**
```
Heading: "How It Works"

Step 1: "Create your profile"
"Personalise your toolkit with your child's age, interests, and needs."

Step 2: "Choose how you feel today"
"Calm, tired, motivated, worried…"

Step 3: "Get your tools"
"Breathing games, creative prompts, affirmations, and mindful movement designed just for you."

CTA: "Start building your toolkit"
```

**Component:** `src/components/HowItWorks.tsx`

---

### 4. Why It Matters

**Purpose:** Emotional impact + credibility.

**Design:**
- Soft gradient background
- Large quote or testimonial card
- Floating bubbles or gentle wave animation
- Optional: subtle image of peaceful child/family moment

**Copy:**
```
Quote: "Children aren't born knowing how to regulate — it's something they learn.
Let's Regulate helps them practice calm, confidence, and connection through play."

Subtext: "Created by children's wellbeing specialists, blending neuroscience and heart."
```

**Component:** `src/components/WhyItMatters.tsx`

---

### 5. For Schools & Parents

**Purpose:** Broaden audience and build trust.

**Design:**
- Split section: left = parents, right = schools
- Two distinct cards with icons
- Light background, gentle borders

**Copy:**
```
Heading: "For Everyone Who Cares"

Left Card - For Parents:
"Tools for home calm time, emotional check-ins, and positive family moments."

Right Card - For Schools:
"Whole-class wellbeing lessons and simple self-regulation tools for the school day."
```

**Component:** `src/components/Audiences.tsx`

---

### 6. Call to Action

**Purpose:** Re-engage emotion + conversion.

**Design:**
- Wave imagery returns
- Large, clear button: "Join the Waitlist" or "Get Your Free Toolkit"
- Email signup form
- Breathing animation in background

**Copy:**
```
Heading: "Join thousands of parents helping their children feel calm, connected, and confident."

CTA Button: "Join the Waitlist"
```

**Component:** `src/components/CallToAction.tsx`

---

### 7. Footer

**Design:**
- Minimalist: light cream background
- Muted teal text
- Social icons (Instagram, Facebook, YouTube)
- Simple navigation links

**Links:**
- About
- Contact
- Privacy
- Schools
- Blog (optional)

**Component:** `src/components/Footer.tsx`

---

## 🎭 Special Components

### Wave Background Component
**File:** `src/components/WaveBackground.tsx`

```typescript
// Animated SVG wave that mimics breathing rhythm
// Props: amplitude, frequency, speed, color
// Use: <WaveBackground /> as section background
```

### Breathing Animation
**File:** `src/components/BreathingAnimation.tsx`

```typescript
// Expanding/contracting circle with smooth ease-in-out
// Cycle: 4s in, 4s out
// Props: size, color, opacity
// Use: Hero section, CTA section
```

### Email Signup Form
**File:** `src/components/EmailSignup.tsx`

```typescript
interface EmailSignupProps {
  placeholder?: string;
  buttonText?: string;
  onSubmit: (email: string) => void;
}

// State: email, loading, submitted, error
// Validation: email format
// Toast: "Thanks! We'll be in touch soon" on success
// Styling: Rounded input, sea-glass button
```

---

## 🛠️ Technical Stack

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5",
    "vite": "^5.2.11"
  }
}
```

### Tailwind Config
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        seaGlass: '#8B9D83',
        sage: '#A8B5A0',
        sandyBeige: '#E8DCC4',
        softCream: '#F5F5F0',
        mutedTeal: '#6B8E8E',
      },
      fontFamily: {
        sans: ['Nunito', 'sofia-sans', 'Quicksand', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'wave': 'wave 6s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-20px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 📝 Tone of Voice

**Guidelines:**
- Warm, reassuring, and emotionally intelligent
- Speak to parents and educators as equals — nurturing, not instructive
- Use simple, affirming language children could understand too

**Example Phrases:**
- "Helping children find their calm."
- "Tools for growing calm minds and kind hearts."
- "Where emotions meet understanding."
- "Safe to feel, strong to grow."

---

## ⚙️ Functional Requirements

### Email Signup
- Capture email to list (ready to wire to backend/service)
- Validation: proper email format
- Success state: "Thanks! We'll be in touch soon."
- Error handling: "Oops! Please try again."

### Smooth Scroll
- Navigation links scroll smoothly to sections
- Offset for fixed header if present

### Mobile Responsive
- All sections stack vertically on mobile
- Wave animations adapt to viewport
- Touch targets ≥ 44px
- Readable font sizes (min 16px body)

### Performance
- Lazy load images
- Optimize animations (GPU-accelerated)
- Minimize bundle size
- Lighthouse score: 90+ on mobile

### Optional Features
- Chatbot avatar "Reg" — friendly bubble that offers calm tips
- Easter egg: click breathing animation for mini meditation

---

## 🎯 Implementation Checklist

### Setup (30 min)
- [ ] Initialize Vite + React + TypeScript
- [ ] Install Tailwind CSS + Framer Motion
- [ ] Configure Tailwind with custom colors/fonts
- [ ] Set up Google Fonts (Nunito or equivalent)
- [ ] Create base layout and CSS reset

### Components (90 min)
- [ ] Build Hero section with CTA
- [ ] Create WaveBackground SVG component
- [ ] Build BreathingAnimation component
- [ ] Create WhatItIs section
- [ ] Build HowItWorks (3-step cards)
- [ ] Create WhyItMatters (quote section)
- [ ] Build Audiences (parent/school split)
- [ ] Create CallToAction with email form
- [ ] Build Footer with links

### Polish (30 min)
- [ ] Add scroll-triggered animations (Framer Motion)
- [ ] Implement smooth scroll navigation
- [ ] Add mobile menu if needed
- [ ] Test all breakpoints
- [ ] Add loading states for form
- [ ] Final accessibility check (ARIA labels)
- [ ] Test on iOS/Android

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

---

## 🧪 Testing Checklist

- [ ] All CTAs clickable and lead to correct action
- [ ] Email form validates properly
- [ ] Animations don't cause jank (60fps)
- [ ] Works on Chrome, Safari, Firefox
- [ ] Mobile: iOS Safari, Chrome Android
- [ ] Touch targets are accessible
- [ ] Keyboard navigation works
- [ ] Screen reader announces sections properly
- [ ] Images have alt text
- [ ] No console errors

---

## 🚀 Deployment

### Build Command
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables: none needed (static site)
5. Deploy

### SEO Checklist
- [ ] Add meta description
- [ ] Add Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Set canonical URL

---

## 📊 Success Criteria

- [x] Visually calm and inviting (matches brand palette)
- [x] Clear value proposition in hero
- [x] Mobile-responsive on all devices
- [x] Smooth animations that don't distract
- [x] Email signup functional
- [x] Page loads in < 3s
- [x] Accessible (WCAG AA compliant)
- [x] No layout shift (CLS < 0.1)

---

## 📈 Post-Launch Enhancements

1. **Analytics** — Add Google Analytics / Plausible
2. **A/B Testing** — Test different hero copy
3. **Video** — Add explainer video in "What It Is"
4. **Testimonials** — Real parent quotes with photos
5. **Blog Integration** — Link to wellbeing resources
6. **Multi-language** — Spanish, French, Arabic
7. **Interactive Demo** — Preview breathing exercise
8. **Chatbot** — "Reg" helper bot for questions

---

> **Ready for Claude Code.** Drop this into your project and start building. All sections have clear component boundaries, copy is ready, and design system is defined. Build time: 2-3 hours max for your velocity.
