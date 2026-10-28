import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShellPage } from '../ui';
import { ChatIcon } from '../icons';

export default function MessagesPage() {
  const { t } = useTranslation();
  return (
    <ShellPage
      title={t('portal.nav.messages')}
      intro={t('portal.messagesIntro')}
      icon={<ChatIcon size={24} />}
      emptyTitle={t('portal.messages.emptyTitle')}
      emptyBody={t('portal.messages.emptyBody')}
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
