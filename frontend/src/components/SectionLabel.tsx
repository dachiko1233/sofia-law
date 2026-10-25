import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Tailwind text-colour class, e.g. "text-accent" (light) or "text-slate-label" (dark). */
  className?: string;
  /** Render a leading dot (the hero eyebrow uses a white dot). */
  dot?: boolean;
  dotClassName?: string;
}

// The small uppercase eyebrow used above section headings.
export default function SectionLabel({
  children,
  className = 'text-accent',
  dot = false,
  dotClassName = 'bg-white',
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-label ${className}`}
    >
      {dot && <span className={`h-2 w-2 rounded-full ${dotClassName}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
