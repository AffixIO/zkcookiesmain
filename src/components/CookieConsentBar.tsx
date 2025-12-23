import { useState, useEffect } from "react";
import { Cookie, Shield, Settings, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { CookiePreferences, getDefaultPreferences, CookieConsentTheme, CookieCategory } from "@/lib/cookie-consent";

interface CookieConsentBarProps {
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
  onConsentGiven?: (preferences: CookiePreferences) => void;
  // Theme overrides
  theme?: Partial<CookieConsentTheme>;
  // Custom categories override
  categories?: CookieCategory[];
  // Text customization
  texts?: {
    title?: string;
    description?: string;
    acceptAll?: string;
    declineOptional?: string;
    savePreferences?: string;
    customizeLabel?: string;
    privacyLabel?: string;
    cookiePolicyLabel?: string;
    secureLabel?: string;
    footerMessage?: string;
  };
}

const defaultTexts = {
  title: "Cookie Preferences",
  description: "We use cookies to enhance your browsing experience and analyze site traffic.",
  acceptAll: "Accept All",
  declineOptional: "Essential Only",
  savePreferences: "Save Preferences",
  customizeLabel: "Customize preferences",
  privacyLabel: "Privacy Policy",
  cookiePolicyLabel: "Cookie Policy",
  secureLabel: "Secure",
  footerMessage: "Your privacy matters",
};

export const CookieConsentBar = ({
  privacyPolicyUrl = "/privacy",
  cookiePolicyUrl = "/cookies",
  onConsentGiven,
  theme: themeOverride,
  categories: categoriesOverride,
  texts: textsOverride,
}: CookieConsentBarProps) => {
  const { hasConsent, isLoaded, acceptAll, declineOptional, updatePreferences, categories: defaultCategories, theme: defaultTheme } = useCookieConsent();
  
  const theme = { ...defaultTheme, ...themeOverride };
  const categories = categoriesOverride || defaultCategories;
  const texts = { ...defaultTexts, ...textsOverride };
  
  const [showDetails, setShowDetails] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(() => {
    return getDefaultPreferences();
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoaded && !hasConsent) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasConsent]);

  const handleAcceptAll = () => {
    setIsAnimating(true);
    acceptAll();
    const allAccepted = categories.reduce((acc, cat) => {
      acc[cat.key] = true;
      return acc;
    }, {} as CookiePreferences);
    onConsentGiven?.(allAccepted);
    setTimeout(() => setIsVisible(false), 400);
  };

  const handleDeclineOptional = () => {
    setIsAnimating(true);
    declineOptional();
    const essentialOnly = categories.reduce((acc, cat) => {
      acc[cat.key] = cat.required;
      return acc;
    }, {} as CookiePreferences);
    onConsentGiven?.(essentialOnly);
    setTimeout(() => setIsVisible(false), 400);
  };

  const handleSavePreferences = () => {
    setIsAnimating(true);
    updatePreferences(localPreferences);
    onConsentGiven?.(localPreferences);
    setTimeout(() => setIsVisible(false), 400);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    const category = categories.find(c => c.key === key);
    if (category?.required) return;
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible || hasConsent) return null;

  // Position classes
  const positionClasses = {
    'bottom': 'bottom-0 left-0 right-0',
    'top': 'top-0 left-0 right-0',
    'bottom-left': 'bottom-4 left-4 max-w-md',
    'bottom-right': 'bottom-4 right-4 max-w-md',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg',
  };

  // Animation classes
  const animationClasses = {
    'slide': isAnimating 
      ? (theme.position === 'top' ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0')
      : 'translate-y-0 opacity-100',
    'fade': isAnimating ? 'opacity-0' : 'opacity-100',
    'none': '',
  };

  const positionClass = positionClasses[theme.position || 'bottom'];
  const animationClass = animationClasses[theme.animation || 'slide'];

  return (
    <div
      className={`fixed z-50 p-4 md:p-6 transition-all duration-500 ${positionClass} ${animationClass}`}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className={theme.position === 'bottom' || theme.position === 'top' ? 'max-w-4xl mx-auto' : ''}>
        <div 
          className="relative bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden"
          style={{ borderRadius: theme.borderRadius }}
        >
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <div className="relative p-5 md:p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              {theme.showIcon && (
                <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/30 shrink-0">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 id="cookie-consent-title" className="text-lg font-semibold text-foreground">
                    {texts.title}
                  </h3>
                  {theme.showBadge && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neon-green/10 border border-neon-green/30 rounded-full">
                      <Shield className="w-3 h-3 text-neon-green" />
                      <span className="text-xs font-mono text-neon-green">{texts.secureLabel}</span>
                    </div>
                  )}
                </div>
                <p id="cookie-consent-description" className="text-sm text-muted-foreground">
                  {texts.description}{" "}
                  <a href={privacyPolicyUrl} className="text-primary hover:underline">
                    {texts.privacyLabel}
                  </a>
                  {" • "}
                  <a href={cookiePolicyUrl} className="text-primary hover:underline">
                    {texts.cookiePolicyLabel}
                  </a>
                </p>
              </div>
            </div>

            {/* Expandable Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
              aria-expanded={showDetails}
              aria-controls="cookie-preferences-panel"
            >
              <Settings className="w-4 h-4" />
              <span>{texts.customizeLabel}</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetails && (
              <div
                id="cookie-preferences-panel"
                className="mb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                {categories.map((type) => (
                  <div
                    key={type.key}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      localPreferences[type.key]
                        ? "bg-primary/5 border-primary/30"
                        : "bg-secondary/30 border-border/50"
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{type.label}</span>
                        {type.required && (
                          <span className="text-xs text-muted-foreground">(Required)</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                    </div>
                    <button
                      onClick={() => togglePreference(type.key)}
                      disabled={type.required}
                      aria-label={`${localPreferences[type.key] ? "Disable" : "Enable"} ${type.label} cookies`}
                      aria-checked={localPreferences[type.key]}
                      role="switch"
                      className={`relative w-12 h-6 rounded-full transition-all shrink-0 ${
                        localPreferences[type.key]
                          ? "bg-primary shadow-neon-sm"
                          : "bg-secondary"
                      } ${type.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-all ${
                          localPreferences[type.key] ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclineOptional}
                className="flex-1 sm:flex-none"
              >
                <X className="w-4 h-4" />
                {texts.declineOptional}
              </Button>

              {showDetails ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSavePreferences}
                  className="flex-1 sm:flex-none"
                >
                  <Check className="w-4 h-4" />
                  {texts.savePreferences}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none"
                >
                  <Check className="w-4 h-4" />
                  {texts.acceptAll}
                </Button>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  {texts.footerMessage}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
