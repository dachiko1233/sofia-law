import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type Language } from '../i18n';

interface Props {
  /** "dark" = over the hero/topbar (home); "light" = inside the mobile menu panel. */
  tone?: 'dark' | 'light';
}

// EN / GR / RU pill toggle. Changing the language persists the choice
// (handled in src/i18n) and updates aria-pressed for assistive tech.
export default function LanguageSwitcher({ tone = 'dark' }: Props) {
  const { i18n, t } = useTranslation();
  const current = i18n.language as Language;

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('nav.language')}>
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = current === lng;
        const base =
          'rounded-pill px-3 py-1.5 text-xs font-bold tracking-[0.06em] min-h-[32px] min-w-[44px] cursor-pointer font-sans transition-colors';
        const activeCls = 'bg-white text-ink';
        const idleCls =
          tone === 'dark'
            ? 'bg-transparent text-slate-light hover:text-white'
            : 'bg-transparent text-muted hover:text-ink border border-line';
        return (
          <button
            key={lng}
            type="button"
            aria-pressed={active}
            onClick={() => void i18n.changeLanguage(lng)}
            className={`${base} border-none ${active ? activeCls : idleCls}`}
          >
            {LANGUAGE_LABELS[lng]}
          </button>
        );
      })}
    </div>
  );
}
