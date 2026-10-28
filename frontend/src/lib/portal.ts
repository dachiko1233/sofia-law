// Client-portal API: registration, login and document upload/listing.
// The session token is kept in localStorage and sent as a Bearer header.
// In production the backend lives on a separate origin (VITE_API_BASE); in dev
// this is empty and Vite proxies /api to the local backend.

const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');
const TOKEN_KEY = 'portal_token';

export interface DocumentComment {
  id: number;
  body: string;
  createdAt: string;
}

export interface PortalDocument {
  id: number;
  name: string;
  mime: string;
  size: number;
  createdAt: string;
  /** null until the office marks the file reviewed. */
  seenAt: string | null;
  comments: DocumentComment[];
}

export interface RegisterInput {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
}

export interface Profile {
  uid: number;
  email: string;
  name: string;
  surname: string;
  phone: string;
}

export class PortalError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
export function isLoggedIn(): boolean {
  return !!getToken();
}

async function parseError(res: Response): Promise<never> {
  let code = 'request_failed';
  try {
    const data = (await res.json()) as { error?: string };
    if (data?.error) code = data.error;
  } catch {
    /* ignore non-JSON bodies */
  }
  // Surface the real cause in the console so failures are diagnosable instead
  // of showing an opaque "something went wrong" (e.g. a 404 means the portal
  // API isn't deployed on this backend).
  console.error(`Portal API ${res.url} failed: ${res.status} ${code}`);
  throw new PortalError(code, res.status);
}

async function authPost(path: string, body: unknown): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
  const data = (await res.json()) as { token: string };
  setToken(data.token);
  return data.token;
}

export function register(input: RegisterInput): Promise<string> {
  return authPost('/api/portal/register', input);
}

export function login(email: string, password: string): Promise<string> {
  return authPost('/api/portal/login', { email, password });
}

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${getToken() ?? ''}` };
}

export async function getProfile(): Promise<Profile> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/portal/me`, { headers: authHeaders() });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
  return (await res.json()) as Profile;
}

export async function listDocuments(): Promise<PortalDocument[]> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/portal/documents`, { headers: authHeaders() });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
  const data = (await res.json()) as { documents: PortalDocument[] };
  return data.documents;
}

export async function uploadDocument(file: File): Promise<PortalDocument> {
  const form = new FormData();
  form.append('file', file);
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/portal/documents`, {
      method: 'POST',
      headers: authHeaders(),
      body: form,
    });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
  return (await res.json()) as PortalDocument;
}

export async function deleteDocument(id: number): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/portal/documents/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
}

// downloadDocument fetches the file (with auth) and saves it via a temporary link.
export async function downloadDocument(doc: PortalDocument): Promise<void> {
  const res = await fetch(`${API_BASE}/api/portal/documents/${doc.id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) await parseError(res);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = doc.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
