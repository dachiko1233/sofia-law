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

export function submitContact(payload: ContactPayload): Promise<{ status: string }> {
  return postJSON('/api/contact', payload);
}

export function submitNewsletter(payload: NewsletterPayload): Promise<{ status: string }> {
  return postJSON('/api/newsletter', payload);
}
