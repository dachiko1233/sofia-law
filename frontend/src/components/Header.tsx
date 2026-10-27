import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { AnchorLink } from './AnchorLink';
import Button from './Button';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { MenuIcon, CloseIcon } from './icons';

interface Props {
  variant: 'home' | 'inner';
}

export default function Header({ variant }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route (or hash) changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/#expertise', label: t('nav.expertise') },
    { to: '/#careers', label: t('nav.careers') },
    { to: '/#about', label: t('nav.about') },
    { to: '/#contact', label: t('nav.contact') },
  ];

  const navGap = variant === 'home' ? 'gap-9' : 'gap-8';

  return (
    <div className="relative">
      {/* Top bar — only on the home hero (matches the design) */}
      {variant === 'home' && (
        <div className="wrap flex h-[53px] items-center justify-between gap-4 border-b border-[#5A4433] text-[14px]">
          <div className="hidden gap-7 min-[960px]:flex">
            <a
              href={`tel:${t('contact.phone').replace(/\s/g, '')}`}
              className="text-slate-light no-underline"
            >
              {t('contact.phone')}
            </a>
            <a href={`mailto:${t('contact.email')}`} className="text-slate-light no-underline">
              {t('contact.email')}
            </a>
            <span className="text-slate-light">{t('topbar.hours')}</span>
          </div>
          <div className="ml-auto">
            <LanguageSwitcher tone="dark" />
          </div>
        </div>
      )}

      {/* Main nav row */}
      <header
        className={`wrap flex items-center justify-between gap-6 ${
          variant === 'home' ? 'py-6' : 'border-b border-white/[0.12] py-7'
        }`}
      >
        <Logo to="/" size={24} />

        <nav
          className={`hidden items-center min-[960px]:flex ${navGap}`}
          aria-label={t('nav.menu')}
        >
          {navItems.map((item) => (
            <AnchorLink
              key={item.to}
              to={item.to}
              className="text-[16px] font-medium text-white no-underline hover:text-accent"
            >
              {item.label}
            </AnchorLink>
          ))}
        </nav>

        <div className="hidden min-[960px]:block">
          <Button to="/#contact" variant="navy" size="sm">
            {t('buttons.getInTouch')}
          </Button>
        </div>

        {/* Hamburger (below 960px) */}
        <button
          type="button"
          className="text-white min-[960px]:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="wrap flex flex-col gap-5 border-t border-white/[0.12] py-6 min-[960px]:hidden"
        >
          <nav className="flex flex-col gap-4" aria-label={t('nav.menu')}>
            {navItems.map((item) => (
              <AnchorLink
                key={item.to}
                to={item.to}
                className="text-lg font-medium text-white no-underline hover:text-accent"
              >
                {item.label}
              </AnchorLink>
            ))}
          </nav>
          <LanguageSwitcher tone="dark" />
          <Button to="/#contact" variant="navy" size="sm" className="self-start">
            {t('buttons.getInTouch')}
          </Button>
        </div>
      )}
    </div>
  );
}
