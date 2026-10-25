import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import PolicyLayout from '../components/PolicyLayout';
import PolicyArticle from '../components/PolicyArticle';
import { getPolicy, policyToc } from '../data/policies';
import type { Language } from '../i18n';

export default function LegalNoticePage() {
  const { t, i18n } = useTranslation();
  const policy = getPolicy('legal', i18n.language as Language);

  return (
    <>
      <Seo
        title={t('meta.legalTitle')}
        description={t('meta.legalDescription')}
        path="/legal-notice"
      />
      <PolicyLayout
        title={t('footer.legal')}
        breadcrumbLabel={t('footer.legal')}
        toc={policyToc(policy)}
        activePolicy="legal"
      >
        <PolicyArticle policy={policy} />
      </PolicyLayout>
    </>
  );
}
