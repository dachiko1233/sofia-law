import { useTranslation } from 'react-i18next';
import { ShellPage } from '../ui';
import { FolderIcon } from '../icons';

export default function CasesPage() {
  const { t } = useTranslation();
  return (
    <ShellPage
      title={t('portal.nav.cases')}
      intro={t('portal.casesIntro')}
      icon={<FolderIcon size={24} />}
      emptyTitle={t('portal.cases.emptyTitle')}
      emptyBody={t('portal.cases.emptyBody')}
    />
  );
}
