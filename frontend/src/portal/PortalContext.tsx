import { createContext, useContext } from 'react';
import type { Profile, PortalDocument } from '../lib/portal';

export interface PortalCtx {
  profile: Profile | null;
  docs: PortalDocument[];
  docsLoading: boolean;
  docsError: string | null;
  refreshDocs: () => Promise<void>;
  logout: () => void;
}

export const PortalContext = createContext<PortalCtx | null>(null);

export function usePortal(): PortalCtx {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside PortalLayout');
  return ctx;
}
