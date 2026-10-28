import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePortal } from './PortalContext';
import { BellIcon, ChevronDownIcon, UserIcon, LogOutIcon } from './icons';
import { MenuIcon } from '../components/icons';

function initials(name: string, surname: string): string {
  const a = name.trim()[0] ?? '';
  const b = surname.trim()[0] ?? '';
  return (a + b).toUpperCase() || 'GC';
}

export default function TopBar({ onOpenNav }: { onOpenNav: () => void }) {
  const { t } = useTranslation();
  const { profile, logout } = usePortal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const fullName = profile ? `${profile.name} ${profile.surname}`.trim() : '';

  return (
    <header className="sticky top-0 z-20 flex h-[68px] shrink-0 items-center gap-3 border-b border-portal-line bg-portal-bg/85 px-5 backdrop-blur-md min-[1024px]:px-8">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label={t('nav.openMenu')}
        className="flex h-10 w-10 items-center justify-center rounded-[9px] text-portal-ink hover:bg-gold-wash min-[1024px]:hidden"
      >
        <MenuIcon />
      </button>

      <span className="portal-display text-[18px] font-medium text-gold">{t('portal.title')}</span>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div ref={bellRef} className="relative">
          <button
            type="button"
            onClick={() => setBellOpen((v) => !v)}
            aria-label={t('portal.notifications')}
            aria-expanded={bellOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-portal-ink hover:bg-gold-wash"
          >
            <BellIcon size={21} />
          </button>
          {bellOpen && (
            <div className="absolute right-0 top-[52px] w-[280px] rounded-[12px] border border-portal-line bg-white p-5 text-center portal-card">
              <p className="portal-display m-0 text-[15px] font-medium text-portal-ink">
                {t('portal.noNotificationsTitle')}
              </p>
              <p className="m-0 mt-1 text-[13px] text-portal-muted">
                {t('portal.noNotificationsBody')}
              </p>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 hover:bg-gold-wash"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-portal-sidebar text-[13px] font-semibold text-gold-bright">
              {profile ? initials(profile.name, profile.surname) : '··'}
            </span>
            <span className="hidden max-w-[140px] truncate text-[14px] font-semibold text-portal-ink min-[560px]:inline">
              {fullName || t('portal.nav.profile')}
            </span>
            <ChevronDownIcon size={16} className="text-portal-muted" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-[52px] w-[220px] overflow-hidden rounded-[12px] border border-portal-line bg-white py-1.5 portal-card">
              <div className="border-b border-portal-line px-4 pb-2.5 pt-1.5">
                <p className="m-0 truncate text-[14px] font-semibold text-portal-ink">{fullName}</p>
                <p className="m-0 truncate text-[12.5px] text-portal-muted">{profile?.email}</p>
              </div>
              <Link
                to="/portal/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium text-portal-ink hover:bg-gold-wash"
              >
                <UserIcon size={17} className="text-portal-muted" />
                {t('portal.nav.profile')}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[14px] font-medium text-bad hover:bg-bad-wash"
              >
                <LogOutIcon size={17} />
                {t('portal.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
