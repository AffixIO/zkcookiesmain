import { CookieConsentBar } from "@/components/CookieConsentBar";
import { useCookieConsent, useConsentFor } from "@/hooks/use-cookie-consent";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { preferences, hasConsent, resetConsent } = useCookieConsent();
  const hasAnalytics = useConsentFor("analytics");
  const hasMarketing = useConsentFor("marketing");

  return (
    <main className="min-h-screen bg-background bg-noise flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Cookie Consent Bar</h1>
          <p className="text-muted-foreground">Production-ready with analytics & marketing integration</p>
        </div>

        {/* Status Panel */}
        <div className="bg-card/50 border border-border rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Consent Status</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Consent Given</span>
              <span className={`text-sm font-mono ${hasConsent ? "text-neon-green" : "text-neon-amber"}`}>
                {hasConsent ? "Yes" : "No"}
              </span>
            </div>
            
            <div className="border-t border-border/50 pt-3 space-y-2">
              {(["essential", "analytics", "functional", "marketing"] as const).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    {preferences[key] ? (
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive/60" />
                    )}
                    <span className={`text-sm font-mono ${preferences[key] ? "text-neon-green" : "text-muted-foreground"}`}>
                      {preferences[key] ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-card/50 border border-border rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Integration Status</h2>
          
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Google Analytics</span>
              <span className={hasAnalytics ? "text-neon-green" : "text-muted-foreground"}>
                {hasAnalytics ? "LOADED" : "BLOCKED"}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Facebook Pixel</span>
              <span className={hasMarketing ? "text-neon-green" : "text-muted-foreground"}>
                {hasMarketing ? "LOADED" : "BLOCKED"}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Google Ads</span>
              <span className={hasMarketing ? "text-neon-green" : "text-muted-foreground"}>
                {hasMarketing ? "LOADED" : "BLOCKED"}
              </span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" className="w-full" onClick={resetConsent}>
          <RotateCcw className="w-4 h-4" />
          Reset Consent & Show Banner
        </Button>

        {/* Usage Info */}
        <div className="mt-6 p-4 bg-secondary/20 rounded-lg text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-2">Environment Variables:</p>
          <code className="block">VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX</code>
          <code className="block">VITE_FB_PIXEL_ID=XXXXXXXXXX</code>
          <code className="block">VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX</code>
        </div>
      </div>

      <CookieConsentBar 
        privacyPolicyUrl="/privacy"
        cookiePolicyUrl="/cookies"
        onConsentGiven={(prefs) => {
          console.log("[Demo] Consent given:", prefs);
        }}
      />
    </main>
  );
};

export default Index;
