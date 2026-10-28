import { useTranslation } from 'react-i18next';
import { usePortal } from '../PortalContext';
import { Panel } from '../ui';
import { LogOutIcon } from '../icons';

function initials(name: string, surname: string): string {
  return ((name.trim()[0] ?? '') + (surname.trim()[0] ?? '')).toUpperCase() || 'GC';
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { profile, logout } = usePortal();

  const fields: { label: string; value: string }[] = [
    { label: t('portal.name'), value: profile?.name ?? '' },
    { label: t('portal.surname'), value: profile?.surname ?? '' },
    { label: t('portal.email'), value: profile?.email ?? '' },
    { label: t('portal.phone'), value: profile?.phone ?? '' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="portal-display m-0 text-[30px] font-medium text-portal-ink">
          {t('portal.nav.profile')}
        </h1>
        <p className="m-0 mt-1 text-[15px] text-portal-muted">{t('portal.profileIntro')}</p>
      </header>

      <Panel className="p-6 min-[680px]:p-8">
        <div className="flex items-center gap-4 border-b border-portal-line pb-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-portal-sidebar text-[20px] font-semibold text-gold-bright">
            {profile ? initials(profile.name, profile.surname) : '··'}
          </span>
          <div>
            <p className="portal-display m-0 text-[22px] font-medium text-portal-ink">
              {profile ? `${profile.name} ${profile.surname}`.trim() : ''}
            </p>
            <p className="m-0 text-[14px] text-portal-muted">{profile?.email}</p>
          </div>
        </div>

        <dl className="m-0 mt-6 grid grid-cols-1 gap-x-10 gap-y-6 min-[560px]:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <dt className="text-[12px] font-semibold uppercase tracking-wide text-portal-muted">
                {f.label}
              </dt>
              <dd className="m-0 text-[16px] text-portal-ink">{f.value || '—'}</dd>
            </div>
          ))}
        </dl>

        <p className="m-0 mt-6 rounded-[10px] bg-[#faf8f3] px-4 py-3 text-[13.5px] text-portal-muted">
          {t('portal.profileNote')}
        </p>

        <button
          type="button"
          onClick={logout}
          className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-pill border border-portal-line px-6 text-[15px] font-semibold text-bad transition-colors hover:bg-bad-wash"
        >
          <LogOutIcon size={18} />
          {t('portal.logout')}
        </button>
      </Panel>
    </div>
  );
}
