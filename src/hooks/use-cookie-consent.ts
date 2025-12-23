import { useState, useEffect, useCallback } from "react";
import { 
  CookiePreferences, 
  getConsent, 
  saveConsent, 
  hasConsent as checkHasConsent,
  hasConsentFor,
  resetConsent,
  getDefaultPreferences,
  onConsentChange,
  ConsentData,
  getCategories,
  getTheme,
} from "@/lib/cookie-consent";

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(getDefaultPreferences());
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent) {
      setPreferences(consent.preferences);
      setHasConsent(true);
    }
    setIsLoaded(true);

    const unsubscribe = onConsentChange((data: ConsentData) => {
      setPreferences(data.preferences);
      setHasConsent(true);
    });

    return unsubscribe;
  }, []);

  const updatePreferences = useCallback((newPreferences: CookiePreferences) => {
    saveConsent(newPreferences);
    setPreferences(newPreferences);
    setHasConsent(true);
  }, []);

  const acceptAll = useCallback(() => {
    const cats = getCategories();
    const allAccepted = cats.reduce((acc, cat) => {
      acc[cat.key] = true;
      return acc;
    }, {} as CookiePreferences);
    updatePreferences(allAccepted);
  }, [updatePreferences]);

  const declineOptional = useCallback(() => {
    const cats = getCategories();
    const essentialOnly = cats.reduce((acc, cat) => {
      acc[cat.key] = cat.required;
      return acc;
    }, {} as CookiePreferences);
    updatePreferences(essentialOnly);
  }, [updatePreferences]);

  const reset = useCallback(() => {
    resetConsent();
    setPreferences(getDefaultPreferences());
    setHasConsent(false);
  }, []);

  return {
    preferences,
    hasConsent,
    isLoaded,
    updatePreferences,
    acceptAll,
    declineOptional,
    resetConsent: reset,
    hasConsentFor,
    categories: getCategories(),
    theme: getTheme(),
  };
};

export const useConsentFor = (category: keyof CookiePreferences): boolean => {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(hasConsentFor(category));

    const unsubscribe = onConsentChange((data: ConsentData) => {
      setGranted(data.preferences[category]);
    });

    return unsubscribe;
  }, [category]);

  return granted;
};

export { getDefaultPreferences };
