# Let's Regulate - Brand Style Guide

## Brand Overview
Let's Regulate is a wellbeing toolkit for children that blends mindfulness, breathwork, and creative play. Our brand identity reflects calm, joy, and emotional balance through soft rainbow pastels and gentle, playful design elements.

---

## Color Palette

### Primary Colors - Soft Rainbow Pastels

#### Lavender (Purple)
- **Light**: `#E6D5F5` - Soft backgrounds, subtle accents
- **Default**: `#C4A7E7` - Primary buttons, brand elements
- **Dark**: `#9B7EBD` - Text, borders, high contrast elements
- **Usage**: Primary brand color, buttons, key UI elements

#### Mint (Green)
- **Light**: `#D5F5E6` - Soft backgrounds
- **Default**: `#A8E6CF` - Accents, icons
- **Dark**: `#7BC9A6` - Animations, borders
- **Usage**: Parent-focused sections, growth, calm

#### Peach (Orange)
- **Light**: `#FFE5D9` - Soft backgrounds
- **Default**: `#FFB4A2` - Accents
- **Dark**: `#FF8B7A` - Highlights
- **Usage**: Warm sections, transitions, friendly elements

#### Sky (Blue)
- **Light**: `#D9E8FF` - Soft backgrounds
- **Default**: `#A4CAFE` - Accents, icons
- **Dark**: `#6FA3E0` - Borders, animations
- **Usage**: School-focused sections, trust, clarity

#### Rose (Pink)
- **Light**: `#FFD9E8` - Soft backgrounds
- **Default**: `#FFB3D1` - Accents
- **Dark**: `#FF8BB8` - Love elements, hearts
- **Usage**: Emotional elements, care, warmth

### Neutral Colors

#### Cream
- **Color**: `#F5F5F0`
- **Usage**: Main background, clean canvas

#### Slate
- **Color**: `#6B7280`
- **Usage**: Body text, readable content

---

## Typography

### Font Family
**Primary**: Nunito, Sofia Sans, Quicksand
**Fallback**: system-ui, sans-serif

### Font Weights
- **Regular**: 400 (body text)
- **Semibold**: 600 (headings)
- **Bold**: 700 (emphasized headings)

### Hierarchy
- **H1**: 4xl-7xl (responsive), bold, slate or gradient
- **H2**: 3xl-5xl, bold, slate
- **H3**: 2xl-3xl, semibold, slate
- **Body**: base-xl, regular, slate
- **Small**: sm, regular, slate

---

## Logo

### Wordmark
**Text**: "Let's Regulate"

**Style**: Rainbow gradient text effect
- Gradient: `from-lavender-dark via-sky-dark to-rose-dark`
- Creates a flowing, joyful rainbow across the text

### Logo Mark
- **Background**: Circle with soft pastel gradient
- **Wave Element**: Flowing wave pattern inside circle
- **Usage**: Can be used alone or with wordmark

---

## Design Elements

### Buttons

#### Primary Button
- **Background**: Lavender (`#C4A7E7`)
- **Text**: White
- **Hover**: Darker lavender (`#9B7EBD`)
- **Style**: Rounded-full, 8px horizontal padding, 4px vertical padding
- **Min Size**: 44px x 44px (accessibility)

#### Secondary Button
- **Background**: Transparent
- **Text**: Lavender dark (`#9B7EBD`)
- **Border**: 2px solid lavender (`#C4A7E7`)
- **Hover**: Lavender background with white text
- **Style**: Same as primary

### Cards
- **Background**: White
- **Border Radius**: 2xl (16px)
- **Padding**: 6-8 (responsive)
- **Shadow**: sm on default, md on hover
- **Transition**: Shadow transition 300ms

### Icons
- **Library**: Lucide React
- **Size**: 12px (w-12 h-12) for featured icons
- **Color**: Matches section theme or slate
- **Style**: Rounded, friendly

#### Icon Mapping
- **User Profile**: User icon
- **Feelings/Thoughts**: MessageCircle icon
- **Tools/Gifts**: Gift icon
- **Heart/Love**: Heart icon (filled)
- **Parents/Families**: Users icon
- **Schools/Education**: GraduationCap icon
- **Success/Magic**: Sparkles icon

---

## Section Backgrounds

### Gradient Flows
Each section uses soft gradients to create flow:

1. **Hero**: `from-cream to-lavender-light`
2. **What It Is**: `from-lavender-light to-cream`
3. **How It Works**: Solid `cream`
4. **Why It Matters**: `from-cream to-peach-light`
5. **Audiences**: Solid `cream`
6. **Call to Action**: `from-peach-light to-lavender`
7. **Footer**: Solid `cream`

---

## Animations

### Breathing Animation
- **Purpose**: Calm, meditative movement
- **Duration**: 8s ease-in-out infinite
- **Scale**: 1 → 1.1 → 1
- **Colors**: Theme-appropriate pastels
- **Opacity**: 0.3-0.6

### Floating Bubbles
- **Movement**: Gentle Y-axis float with slight X drift
- **Duration**: 4-6s (randomized)
- **Colors**: Rose-dark or theme color
- **Opacity**: 20-30%
- **Size**: 12px (w-12 h-12)

### Wave Background
- **Animation**: Horizontal drift
- **Duration**: 6s ease-in-out infinite
- **Colors**: Match section theme
- **Opacity**: 30-50%

### Scroll Animations
- **Trigger**: InView with -100px margin
- **Once**: True (animate once on scroll)
- **Effects**:
  - Fade in: opacity 0 → 1
  - Slide up: y 30 → 0
  - Scale: 0.95 → 1
- **Duration**: 0.8s
- **Stagger**: 0.2s between items

---

## Voice & Tone

### Brand Voice
- **Warm**: Caring and supportive
- **Gentle**: Calm and soothing
- **Playful**: Joyful and encouraging
- **Clear**: Simple and accessible
- **Scientific**: Grounded in neuroscience

### Writing Style
- Use simple, accessible language
- Focus on "why" over "what"
- Address both parents and educators
- Emphasize emotional wellbeing and growth
- Include gentle calls-to-action

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Darker color variants for important text
- White text on lavender buttons for contrast

### Interactive Elements
- Minimum touch target: 44px x 44px
- Clear focus states with ring (4px)
- Hover states for all clickable elements
- Keyboard navigation support

### Animation
- Respects prefers-reduced-motion
- Smooth scroll enabled
- Transitions no faster than 300ms

---

## Usage Guidelines

### Do's ✓
- Use soft pastels for backgrounds
- Use darker variants for text and important elements
- Maintain rainbow gradient for special emphasis
- Keep animations gentle and calm
- Use rounded corners throughout
- Include breathing room (whitespace)

### Don'ts ✗
- Don't use harsh, bright colors
- Don't use small text (minimum 14px)
- Don't overuse animations
- Don't mix sharp corners with rounded design
- Don't use emojis (use Lucide icons instead)
- Don't sacrifice readability for aesthetics

---

## File Structure

### Color Definition
Location: `tailwind.config.js`
```javascript
colors: {
  lavender: { light: '#E6D5F5', DEFAULT: '#C4A7E7', dark: '#9B7EBD' },
  mint: { light: '#D5F5E6', DEFAULT: '#A8E6CF', dark: '#7BC9A6' },
  peach: { light: '#FFE5D9', DEFAULT: '#FFB4A2', dark: '#FF8B7A' },
  sky: { light: '#D9E8FF', DEFAULT: '#A4CAFE', dark: '#6FA3E0' },
  rose: { light: '#FFD9E8', DEFAULT: '#FFB3D1', dark: '#FF8BB8' },
  cream: '#F5F5F0',
  slate: '#6B7280',
}
```

### Component Styling
Location: `src/index.css`
- Button classes
- Card classes
- Section container classes

---

## Contact & Support
For questions about brand usage or design decisions, refer to this guide or contact the design team.

**Last Updated**: November 2025
**Version**: 1.0
