// Office/admin API: a single admin logs in (separate from client accounts) and
// reviews every client's uploads — marking files seen and leaving comments.
// The admin token is kept under its own localStorage key.

import { PortalError, type PortalDocument, type DocumentComment } from './portal';

const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');
const TOKEN_KEY = 'admin_token';

export interface AdminClient {
  id: number;
  email: string;
  name: string;
  surname: string;
  phone: string;
  createdAt: string;
  documents: PortalDocument[];
}

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function adminLogout() {
  localStorage.removeItem(TOKEN_KEY);
}
export function isAdminLoggedIn(): boolean {
  return !!getAdminToken();
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  return { Authorization: `Bearer ${getAdminToken() ?? ''}`, ...extra };
}

async function parseError(res: Response): Promise<never> {
  let code = 'request_failed';
  try {
    const data = (await res.json()) as { error?: string };
    if (data?.error) code = data.error;
  } catch {
    /* ignore non-JSON bodies */
  }
  throw new PortalError(code, res.status);
}

export async function adminLogin(email: string, password: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
  const data = (await res.json()) as { token: string };
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.token;
}

export async function listClients(): Promise<AdminClient[]> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/admin/clients`, { headers: authHeaders() });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
  const data = (await res.json()) as { clients: AdminClient[] };
  return data.clients;
}

export async function setDocumentSeen(docId: number, seen: boolean): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/admin/documents/${docId}/seen`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ seen }),
    });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
}

export async function addComment(docId: number, body: string): Promise<DocumentComment> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/admin/documents/${docId}/comments`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ body }),
    });
  } catch {
    throw new PortalError('network', 0);
  }
  if (!res.ok) await parseError(res);
  return (await res.json()) as DocumentComment;
}

// adminDownloadDocument fetches a client's file (with the admin token) and saves it.
export async function adminDownloadDocument(doc: PortalDocument): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/documents/${doc.id}`, {
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
