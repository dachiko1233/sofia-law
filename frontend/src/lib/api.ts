// Thin API client for the Gin backend. In dev, Vite proxies /api → :8080.
// In production the same origin serves both the SPA and the API.

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  consent: boolean;
  /** UI language the enquiry was submitted from (en/gr/ru). */
  language: string;
  /** Honeypot — must stay empty for real users. */
  company?: string;
}

export interface NewsletterPayload {
  email: string;
  /** Honeypot — must stay empty for real users. */
  company?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError('network', 0);
  }

  if (!res.ok) {
    let message = 'request_failed';
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new ApiError(message, res.status);
  }

  return (await res.json()) as T;
}

// Base URL for the API. In dev this is empty, so calls hit Vite's /api proxy
// (same origin). In production, where the SPA and API are separate Railway
// services, set VITE_API_BASE to the backend's URL (no trailing slash).
const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');

export function submitContact(payload: ContactPayload): Promise<{ status: string }> {
  return postJSON(`${API_BASE}/api/contact`, payload);
}

export function submitNewsletter(payload: NewsletterPayload): Promise<{ status: string }> {
  return postJSON(`${API_BASE}/api/newsletter`, payload);
}
