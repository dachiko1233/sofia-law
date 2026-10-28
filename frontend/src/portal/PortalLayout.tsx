import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  getProfile,
  listDocuments,
  logout as clearSession,
  PortalError,
  type Profile,
  type PortalDocument,
} from '../lib/portal';
import { PortalContext, type PortalCtx } from './PortalContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { CloseIcon } from '../components/icons';

export default function PortalLayout({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [docs, setDocs] = useState<PortalDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const signOut = useCallback(() => {
    clearSession();
    onLogout();
    navigate('/portal');
  }, [onLogout, navigate]);

  const refreshDocs = useCallback(async () => {
    try {
      setDocsError(null);
      const list = await listDocuments();
      setDocs(list);
    } catch (err) {
      if (err instanceof PortalError && err.status === 401) {
        signOut();
        return;
      }
      setDocsError(err instanceof PortalError ? err.code : 'generic');
    } finally {
      setDocsLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const p = await getProfile();
        if (active) setProfile(p);
      } catch (err) {
        if (err instanceof PortalError && err.status === 401) signOut();
      }
    })();
    void refreshDocs();
    return () => {
      active = false;
    };
  }, [refreshDocs, signOut]);

  const ctx: PortalCtx = {
    profile,
    docs,
    docsLoading,
    docsError,
    refreshDocs,
    logout: signOut,
  };

  return (
    <PortalContext.Provider value={ctx}>
      <div className="portal-root flex h-screen overflow-hidden bg-portal-bg text-portal-ink">
        {/* Desktop sidebar */}
        <aside className="hidden w-[264px] shrink-0 min-[1024px]:block">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        {navOpen && (
          <div className="fixed inset-0 z-40 min-[1024px]:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/45"
              onClick={() => setNavOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[264px] max-w-[80vw] shadow-2xl">
              <Sidebar onNavigate={() => setNavOpen(false)} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setNavOpen(false)}
                className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-doc hover:bg-white/10"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        )}

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onOpenNav={() => setNavOpen(true)} />
          <main className="portal-scroll flex-1 overflow-y-auto px-5 py-6 min-[1024px]:px-8 min-[1024px]:py-8">
            <div className="mx-auto w-full max-w-[1120px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </PortalContext.Provider>
  );
}
