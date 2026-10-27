import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import PolicyLayout from '../components/PolicyLayout';
import PolicyArticle from '../components/PolicyArticle';
import { getPolicy, policyToc } from '../data/policies';
import type { Language } from '../i18n';

export default function CookiesPage() {
  const { t, i18n } = useTranslation();
  const enT = i18n.getFixedT('en');
  const policy = getPolicy('cookies', i18n.language as Language);

  return (
    <>
      <Seo
        title={t('meta.cookiesTitle')}
        description={t('meta.cookiesDescription')}
        path="/cookies"
      />
      <PolicyLayout
        title={t('footer.cookies')}
        titleReference={enT('footer.cookies')}
        breadcrumbLabel={t('footer.cookies')}
        toc={policyToc(policy)}
        activePolicy="cookies"
      >
        <PolicyArticle policy={policy} />
      </PolicyLayout>
    </>
  );
}
