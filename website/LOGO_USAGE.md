# Let's Regulate Logo - Usage Guide

## Logo Component

The Let's Regulate logo consists of two main elements:
1. **Icon**: A circle with animated rainbow waves
2. **Wordmark**: "Let's Regulate" in rainbow gradient text

---

## Import

```tsx
import Logo from './components/Logo';
```

---

## Basic Usage

### Full Logo (Icon + Wordmark)
```tsx
<Logo />
```

### Icon Only
```tsx
<Logo showWordmark={false} />
```

### Wordmark Only
```tsx
<Logo showIcon={false} />
```

---

## Size Options

### Small (For headers, footers, compact spaces)
```tsx
<Logo size="small" />
```
- Icon: 40px × 40px
- Text: text-lg (18px)
- Use in: Footer, mobile header, small cards

### Medium (Default - For standard usage)
```tsx
<Logo size="medium" />
```
- Icon: 64px × 64px
- Text: text-2xl (24px)
- Use in: Main navigation, about sections

### Large (For hero sections, landing pages)
```tsx
<Logo size="large" />
```
- Icon: 96px × 96px
- Text: text-4xl (36px)
- Use in: Hero sections, splash screens, marketing materials

---

## Customization

### Add Custom Classes
```tsx
<Logo className="my-custom-class" />
```

### Common Patterns

#### Center Aligned Logo
```tsx
<div className="flex justify-center">
  <Logo size="large" />
</div>
```

#### Clickable Logo (Link to Home)
```tsx
<a href="/" className="inline-block">
  <Logo size="medium" />
</a>
```

#### Logo in Navigation Bar
```tsx
<nav className="flex items-center justify-between p-4">
  <Logo size="small" />
  {/* Navigation items */}
</nav>
```

---

## Logo Icon Details

### Circle Background
- **Gradient**: `from-lavender-light via-sky-light to-peach-light`
- Creates a soft, rainbow pastel background
- Rounded-full (perfect circle)

### Wave Animation
- **Two waves** for depth and movement
- **Animation**: Gentle up/down oscillation (4s and 3s cycles)
- **Colors**: Rainbow gradient from lavender-dark → sky-dark → rose-dark
- **Opacity**: 40-60% for subtle effect
- **Easing**: ease-in-out for smooth, calming motion

### Hover Effect
- Gentle scale to 1.05 (5% larger)
- 300ms smooth transition
- Adds interactivity without being jarring

---

## Wordmark Details

### Text
- **Content**: "Let's Regulate"
- **Font**: Inherits brand font (Nunito)
- **Weight**: Bold (700)

### Rainbow Gradient
- **Gradient**: `from-lavender-dark via-sky-dark to-rose-dark`
- **Effect**: `bg-clip-text text-transparent`
- Creates flowing rainbow effect across text
- Same gradient as "emotional wellbeing" in hero

---

## Usage Examples by Section

### Hero Section
```tsx
<div className="text-center">
  <Logo size="large" className="mb-8" />
  <h2>Your tagline here</h2>
</div>
```

### Navigation Header
```tsx
<header className="fixed top-0 w-full bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <Logo size="small" />
    <nav>{/* menu items */}</nav>
  </div>
</header>
```

### Footer
```tsx
<footer>
  <Logo size="small" className="mb-4" />
  <p>Your footer content</p>
</footer>
```

### Loading Screen
```tsx
<div className="min-h-screen flex items-center justify-center">
  <Logo size="large" />
</div>
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Controls overall logo size |
| `showIcon` | `boolean` | `true` | Whether to show the circular wave icon |
| `showWordmark` | `boolean` | `true` | Whether to show the text |
| `className` | `string` | `''` | Additional CSS classes |

---

## Best Practices

### Do's ✓
- Use appropriate size for context (small for headers, large for heroes)
- Maintain adequate spacing around logo (minimum 16px)
- Use full logo when space allows
- Use icon-only in tight spaces (mobile menus, favicons)
- Let the logo breathe - don't crowd it

### Don'ts ✗
- Don't stretch or distort the logo
- Don't change the gradient colors
- Don't add backgrounds that clash with the circle
- Don't use the logo smaller than 32px (readability)
- Don't overlay text on the icon
- Don't modify the wave animation timing

---

## Accessibility

- Logo has hover state for interactivity feedback
- Animations respect `prefers-reduced-motion`
- Color contrast meets WCAG AA standards
- Wordmark is readable at all sizes
- Icon provides visual brand recognition for non-readers

---

## File Locations

- **Component**: `/src/components/Logo.tsx`
- **Usage in**: Footer (`/src/components/Footer.tsx`)
- **Export**: Can be imported from components folder

---

## Future Enhancements

Potential additions:
- Favicon version (icon only, optimized for small sizes)
- Social media profile images
- Email signature version
- Stationery and print materials
- Animated loading spinner using logo

---

## Questions?

Refer to the main [BRAND_STYLE_GUIDE.md](./BRAND_STYLE_GUIDE.md) for overall brand guidelines and color usage.

**Last Updated**: November 2025
**Version**: 1.0
