import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import PolicyLayout from '../components/PolicyLayout';
import PolicyArticle from '../components/PolicyArticle';
import { getPolicy, policyToc } from '../data/policies';
import type { Language } from '../i18n';

export default function TermsPage() {
  const { t, i18n } = useTranslation();
  const enT = i18n.getFixedT('en');
  const policy = getPolicy('terms', i18n.language as Language);

  return (
    <>
      <Seo title={t('meta.termsTitle')} description={t('meta.termsDescription')} path="/terms" />
      <PolicyLayout
        title={t('footer.terms')}
        titleReference={enT('footer.terms')}
        breadcrumbLabel={t('footer.terms')}
        toc={policyToc(policy)}
        activePolicy="terms"
      >
        <PolicyArticle policy={policy} />
      </PolicyLayout>
    </>
  );
}
