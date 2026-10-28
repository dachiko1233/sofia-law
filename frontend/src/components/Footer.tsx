import { useTranslation } from 'react-i18next';
import { AnchorLink } from './AnchorLink';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import { LinkedInIcon } from './icons';
import { openCookieSettings } from '../lib/cookieConsent';

type Variant = 'full' | 'practice' | 'legal';

interface Props {
  variant?: Variant;
  /** For the "legal" slim footer: which policy link to highlight. */
  activePolicy?: 'privacy' | 'cookies' | 'legal';
}

function CookieSettingsButton({ className }: { className: string }) {
  const { t } = useTranslation();
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {t('footer.cookieSettings')}
    </button>
  );
}

function PolicyLinks({ active }: { active?: Props['activePolicy'] }) {
  const { t } = useTranslation();
  const links = [
    { key: 'privacy', to: '/privacy', label: t('footer.privacy') },
    { key: 'cookies', to: '/cookies', label: t('footer.cookies') },
    { key: 'legal', to: '/legal-notice', label: t('footer.legal') },
  ] as const;
  return (
    <span className="flex flex-wrap gap-6">
      {links.map((l) => (
        <AnchorLink
          key={l.key}
          to={l.to}
          className={`no-underline ${active === l.key ? 'text-white' : 'text-footer-dim'}`}
        >
          {l.label}
        </AnchorLink>
      ))}
      <CookieSettingsButton className="cursor-pointer border-none bg-transparent p-0 font-sans text-[13px] text-footer-dim hover:text-white" />
    </span>
  );
}

export default function Footer({ variant = 'full', activePolicy }: Props) {
  const { t } = useTranslation();

  if (variant === 'practice' || variant === 'legal') {
    return (
      <footer className="bg-footer py-12 pb-10 text-[14px] text-slate-label">
        <div className="wrap flex flex-wrap justify-between gap-4">
          <span>{t('footer.disclaimerShort')}</span>
          {variant === 'practice' ? (
            <span>{t('footer.paDisclaimer')}</span>
          ) : (
            <PolicyLinks active={activePolicy} />
          )}
        </div>
      </footer>
    );
  }

  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/#expertise', label: t('nav.expertise') },
    { to: '/#careers', label: t('nav.careers') },
    { to: '/#about', label: t('nav.about') },
    { to: '/#contact', label: t('nav.contact') },
  ];
  const keyAreas = [
    { to: '/expertise/corporate', label: t('footer.areas.corporate') },
    { to: '/expertise/employment', label: t('footer.areas.employment') },
    { to: '/expertise/real-estate', label: t('footer.areas.realEstate') },
    { to: '/expertise/tech-ip', label: t('footer.areas.techIp') },
  ];

  return (
    <footer className="bg-footer pb-10 pt-[88px] text-[15px] text-slate-label">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-12 border-b border-navy-line pb-14 min-[960px]:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_minmax(0,2fr)]">
          {/* Brand */}
          <div className="flex flex-col gap-3.5">
            <Logo to="/" size={22} />
            <span>{t('brand.tagline')}</span>
            <div className="mt-1.5 flex gap-2.5">
              <a
                href="#"
                aria-label={t('footer.linkedin')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-border text-slate-label"
              >
                <LinkedInIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white">{t('footer.quickLinks')}</span>
            {quickLinks.map((l) => (
              <AnchorLink key={l.to} to={l.to} className="text-slate-label no-underline">
                {l.label}
              </AnchorLink>
            ))}
          </div>

          {/* Key areas */}
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white">{t('footer.keyAreas')}</span>
            {keyAreas.map((l) => (
              <AnchorLink key={l.to} to={l.to} className="text-slate-label no-underline">
                {l.label}
              </AnchorLink>
            ))}
          </div>

          {/* Office */}
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white">{t('footer.office')}</span>
            <span>{t('footer.cityCountry')}</span>
            <a
              href={`tel:${t('contact.phone').replace(/\s/g, '')}`}
              className="text-slate-label no-underline"
            >
              {t('contact.phone')}
            </a>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 flex flex-col gap-3.5 min-[640px]:max-[959px]:flex-row min-[640px]:max-[959px]:items-center min-[640px]:max-[959px]:justify-between min-[960px]:col-span-1">
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-white">{t('newsletter.heading')}</span>
              <span>{t('newsletter.blurb')}</span>
            </div>
            <div className="w-full min-[640px]:max-[959px]:max-w-[420px]">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 pt-7 text-[13px] text-footer-dim">
          <span>{t('footer.rights')}</span>
          <PolicyLinks />
        </div>
      </div>
    </footer>
  );
}
