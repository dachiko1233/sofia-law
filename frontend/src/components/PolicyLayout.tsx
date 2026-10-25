import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AnchorLink } from './AnchorLink';
import Header from './Header';
import Footer from './Footer';

export interface TocItem {
  id: string;
  label: string;
}

interface Props {
  title: string;
  breadcrumbLabel: string;
  toc: TocItem[];
  activePolicy: 'privacy' | 'cookies' | 'legal';
  children: ReactNode;
}

// Shared shell for the three policy pages: dark header band with breadcrumb +
// title, then a sticky "On this page" table of contents beside the article.
export default function PolicyLayout({
  title,
  breadcrumbLabel,
  toc,
  activePolicy,
  children,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-bg text-ink">
      <div className="pa-head text-slate-doc">
        <Header variant="inner" />
        <section className="wrap flex min-h-[300px] flex-col justify-center gap-5 pb-24 pt-20 min-[960px]:min-h-[380px]">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap gap-2.5 text-sm text-slate-breadcrumb"
          >
            <AnchorLink to="/" className="text-slate-breadcrumb no-underline">
              {t('policy.breadcrumbHome')}
            </AnchorLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white">
              {breadcrumbLabel}
            </span>
          </nav>
          <h1 className="m-0 text-[44px] font-medium leading-[1.04] tracking-[-0.045em] text-white min-[960px]:text-[68px]">
            {title}
          </h1>
          <span className="text-[15px] text-slate-breadcrumb">{t('policy.lastUpdated')}</span>
        </section>
      </div>

      <section className="pb-[120px] pt-24">
        <div className="wrap policy-grid">
          <nav
            className="policy-toc flex flex-col gap-2.5 text-[15px]"
            aria-label={t('policy.onThisPage')}
          >
            <span className="mb-1.5 text-[13px] font-bold uppercase tracking-[0.12em] text-muted">
              {t('policy.onThisPage')}
            </span>
            {toc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="no-underline text-accent">
                {item.label}
              </a>
            ))}
          </nav>
          <article className="policy-doc max-w-prose">{children}</article>
        </div>
      </section>

      <Footer variant="legal" activePolicy={activePolicy} />
    </div>
  );
}
