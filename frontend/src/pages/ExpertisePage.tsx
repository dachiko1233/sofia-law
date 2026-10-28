import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import Button from '../components/Button';
import ServiceItem from '../components/ServiceItem';
import FaqList from '../components/FaqList';
import CtaBanner from '../components/CtaBanner';
import FitText from '../components/FitText';
import { AnchorLink } from '../components/AnchorLink';
import { ArrowRight } from '../components/icons';
import { getPracticeArea, getPracticeAreas } from '../data/practiceAreas';
import type { Language } from '../i18n';
import NotFoundPage from './NotFoundPage';

const innerHeading =
  'm-0 text-[32px] font-medium leading-[1.08] tracking-[-0.04em] min-[960px]:text-[48px]';

export default function ExpertisePage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Language;
  const area = getPracticeArea(slug, lang);
  // English copy for this area — the reference every heading height matches.
  const areaEn = getPracticeArea(slug, 'en');
  const enT = i18n.getFixedT('en');

  if (!area || !areaEn) return <NotFoundPage />;

  const others = getPracticeAreas(lang).filter((a) => a.slug !== area.slug);
  const enTitles = Object.fromEntries(getPracticeAreas('en').map((a) => [a.slug, a.title]));

  return (
    <div className="bg-bg text-ink">
      <Seo
        title={area.metaTitle}
        description={area.metaDescription}
        path={`/expertise/${area.slug}`}
      />

      {/* HEADER BAND */}
      <div className={`pa-head pa-head--${area.slug} text-slate-doc`}>
        <Header variant="inner" />
        <section className="wrap flex min-h-[520px] flex-col justify-center gap-7 pb-32 pt-24 min-[960px]:min-h-[720px]">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap gap-2.5 text-sm text-slate-breadcrumb"
          >
            <AnchorLink to="/" className="text-slate-breadcrumb no-underline">
              {t('paTemplate.breadcrumbHome')}
            </AnchorLink>
            <span aria-hidden="true">/</span>
            <AnchorLink to="/#expertise" className="text-slate-breadcrumb no-underline">
              {t('paTemplate.breadcrumbExpertise')}
            </AnchorLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white">
              {area.title}
            </span>
          </nav>
          <SectionLabel className="text-slate-breadcrumb">
            {t('paTemplate.eyebrow')} · {area.num}
          </SectionLabel>
          <FitText
            as="h1"
            reference={areaEn.title}
            className="m-0 max-w-[820px] text-[44px] font-medium leading-[1.02] tracking-[-0.045em] text-white min-[960px]:text-[76px]"
          >
            {area.title}
          </FitText>
          <p className="m-0 max-w-[620px] text-[19px] text-slate-doc">{area.intro}</p>
          <div className="flex flex-wrap gap-3.5">
            <Button to="/#contact" variant="white" size="lg">
              {t('buttons.bookConsultation')}
            </Button>
          </div>
        </section>
      </div>

      {/* OVERVIEW */}
      <section className="py-[72px] min-[960px]:py-32">
        <div className="wrap grid grid-cols-1 gap-10 min-[960px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[960px]:gap-24">
          <div className="flex flex-col gap-5">
            <SectionLabel>{t('paTemplate.overview')}</SectionLabel>
            <FitText as="h2" reference={areaEn.overviewTitle} className={innerHeading}>
              {area.overviewTitle}
            </FitText>
          </div>
          <div className="flex flex-col gap-[22px] pt-2 text-ink-soft">
            {area.overviewParas.map((p, i) => (
              <p key={i} className={`m-0 ${i === 0 ? 'text-[19px]' : ''}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-[72px] min-[960px]:py-32">
        <div className="wrap">
          <div className="mb-12 flex max-w-[720px] flex-col gap-5">
            <SectionLabel>{t('paTemplate.services')}</SectionLabel>
            <FitText as="h2" reference={areaEn.servicesTitle} className={innerHeading}>
              {area.servicesTitle}
            </FitText>
          </div>
          <div className="grid grid-cols-1 border-t border-ink min-[960px]:grid-cols-2 min-[960px]:gap-x-12">
            {area.services.map((s) => (
              <ServiceItem key={s.name} name={s.name} desc={s.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="py-[72px] min-[960px]:py-32">
        <div className="wrap">
          <div className="mb-12 flex max-w-[720px] flex-col gap-5">
            <SectionLabel>{t('paTemplate.approach')}</SectionLabel>
            <FitText as="h2" reference={areaEn.approachTitle} className={innerHeading}>
              {area.approachTitle}
            </FitText>
          </div>
          <div className="grid grid-cols-1 gap-6 min-[960px]:grid-cols-3">
            {area.why.map((w, i) => (
              <div key={w.num} className="flex flex-col gap-3 rounded-md bg-white p-9">
                <span className="text-[15px] font-bold text-accent">{w.num}</span>
                <FitText
                  reference={areaEn.why[i]?.title ?? w.title}
                  className="text-[22px] font-semibold tracking-[-0.02em]"
                >
                  {w.title}
                </FitText>
                <span className="text-muted">{w.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-[72px] min-[960px]:py-32">
        <div className="wrap grid grid-cols-1 gap-10 min-[960px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[960px]:gap-24">
          <div className="flex flex-col gap-5">
            <SectionLabel>{t('paTemplate.faq')}</SectionLabel>
            <FitText as="h2" reference={areaEn.faqTitle} className={innerHeading}>
              {area.faqTitle}
            </FitText>
          </div>
          <FaqList items={area.faqs} />
        </div>
      </section>

      {/* CTA */}
      <CtaBanner
        title={area.ctaTitle}
        titleReference={areaEn.ctaTitle}
        text={area.ctaText}
        buttonLabel={t('buttons.bookConsultation')}
      />

      {/* OTHER PRACTICE AREAS */}
      <section className="py-[72px] min-[960px]:py-28">
        <div className="wrap">
          <FitText
            as="h2"
            reference={enT('paTemplate.otherAreas')}
            className="mb-7 text-[28px] font-medium tracking-[-0.03em]"
          >
            {t('paTemplate.otherAreas')}
          </FitText>
          <div className="grid grid-cols-1 gap-3 min-[960px]:grid-cols-3">
            {others.map((o) => (
              <AnchorLink
                key={o.slug}
                to={`/expertise/${o.slug}`}
                className="more-card flex min-h-[44px] items-center justify-between gap-3 rounded-md bg-white px-6 py-[22px] font-semibold no-underline"
              >
                <FitText reference={enTitles[o.slug]}>{o.title}</FitText>
                <ArrowRight size={18} />
              </AnchorLink>
            ))}
          </div>
        </div>
      </section>

      <Footer variant="practice" />
    </div>
  );
}
