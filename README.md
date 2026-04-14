
# ZK Cookies Main

> Privacy-First GDPR Cookie Management with Zero-Knowledge Proofs and Stateless Authentication

A production-ready, stateless cookie consent management system that combines privacy-preserving technologies with zero-knowledge proof authentication. Built by AffixIO for developers who prioritize user privacy and regulatory compliance.

---

## Overview

ZK Cookies Main is a modern approach to GDPR-compliant cookie management that goes beyond traditional consent banners. It integrates:

- **Zero-Knowledge Proofs (ZKP)**: Verify user consent without storing sensitive data
- **Stateless Authentication**: AffixIO's patent-pending stateless cryptographic architecture
- **Privacy-First Design**: All optional cookies blocked until explicit user consent
- **Analytics Integration**: GA4, Facebook Pixel, Google Ads with consent verification
- **Accessibility**: Full ARIA compliance with keyboard navigation support
- **Customizable Theming**: Dark mode support and CSS variable customization
- **Persistent Storage**: Smart localStorage with version control
- **Lightweight**: Approximately 15KB minified, minimal external dependencies

Ideal for SaaS platforms, European businesses, and organizations committed to privacy compliance.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **ZK Verification** | Verify cookie consent without exposing user data |
| **GDPR Compliant** | Full EU Cookie Law and GDPR compliance out-of-the-box |
| **Privacy-First** | All non-essential cookies blocked by default |
| **Version Control** | Automatically invalidate consent when policies change |
| **Analytics Integration** | Native GA4, Facebook Pixel, and Google Ads support |
| **Accessibility** | WCAG 2.1 AA compliant with full keyboard support |
| **Themeable** | Fully customizable with CSS variables |
| **Stateless** | Works offline, no backend required (patent-pending) |
| **Extensible** | Easy to add new analytics providers |
| **Responsive** | Mobile-first design, works across all devices |

---

## Quick Start

### Installation

```bash
# Copy component files to your project
cp -r src/lib src/hooks src/components/CookieConsentBar.tsx your-project/

# Install peer dependencies
npm install lucide-react
