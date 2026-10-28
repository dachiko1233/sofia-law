import type { ReactNode } from 'react';

/** White card container with the portal's warm depth. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`portal-card rounded-[14px] border border-portal-line bg-portal-card ${className}`}
    >
      {children}
    </section>
  );
}

/** Serif section/page title, optionally with a trailing action (e.g. "View all"). */
export function PanelHeading({
  title,
  action,
  className = '',
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <h2 className="portal-display m-0 text-[22px] font-medium text-portal-ink">{title}</h2>
      {action}
    </div>
  );
}

/** Empty state used across sections that have no backend data yet. */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-wash text-gold">
        {icon}
      </span>
      <h3 className="portal-display m-0 text-[20px] font-medium text-portal-ink">{title}</h3>
      <p className="m-0 max-w-[42ch] text-[15px] leading-relaxed text-portal-muted">{body}</p>
      {action}
    </div>
  );
}

/** A routed sub-page that has no backend yet: title + intro + empty state. */
export function ShellPage({
  title,
  intro,
  icon,
  emptyTitle,
  emptyBody,
  action,
}: {
  title: string;
  intro: string;
  icon: ReactNode;
  emptyTitle: string;
  emptyBody: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="portal-display m-0 text-[30px] font-medium text-portal-ink">{title}</h1>
        <p className="m-0 mt-1 text-[15px] text-portal-muted">{intro}</p>
      </header>
      <Panel className="p-6">
        <EmptyState icon={icon} title={emptyTitle} body={emptyBody} action={action} />
      </Panel>
    </div>
  );
}

export type CaseStatus = 'approved' | 'in_review' | 'documents_required' | 'declined';

/** Colored status pill matching the firm's status vocabulary. */
export function StatusBadge({ status, label }: { status: CaseStatus; label: string }) {
  const styles: Record<CaseStatus, string> = {
    approved: 'bg-ok-wash text-ok',
    in_review: 'bg-info-wash text-info',
    documents_required: 'bg-warn-wash text-warn',
    declined: 'bg-bad-wash text-bad',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold ${styles[status]}`}
    >
      {label}
    </span>
  );
}
