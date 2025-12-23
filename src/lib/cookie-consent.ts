// Cookie Consent Manager - Production Ready
// Fully customizable with theme support and all common integrations

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  performance: boolean;
  personalization: boolean;
}

export interface ConsentData {
  preferences: CookiePreferences;
  timestamp: number;
  version: string;
}

export interface CookieCategory {
  key: keyof CookiePreferences;
  label: string;
  description: string;
  required: boolean;
}

export interface CookieConsentTheme {
  position: 'bottom' | 'top' | 'bottom-left' | 'bottom-right' | 'center';
  variant: 'default' | 'minimal' | 'floating' | 'banner';
  colorScheme: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  accentColor?: string;
  borderRadius?: string;
  showIcon?: boolean;
  showBadge?: boolean;
  animation?: 'slide' | 'fade' | 'none';
}

export interface CookieConsentConfig {
  storageKey?: string;
  consentVersion?: string;
  expireDays?: number;
  theme?: Partial<CookieConsentTheme>;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
  categories?: CookieCategory[];
  integrations?: {
    googleAnalytics?: string;
    googleTagManager?: string;
    googleAds?: string;
    facebookPixel?: string;
    hotjar?: string;
    clarity?: string;
    segment?: string;
    mixpanel?: string;
    amplitude?: string;
    hubspot?: string;
    intercom?: string;
    crisp?: string;
    tiktokPixel?: string;
    linkedinInsight?: string;
    pinterestTag?: string;
    snapchatPixel?: string;
    twitter?: string;
  };
  onConsentGiven?: (preferences: CookiePreferences) => void;
  onConsentRevoked?: () => void;
}

// Default categories with descriptions
export const defaultCategories: CookieCategory[] = [
  {
    key: "essential",
    label: "Essential",
    description: "Required for core functionality like security, network management, and accessibility. Cannot be disabled.",
    required: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    required: false,
  },
  {
    key: "functional",
    label: "Functional",
    description: "Enable enhanced functionality and personalization like live chats, videos, and remembering your preferences.",
    required: false,
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Used to track visitors across websites to display relevant ads and measure campaign effectiveness.",
    required: false,
  },
  {
    key: "performance",
    label: "Performance",
    description: "Collect information about how you use our website to improve performance and user experience.",
    required: false,
  },
  {
    key: "personalization",
    label: "Personalization",
    description: "Allow the website to remember choices you make and provide enhanced, personalized features.",
    required: false,
  },
];

const DEFAULT_STORAGE_KEY = "cookie-consent";
const DEFAULT_VERSION = "1.0";

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
  performance: false,
  personalization: false,
};

const defaultTheme: CookieConsentTheme = {
  position: 'bottom',
  variant: 'default',
  colorScheme: 'auto',
  showIcon: true,
  showBadge: true,
  animation: 'slide',
  borderRadius: '0.75rem',
};

let config: CookieConsentConfig = {};

// Initialize configuration
export const initCookieConsent = (userConfig: CookieConsentConfig): void => {
  config = { ...userConfig };
};

// Get current config
export const getConfig = (): CookieConsentConfig => config;

// Get theme with defaults
export const getTheme = (): CookieConsentTheme => ({
  ...defaultTheme,
  ...config.theme,
});

// Get categories
export const getCategories = (): CookieCategory[] => {
  return config.categories || defaultCategories;
};

// Get consent data from localStorage
export const getConsent = (): ConsentData | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const storageKey = config.storageKey || DEFAULT_STORAGE_KEY;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return null;
    
    const data = JSON.parse(stored) as ConsentData;
    const version = config.consentVersion || DEFAULT_VERSION;
    
    if (data.version !== version) {
      localStorage.removeItem(storageKey);
      return null;
    }
    
    // Check expiration
    if (config.expireDays) {
      const expireMs = config.expireDays * 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > expireMs) {
        localStorage.removeItem(storageKey);
        return null;
      }
    }
    
    return data;
  } catch {
    return null;
  }
};

// Save consent
export const saveConsent = (preferences: CookiePreferences): void => {
  if (typeof window === "undefined") return;
  
  const storageKey = config.storageKey || DEFAULT_STORAGE_KEY;
  const version = config.consentVersion || DEFAULT_VERSION;
  
  const data: ConsentData = {
    preferences,
    timestamp: Date.now(),
    version,
  };
  
  localStorage.setItem(storageKey, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("cookieConsentUpdate", { detail: data }));
  
  initializeIntegrations(preferences);
  config.onConsentGiven?.(preferences);
};

// Check if user has given consent
export const hasConsent = (): boolean => getConsent() !== null;

// Check consent for specific category
export const hasConsentFor = (category: keyof CookiePreferences): boolean => {
  const consent = getConsent();
  return consent?.preferences[category] === true;
};

// Reset consent
export const resetConsent = (): void => {
  if (typeof window === "undefined") return;
  const storageKey = config.storageKey || DEFAULT_STORAGE_KEY;
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new CustomEvent("cookieConsentReset"));
  config.onConsentRevoked?.();
};

// Get default preferences
export const getDefaultPreferences = (): CookiePreferences => ({ ...defaultPreferences });

// ============= INTEGRATIONS =============

const initializeIntegrations = (preferences: CookiePreferences): void => {
  const integrations = config.integrations || {};
  
  // Analytics integrations
  if (preferences.analytics) {
    if (integrations.googleAnalytics) initGoogleAnalytics(integrations.googleAnalytics);
    if (integrations.googleTagManager) initGoogleTagManager(integrations.googleTagManager);
    if (integrations.segment) initSegment(integrations.segment);
    if (integrations.mixpanel) initMixpanel(integrations.mixpanel);
    if (integrations.amplitude) initAmplitude(integrations.amplitude);
  }
  
  // Marketing integrations
  if (preferences.marketing) {
    if (integrations.googleAds) initGoogleAds(integrations.googleAds);
    if (integrations.facebookPixel) initFacebookPixel(integrations.facebookPixel);
    if (integrations.tiktokPixel) initTiktokPixel(integrations.tiktokPixel);
    if (integrations.linkedinInsight) initLinkedinInsight(integrations.linkedinInsight);
    if (integrations.pinterestTag) initPinterestTag(integrations.pinterestTag);
    if (integrations.snapchatPixel) initSnapchatPixel(integrations.snapchatPixel);
    if (integrations.twitter) initTwitterPixel(integrations.twitter);
  }
  
  // Performance integrations
  if (preferences.performance) {
    if (integrations.hotjar) initHotjar(integrations.hotjar);
    if (integrations.clarity) initClarity(integrations.clarity);
  }
  
  // Functional integrations
  if (preferences.functional) {
    if (integrations.hubspot) initHubspot(integrations.hubspot);
    if (integrations.intercom) initIntercom(integrations.intercom);
    if (integrations.crisp) initCrisp(integrations.crisp);
  }
};

// Google Analytics 4
const initGoogleAnalytics = (measurementId: string): void => {
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) return;
  
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) { window.dataLayer.push(args); }
  gtag("js", new Date());
  gtag("config", measurementId);
  window.gtag = gtag;
  
  console.log("[Cookie Consent] Google Analytics initialized");
};

// Google Tag Manager
const initGoogleTagManager = (containerId: string): void => {
  if (document.querySelector(`script[src*="googletagmanager.com/gtm"]`)) return;
  
  (function(w: Window, d: Document, s: string, l: string, i: string) {
    (w as typeof w & { dataLayer: unknown[] }).dataLayer = (w as typeof w & { dataLayer: unknown[] }).dataLayer || [];
    (w as typeof w & { dataLayer: unknown[] }).dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode?.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', containerId);
  
  console.log("[Cookie Consent] Google Tag Manager initialized");
};

// Google Ads
const initGoogleAds = (conversionId: string): void => {
  if (window.gtag) {
    window.gtag("config", conversionId);
    console.log("[Cookie Consent] Google Ads initialized");
  }
};

// Facebook Pixel
const initFacebookPixel = (pixelId: string): void => {
  if (window.fbq) return;
  
  (function(f: Window, b: Document, e: string, v: string) {
    const n = function(...args: unknown[]) {
      (n as typeof n & { callMethod?: (...a: unknown[]) => void; queue: unknown[] }).callMethod 
        ? (n as typeof n & { callMethod: (...a: unknown[]) => void }).callMethod(...args)
        : (n as typeof n & { queue: unknown[] }).queue.push(args);
    };
    (n as typeof n & { queue: unknown[] }).queue = [];
    (n as typeof n & { loaded: boolean }).loaded = true;
    (n as typeof n & { version: string }).version = "2.0";
    (f as typeof f & { fbq: typeof n }).fbq = n;
    
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  
  window.fbq?.("init", pixelId);
  window.fbq?.("track", "PageView");
  
  console.log("[Cookie Consent] Facebook Pixel initialized");
};

// Hotjar
const initHotjar = (hjid: string): void => {
  if ((window as typeof window & { hj?: unknown }).hj) return;
  
  (function(h: Window, o: Document, t: string, j: string) {
    (h as typeof h & { hj: (...args: unknown[]) => void }).hj = function(...args: unknown[]) {
      ((h as typeof h & { hj: { q: unknown[] } }).hj.q = (h as typeof h & { hj: { q: unknown[] } }).hj.q || []).push(args);
    };
    (h as typeof h & { _hjSettings: { hjid: number; hjsv: number } })._hjSettings = { hjid: parseInt(hjid), hjsv: 6 };
    const a = o.getElementsByTagName('head')[0];
    const r = o.createElement('script') as HTMLScriptElement;
    r.async = true;
    r.src = t + (h as typeof h & { _hjSettings: { hjid: number; hjsv: number } })._hjSettings.hjid + j + (h as typeof h & { _hjSettings: { hjid: number; hjsv: number } })._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  
  console.log("[Cookie Consent] Hotjar initialized");
};

// Microsoft Clarity
const initClarity = (projectId: string): void => {
  if ((window as Window & { clarity?: unknown }).clarity) return;
  
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
  
  console.log("[Cookie Consent] Microsoft Clarity initialized");
};

// Segment
const initSegment = (writeKey: string): void => {
  if ((window as Window & { analytics?: unknown }).analytics) return;
  
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://cdn.segment.com/analytics.js/v1/' + writeKey + '/analytics.min.js';
  document.head.appendChild(script);
  
  console.log("[Cookie Consent] Segment initialized");
};

// Mixpanel
const initMixpanel = (token: string): void => {
  if ((window as typeof window & { mixpanel?: unknown }).mixpanel) return;
  
  (function(f: Document, b: string) {
    const e = f.createElement(b) as HTMLScriptElement;
    e.type = 'text/javascript';
    e.async = true;
    e.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
    const g = f.getElementsByTagName(b)[0];
    g.parentNode?.insertBefore(e, g);
  })(document, 'script');
  
  setTimeout(() => {
    (window as typeof window & { mixpanel?: { init: (t: string) => void } }).mixpanel?.init(token);
  }, 500);
  
  console.log("[Cookie Consent] Mixpanel initialized");
};

// Amplitude
const initAmplitude = (apiKey: string): void => {
  if ((window as typeof window & { amplitude?: unknown }).amplitude) return;
  
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://cdn.amplitude.com/libs/amplitude-8.21.9-min.gz.js';
  document.head.appendChild(script);
  
  script.onload = () => {
    (window as typeof window & { amplitude?: { init: (k: string) => void } }).amplitude?.init(apiKey);
  };
  
  console.log("[Cookie Consent] Amplitude initialized");
};

// HubSpot
const initHubspot = (hubId: string): void => {
  if (document.querySelector(`script[src*="js.hs-scripts.com"]`)) return;
  
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'hs-script-loader';
  script.async = true;
  script.defer = true;
  script.src = `https://js.hs-scripts.com/${hubId}.js`;
  document.body.appendChild(script);
  
  console.log("[Cookie Consent] HubSpot initialized");
};

// Intercom
const initIntercom = (appId: string): void => {
  if ((window as typeof window & { Intercom?: unknown }).Intercom) return;
  
  (window as typeof window & { intercomSettings: { app_id: string } }).intercomSettings = { app_id: appId };
  
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://widget.intercom.io/widget/${appId}`;
  const x = document.getElementsByTagName('script')[0];
  x.parentNode?.insertBefore(script, x);
  
  console.log("[Cookie Consent] Intercom initialized");
};

// Crisp
const initCrisp = (websiteId: string): void => {
  if ((window as typeof window & { $crisp?: unknown }).$crisp) return;
  
  (window as typeof window & { $crisp: unknown[]; CRISP_WEBSITE_ID: string }).$crisp = [];
  (window as typeof window & { CRISP_WEBSITE_ID: string }).CRISP_WEBSITE_ID = websiteId;
  
  const d = document;
  const s = d.createElement('script');
  s.src = 'https://client.crisp.chat/l.js';
  s.async = true;
  d.getElementsByTagName('head')[0].appendChild(s);
  
  console.log("[Cookie Consent] Crisp initialized");
};

// TikTok Pixel
const initTiktokPixel = (pixelId: string): void => {
  if ((window as typeof window & { ttq?: unknown }).ttq) return;
  
  (function(w: Window, d: Document, t: string) {
    (w as typeof w & { TiktokAnalyticsObject: string }).TiktokAnalyticsObject = t;
    const ttq = (w as typeof w & { ttq: unknown[] })[t] = (w as typeof w & { ttq: unknown[] })[t] || [];
    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
    ttq.setAndDefer = function(t: { [key: string]: (...args: unknown[]) => unknown }, e: string) {
      t[e] = function(...args: unknown[]) { t.push([e, ...args]); };
    };
    for (let i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }
    ttq.instance = function(t: string) {
      const e = ttq._i[t] || [];
      for (let n = 0; n < ttq.methods.length; n++) {
        ttq.setAndDefer(e, ttq.methods[n]);
      }
      return e;
    };
    ttq.load = function(e: string, n?: unknown) {
      const i = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      const o = d.createElement("script");
      (o as HTMLScriptElement).type = "text/javascript";
      (o as HTMLScriptElement).async = true;
      (o as HTMLScriptElement).src = i + "?sdkid=" + e + "&lib=" + t;
      const a = d.getElementsByTagName("script")[0];
      a.parentNode?.insertBefore(o, a);
    };
    ttq.load(pixelId);
    ttq.page();
  })(window, document, 'ttq');
  
  console.log("[Cookie Consent] TikTok Pixel initialized");
};

// LinkedIn Insight Tag
const initLinkedinInsight = (partnerId: string): void => {
  if ((window as typeof window & { _linkedin_data_partner_ids?: unknown })._linkedin_data_partner_ids) return;
  
  (window as typeof window & { _linkedin_data_partner_ids: string[] })._linkedin_data_partner_ids = (window as typeof window & { _linkedin_data_partner_ids: string[] })._linkedin_data_partner_ids || [];
  (window as typeof window & { _linkedin_data_partner_ids: string[] })._linkedin_data_partner_ids.push(partnerId);
  
  (function(l: Window) {
    if (!(l as typeof l & { lintrk?: unknown }).lintrk) {
      (l as typeof l & { lintrk: (...args: unknown[]) => void }).lintrk = function(...args: unknown[]) {
        ((l as typeof l & { lintrk: { q: unknown[] } }).lintrk.q = (l as typeof l & { lintrk: { q: unknown[] } }).lintrk.q || []).push(args);
      };
      (l as typeof l & { lintrk: { _q: unknown[] } }).lintrk._q = [];
    }
    const s = document.getElementsByTagName('script')[0];
    const b = document.createElement('script');
    b.type = 'text/javascript';
    b.async = true;
    b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    s.parentNode?.insertBefore(b, s);
  })(window);
  
  console.log("[Cookie Consent] LinkedIn Insight Tag initialized");
};

// Pinterest Tag
const initPinterestTag = (tagId: string): void => {
  if ((window as typeof window & { pintrk?: unknown }).pintrk) return;
  
  (function(e: Window) {
    if (!(e as typeof e & { pintrk?: unknown }).pintrk) {
      const n = (e as typeof e & { pintrk: (...args: unknown[]) => void }).pintrk = function(...args: unknown[]) {
        (n as typeof n & { queue: unknown[] }).queue.push(args);
      };
      (n as typeof n & { queue: unknown[] }).queue = [];
      (n as typeof n & { version: string }).version = "3.0";
      const t = document.createElement("script");
      t.async = true;
      t.src = "https://s.pinimg.com/ct/core.js";
      const r = document.getElementsByTagName("script")[0];
      r.parentNode?.insertBefore(t, r);
    }
  })(window);
  
  (window as typeof window & { pintrk?: (...args: unknown[]) => void }).pintrk?.('load', tagId);
  (window as typeof window & { pintrk?: (...args: unknown[]) => void }).pintrk?.('page');
  
  console.log("[Cookie Consent] Pinterest Tag initialized");
};

// Snapchat Pixel
const initSnapchatPixel = (pixelId: string): void => {
  if ((window as typeof window & { snaptr?: unknown }).snaptr) return;
  
  (function(e: Window, t: Document, n: string) {
    if ((e as typeof e & { snaptr?: unknown }).snaptr) return;
    const a = (e as typeof e & { snaptr: (...args: unknown[]) => void }).snaptr = function(...args: unknown[]) {
      (a as typeof a & { handleRequest?: (...a: unknown[]) => void }).handleRequest
        ? (a as typeof a & { handleRequest: (...a: unknown[]) => void }).handleRequest(...args)
        : (a as typeof a & { queue: unknown[] }).queue.push(args);
    };
    (a as typeof a & { queue: unknown[] }).queue = [];
    const s = 'script';
    const r = t.createElement(s) as HTMLScriptElement;
    r.async = true;
    r.src = n;
    const u = t.getElementsByTagName(s)[0];
    u.parentNode?.insertBefore(r, u);
  })(window, document, 'https://sc-static.net/scevent.min.js');
  
  (window as typeof window & { snaptr?: (...args: unknown[]) => void }).snaptr?.('init', pixelId);
  (window as typeof window & { snaptr?: (...args: unknown[]) => void }).snaptr?.('track', 'PAGE_VIEW');
  
  console.log("[Cookie Consent] Snapchat Pixel initialized");
};

// Twitter Pixel
const initTwitterPixel = (pixelId: string): void => {
  if ((window as typeof window & { twq?: unknown }).twq) return;
  
  (function(e: Window, t: Document, n: string, s: string, a?: unknown) {
    if ((e as typeof e & { twq?: unknown }).twq) return;
    (e as typeof e & { twq: (...args: unknown[]) => unknown }).twq = function(...args: unknown[]) {
      (e as typeof e & { twq: { exe?: (...a: unknown[]) => unknown; queue: unknown[] } }).twq.exe
        ? (e as typeof e & { twq: { exe: (...a: unknown[]) => unknown } }).twq.exe(...args)
        : (e as typeof e & { twq: { queue: unknown[] } }).twq.queue.push(args);
    };
    (e as typeof e & { twq: { version: string; queue: unknown[] } }).twq.version = '1.1';
    (e as typeof e & { twq: { queue: unknown[] } }).twq.queue = [];
    const r = t.createElement(n) as HTMLScriptElement;
    r.async = true;
    r.src = s;
    const i = t.getElementsByTagName(n)[0];
    i.parentNode?.insertBefore(r, i);
  })(window, document, 'script', 'https://static.ads-twitter.com/uwt.js');
  
  (window as typeof window & { twq?: (...args: unknown[]) => void }).twq?.('config', pixelId);
  
  console.log("[Cookie Consent] Twitter Pixel initialized");
};

// Event listener
export const onConsentChange = (callback: (data: ConsentData) => void): (() => void) => {
  const handler = (event: Event) => callback((event as CustomEvent<ConsentData>).detail);
  window.addEventListener("cookieConsentUpdate", handler);
  return () => window.removeEventListener("cookieConsentUpdate", handler);
};

// Declare global types
declare global {
  interface Window {
    dataLayer: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}
