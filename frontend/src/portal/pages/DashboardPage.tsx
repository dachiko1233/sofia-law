import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePortal } from '../PortalContext';
import { Panel, PanelHeading, EmptyState } from '../ui';
import { formatDate } from '../helpers';
import { UploadDropzone } from '../Documents';
import type { PortalDocument } from '../../lib/portal';
import {
  FileIcon,
  ChatIcon,
  CalendarIcon,
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  HeadsetIcon,
  MailIcon,
  UploadCloudIcon,
} from '../icons';

interface Activity {
  id: string;
  kind: 'upload' | 'seen' | 'comment';
  title: string;
  detail: string;
  date: string;
}

// Build a real recent-activity feed from the client's own documents.
function buildActivity(docs: PortalDocument[], t: (k: string) => string): Activity[] {
  const items: Activity[] = [];
  for (const d of docs) {
    items.push({
      id: `up-${d.id}`,
      kind: 'upload',
      title: t('portal.activity.uploaded'),
      detail: d.name,
      date: d.createdAt,
    });
    if (d.seenAt) {
      items.push({
        id: `seen-${d.id}`,
        kind: 'seen',
        title: t('portal.activity.reviewed'),
        detail: d.name,
        date: d.seenAt,
      });
    }
    for (const c of d.comments) {
      items.push({
        id: `cm-${c.id}`,
        kind: 'comment',
        title: t('portal.activity.note'),
        detail: c.body,
        date: c.createdAt,
      });
    }
  }
  return items.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { profile, docs, refreshDocs } = usePortal();
  const activity = buildActivity(docs, t);
  const motto = t('brand.tagline').replace(/\.$/, '').toUpperCase();

  const actions = [
    { to: '/portal/documents', key: 'upload', Icon: FileIcon },
    { to: '/portal/messages', key: 'message', Icon: ChatIcon },
    { to: '/portal/appointments', key: 'appointment', Icon: CalendarIcon },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div
        className="relative overflow-hidden rounded-[16px] px-7 py-8 min-[768px]:px-10 min-[768px]:py-11"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(10,18,30,0.92) 0%, rgba(10,18,30,0.72) 45%, rgba(10,18,30,0.25) 100%), url(/images/hero-justice.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="m-0 text-[15px] font-medium text-slate-doc">{t('portal.welcome')}</p>
            <h1 className="portal-display m-0 mt-1 text-[40px] font-medium leading-none text-white min-[768px]:text-[52px]">
              {profile?.name || t('portal.client')}
            </h1>
            <p className="m-0 mt-3 max-w-[46ch] text-[15px] leading-relaxed text-slate-doc">
              {t('portal.welcomeBody')}
            </p>
          </div>
          <p className="hidden text-right text-[15px] font-semibold tracking-[0.2em] text-gold-bright min-[768px]:block">
            {motto}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 min-[680px]:grid-cols-3">
        {actions.map(({ to, key, Icon }) => (
          <Link
            key={key}
            to={to}
            className="portal-card group flex items-center gap-4 rounded-[14px] border border-portal-line bg-portal-card p-5 transition-transform hover:-translate-y-0.5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-soft text-white">
              <Icon size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="portal-display m-0 text-[17px] font-medium text-portal-ink">
                {t(`portal.actions.${key}.title`)}
              </p>
              <p className="m-0 text-[13.5px] leading-snug text-portal-muted">
                {t(`portal.actions.${key}.body`)}
              </p>
            </div>
            <ChevronRightIcon size={18} className="text-portal-muted group-hover:text-gold" />
          </Link>
        ))}
      </div>

      {/* Cases + activity */}
      <div className="grid grid-cols-1 gap-5 min-[1024px]:grid-cols-[1.85fr_1fr]">
        <Panel className="p-6">
          <PanelHeading
            title={t('portal.myCases')}
            action={
              <Link
                to="/portal/cases"
                className="inline-flex items-center gap-1 text-[14px] font-semibold text-gold hover:underline"
              >
                {t('portal.viewAll')}
                <ChevronRightIcon size={15} />
              </Link>
            }
          />
          <div className="mt-2">
            <EmptyState
              icon={<FolderIcon size={24} />}
              title={t('portal.cases.emptyTitle')}
              body={t('portal.cases.emptyBody')}
            />
          </div>
        </Panel>

        <Panel className="p-6">
          <PanelHeading title={t('portal.recentActivity')} />
          <div className="mt-4">
            {activity.length === 0 ? (
              <EmptyState
                icon={<ClockIcon size={24} />}
                title={t('portal.activity.emptyTitle')}
                body={t('portal.activity.emptyBody')}
              />
            ) : (
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {activity.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        a.kind === 'seen'
                          ? 'bg-ok-wash text-ok'
                          : a.kind === 'comment'
                            ? 'bg-info-wash text-info'
                            : 'bg-gold-wash text-gold'
                      }`}
                    >
                      {a.kind === 'seen' ? (
                        <CheckCircleIcon size={16} />
                      ) : a.kind === 'comment' ? (
                        <ChatIcon size={16} />
                      ) : (
                        <UploadCloudIcon size={16} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[14px] font-semibold text-portal-ink">{a.title}</p>
                      <p className="m-0 truncate text-[13px] text-portal-muted">{a.detail}</p>
                    </div>
                    <span className="shrink-0 text-[12px] text-portal-muted">
                      {formatDate(a.date)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>
      </div>

      {/* Upload + team + help */}
      <div className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-3">
        <Panel className="flex flex-col gap-4 p-6">
          <PanelHeading title={t('portal.uploadTitle')} />
          <UploadDropzone onUploaded={refreshDocs} />
        </Panel>

        <Panel className="flex flex-col gap-4 p-6">
          <PanelHeading title={t('portal.legalTeam')} />
          <div className="flex items-center gap-4">
            <img
              src="/images/sofia-polykarpou.jpg"
              alt={t('about.name')}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="m-0 text-[16px] font-semibold text-portal-ink">{t('about.name')}</p>
              <p className="m-0 text-[13.5px] text-portal-muted">{t('about.role')}</p>
            </div>
          </div>
          <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-portal-line pt-4">
            <Link
              to="/portal/messages"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold hover:underline"
            >
              <MailIcon size={16} />
              {t('portal.sendMessage')}
            </Link>
            <Link
              to="/portal/appointments"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold hover:underline"
            >
              <CalendarIcon size={16} />
              {t('portal.bookAppointment')}
            </Link>
          </div>
        </Panel>

        <Panel className="flex flex-col gap-4 p-6">
          <PanelHeading title={t('portal.needHelp')} />
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold">
              <HeadsetIcon size={24} />
            </span>
            <p className="m-0 text-[14px] leading-relaxed text-portal-muted">
              {t('portal.needHelpBody')}
            </p>
          </div>
          <Link
            to="/portal/support"
            className="mt-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill bg-gold px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#8f6d33]"
          >
            {t('portal.contactSupport')}
            <ChevronRightIcon size={16} />
          </Link>
        </Panel>
      </div>
    </div>
  );
}
