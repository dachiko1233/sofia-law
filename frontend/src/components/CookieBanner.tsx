import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AnchorLink } from './AnchorLink';
import { getConsent, setConsent, onOpenCookieSettings } from '../lib/cookieConsent';

// Bottom-fixed consent banner. Shows until a choice is stored, and can be
// reopened from the footer "Cookie settings" link.
export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
    return onOpenCookieSettings(() => setVisible(true));
  }, []);

  function choose(value: 'accepted' | 'rejected') {
    setConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t('cookie.title')}
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-border bg-footer text-slate-label"
    >
      <div className="wrap flex flex-col items-start gap-4 py-5 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between">
        <div className="max-w-[760px] text-[14px] leading-relaxed">
          <span className="mr-2 font-semibold text-white">{t('cookie.title')}</span>
          <Trans
            i18nKey="cookie.body"
            components={[
              <AnchorLink
                key="cookies"
                to="/cookies"
                className="text-white underline underline-offset-2"
              />,
            ]}
          />
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="min-h-[44px] cursor-pointer rounded-pill border border-navy-border bg-transparent px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t('cookie.reject')}
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="min-h-[44px] cursor-pointer rounded-pill border-none bg-accent-bright px-6 py-2.5 text-sm font-semibold text-white"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
