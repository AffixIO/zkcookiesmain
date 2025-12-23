# Cookie Consent Bar

A production-ready, GDPR-compliant cookie consent component for React applications with real analytics and marketing integrations.

## Features

- 🔒 **Privacy-first** - All optional cookies blocked until consent
- 📊 **Analytics integration** - Google Analytics 4 support
- 📣 **Marketing integration** - Facebook Pixel, Google Ads support
- ♿ **Accessible** - ARIA labels, keyboard navigation
- 🎨 **Customizable** - Themed with CSS variables
- 💾 **Persistent** - Saves preferences to localStorage
- 🔄 **Version control** - Invalidates old consents when policy changes
- ⚡ **Lightweight** - No external dependencies except React and Lucide icons

## Installation

1. Copy these files to your project:
   - `src/lib/cookie-consent.ts` - Core consent manager
   - `src/hooks/use-cookie-consent.ts` - React hooks
   - `src/components/CookieConsentBar.tsx` - UI component

2. Install dependencies:
   ```bash
   npm install lucide-react
   ```

3. Add environment variables (optional):
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_FB_PIXEL_ID=XXXXXXXXXX
   VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
   ```

## Usage

### Basic Usage

```tsx
import { CookieConsentBar } from "./components/CookieConsentBar";

function App() {
  return (
    <div>
      <YourApp />
      <CookieConsentBar />
    </div>
  );
}
```

### With Props

```tsx
<CookieConsentBar 
  privacyPolicyUrl="/privacy"
  cookiePolicyUrl="/cookies"
  onConsentGiven={(preferences) => {
    console.log("User consented:", preferences);
  }}
/>
```

### Using Hooks

```tsx
import { useCookieConsent, useConsentFor } from "./hooks/use-cookie-consent";

function MyComponent() {
  const { preferences, hasConsent, reset } = useCookieConsent();
  const hasAnalyticsConsent = useConsentFor("analytics");

  // Conditionally load analytics
  useEffect(() => {
    if (hasAnalyticsConsent) {
      // Safe to track
      trackEvent("page_view");
    }
  }, [hasAnalyticsConsent]);

  return (
    <button onClick={reset}>Reset Cookie Preferences</button>
  );
}
```

### Programmatic API

```tsx
import { 
  hasConsentFor, 
  saveConsent, 
  resetConsent,
  onConsentChange 
} from "./lib/cookie-consent";

// Check consent
if (hasConsentFor("analytics")) {
  gtag("event", "purchase", { value: 100 });
}

// Listen for changes
const unsubscribe = onConsentChange((data) => {
  console.log("Consent updated:", data.preferences);
});

// Reset consent
resetConsent();
```

## Cookie Categories

| Category | Description | Required |
|----------|-------------|----------|
| Essential | Core functionality, security | Yes |
| Analytics | Usage tracking (GA4) | No |
| Functional | Preferences, settings | No |
| Marketing | Ads, retargeting (FB Pixel) | No |

## Styling

The component uses CSS variables. Customize by updating your CSS:

```css
:root {
  --primary: 175 100% 50%;
  --neon-green: 145 100% 50%;
  --card: 220 20% 8%;
  --border: 180 30% 20%;
  /* ... */
}
```

## Adding New Integrations

Edit `src/lib/cookie-consent.ts` and add to the appropriate function:

```typescript
const initializeAnalytics = (): void => {
  // Add your analytics script here
  const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID;
  if (HOTJAR_ID) {
    // Initialize Hotjar
  }
};
```

## License

MIT
