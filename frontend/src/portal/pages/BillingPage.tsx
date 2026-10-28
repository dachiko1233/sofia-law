import { useTranslation } from 'react-i18next';
import { ShellPage } from '../ui';
import { InvoiceIcon } from '../icons';

export default function BillingPage() {
  const { t } = useTranslation();
  return (
    <ShellPage
      title={t('portal.nav.billing')}
      intro={t('portal.billingIntro')}
      icon={<InvoiceIcon size={24} />}
      emptyTitle={t('portal.billing.emptyTitle')}
      emptyBody={t('portal.billing.emptyBody')}
    />
  );
}
