import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShellPage } from '../ui';
import { CalendarIcon } from '../icons';

export default function AppointmentsPage() {
  const { t } = useTranslation();
  return (
    <ShellPage
      title={t('portal.nav.appointments')}
      intro={t('portal.appointmentsIntro')}
      icon={<CalendarIcon size={24} />}
      emptyTitle={t('portal.appointments.emptyTitle')}
      emptyBody={t('portal.appointments.emptyBody')}
      action={
        <Link
          to="/portal/support"
          className="mt-2 inline-flex min-h-[46px] items-center justify-center rounded-pill bg-gold px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#8f6d33]"
        >
          {t('portal.contactOffice')}
        </Link>
      }
    />
  );
}
