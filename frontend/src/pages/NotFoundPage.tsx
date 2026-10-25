import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="bg-bg text-ink">
      <Seo
        title="Page not found — Polykarpou Law"
        description="The page you requested could not be found."
      />
      <div className="pa-head text-slate-doc">
        <Header variant="inner" />
        <section className="wrap flex flex-col items-start gap-6 pb-32 pt-24">
          <span className="text-[13px] font-semibold uppercase tracking-label text-slate-breadcrumb">
            404
          </span>
          <h1 className="m-0 max-w-[700px] text-[44px] font-medium leading-[1.04] tracking-[-0.045em] text-white min-[960px]:text-[64px]">
            Page not found
          </h1>
          <p className="m-0 max-w-[560px] text-[19px] text-slate-doc">
            The page you were looking for doesn’t exist or has moved.
          </p>
          <Button to="/" variant="white" size="lg" arrow>
            {t('nav.home')}
          </Button>
        </section>
      </div>
      <Footer variant="practice" />
    </div>
  );
}
