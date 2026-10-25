// Cookie consent persisted in localStorage. Non-essential cookies (preferences,
// analytics) must only load after an explicit "accept". The footer "Cookie
// settings" link reopens the banner via a custom window event.

export type Consent = 'accepted' | 'rejected';

const STORAGE_KEY = 'pk-cookie-consent';
const OPEN_EVENT = 'pk:open-cookie-settings';

export function getConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'accepted' || v === 'rejected' ? v : null;
}

export function setConsent(value: Consent): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, value);
  if (value === 'accepted') {
    loadAnalytics();
  }
}

// Placeholder: wire real analytics here. Only ever called after consent.
export function loadAnalytics(): void {
  if (typeof window === 'undefined') return;
  // No analytics provider is configured yet. Intentionally a no-op so that
  // nothing is loaded unless/until the user accepts.
}

export function openCookieSettings(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export function onOpenCookieSettings(handler: () => void): () => void {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
