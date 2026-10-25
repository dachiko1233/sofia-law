import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import PolicyLayout from '../components/PolicyLayout';
import PolicyArticle from '../components/PolicyArticle';
import { getPolicy, policyToc } from '../data/policies';
import type { Language } from '../i18n';

export default function PrivacyPage() {
  const { t, i18n } = useTranslation();
  const policy = getPolicy('privacy', i18n.language as Language);

  return (
    <>
      <Seo
        title={t('meta.privacyTitle')}
        description={t('meta.privacyDescription')}
        path="/privacy"
      />
      <PolicyLayout
        title={t('footer.privacy')}
        breadcrumbLabel={t('footer.privacy')}
        toc={policyToc(policy)}
        activePolicy="privacy"
      >
        <PolicyArticle policy={policy} />
      </PolicyLayout>
    </>
  );
}
