import { useTranslation } from 'react-i18next';
import { Panel } from '../ui';
import { MailIcon, HeadsetIcon, CalendarIcon, SupportIcon } from '../icons';

export default function SupportPage() {
  const { t } = useTranslation();
  const phone = t('contact.phone');
  const email = t('contact.email');

  const channels = [
    {
      Icon: HeadsetIcon,
      label: t('portal.support.callLabel'),
      value: phone,
      href: `tel:${phone.replace(/\s/g, '')}`,
    },
    {
      Icon: MailIcon,
      label: t('portal.support.emailLabel'),
      value: email,
      href: `mailto:${email}`,
    },
    {
      Icon: CalendarIcon,
      label: t('portal.support.hoursLabel'),
      value: t('topbar.hours'),
    },
    {
      Icon: SupportIcon,
      label: t('portal.support.officeLabel'),
      value: t('contact.officeAddress'),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="portal-display m-0 text-[30px] font-medium text-portal-ink">
          {t('portal.nav.support')}
        </h1>
        <p className="m-0 mt-1 text-[15px] text-portal-muted">{t('portal.supportIntro')}</p>
      </header>

      <div className="grid grid-cols-1 gap-5 min-[680px]:grid-cols-2">
        {channels.map(({ Icon, label, value, href }) => {
          const inner = (
            <>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold">
                <Icon size={22} />
              </span>
              <div className="min-w-0">
                <p className="m-0 text-[12.5px] font-semibold uppercase tracking-wide text-portal-muted">
                  {label}
                </p>
                <p className="m-0 mt-0.5 break-words text-[16px] font-semibold text-portal-ink">
                  {value}
                </p>
              </div>
            </>
          );
          return (
            <Panel key={label} className="p-5">
              {href ? (
                <a
                  href={href}
                  className="flex items-center gap-4 no-underline hover:[&_p:last-child]:text-gold"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex items-center gap-4">{inner}</div>
              )}
            </Panel>
          );
        })}
      </div>

      <Panel className="p-6">
        <p className="m-0 text-[14.5px] leading-relaxed text-portal-muted">
          {t('portal.supportNote')}
        </p>
      </Panel>
    </div>
  );
}
