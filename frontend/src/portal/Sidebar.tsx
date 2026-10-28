import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  FolderIcon,
  FileIcon,
  ChatIcon,
  CalendarIcon,
  InvoiceIcon,
  UserIcon,
  SupportIcon,
} from './icons';

function Monogram() {
  // Classical pediment + columns — drawn, in gold.
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" className="text-gold-bright">
      <path d="M4 11 17 4l13 7H4Z" fill="currentColor" opacity="0.92" />
      <rect x="7" y="13" width="2.6" height="12" fill="currentColor" />
      <rect x="12.4" y="13" width="2.6" height="12" fill="currentColor" />
      <rect x="18.9" y="13" width="2.6" height="12" fill="currentColor" />
      <rect x="24.4" y="13" width="2.6" height="12" fill="currentColor" />
      <rect x="4" y="26.4" width="26" height="2.6" fill="currentColor" />
    </svg>
  );
}

const nav = [
  { to: '/portal', key: 'dashboard', Icon: HomeIcon },
  { to: '/portal/cases', key: 'cases', Icon: FolderIcon },
  { to: '/portal/documents', key: 'documents', Icon: FileIcon },
  { to: '/portal/messages', key: 'messages', Icon: ChatIcon },
  { to: '/portal/appointments', key: 'appointments', Icon: CalendarIcon },
  { to: '/portal/billing', key: 'billing', Icon: InvoiceIcon },
  { to: '/portal/profile', key: 'profile', Icon: UserIcon },
  { to: '/portal/support', key: 'support', Icon: SupportIcon },
] as const;

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col bg-portal-sidebar text-slate-doc">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 pb-7 pt-7">
        <Monogram />
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold tracking-logo text-white">{t('brand.name1')}</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold-bright">
            {t('portal.brandTagline')}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
        {nav.map(({ to, key, Icon }) => (
          <NavLink
            key={key}
            to={to}
            end={to === '/portal'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-[10px] px-3.5 py-3 text-[15px] font-medium transition-colors ${
                isActive
                  ? 'bg-portal-sidebar-hover text-white'
                  : 'text-slate-breadcrumb hover:bg-portal-sidebar-hover/60 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-gold-bright' : 'text-slate-label'}>
                  <Icon size={20} />
                </span>
                {t(`portal.nav.${key}`)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer promo */}
      <div className="px-4 pb-6 pt-4">
        <div className="relative overflow-hidden rounded-[12px]">
          <img
            src="/images/real-estate.jpg"
            alt=""
            className="h-[150px] w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[#06111f]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">
            <p className="portal-display m-0 text-[16px] font-medium leading-snug text-white">
              {t('portal.promo')}
            </p>
            <span className="h-[2px] w-9 bg-gold-bright" />
          </div>
        </div>
      </div>
    </div>
  );
}
