import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import Button from '../components/Button';
import PracticeAreaRow from '../components/PracticeAreaRow';
import ContactForm from '../components/ContactForm';
import FitText from '../components/FitText';
import { AnchorLink } from '../components/AnchorLink';
import { ArrowRight, MonitorIcon, LockIcon } from '../components/icons';
import { getPracticeAreas } from '../data/practiceAreas';
import type { Language } from '../i18n';

// Shared Tailwind classes for the big section headings.
const H2 = 'm-0 text-[36px] font-medium leading-[1.05] tracking-[-0.04em] min-[960px]:text-[56px]';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const enT = i18n.getFixedT('en');
  const practiceAreas = getPracticeAreas(i18n.language as Language);
  // English titles, keyed by slug — the reference each card title must match.
  const enTitles = Object.fromEntries(getPracticeAreas('en').map((a) => [a.slug, a.title]));

  return (
    <div className="bg-bg text-ink">
      <Seo title={t('meta.homeTitle')} description={t('meta.homeDescription')} path="/" />

      {/* HERO + NAV over the dark photo */}
      <div className="hero-wrap relative overflow-hidden bg-[#3D2B1F] text-[#E6DCD3]">
        <Header variant="home" />
        <Hero />
      </div>

      {/* ABOUT */}
      <section id="about" className="py-20 min-[960px]:py-[140px]">
        <div className="wrap grid grid-cols-1 items-start gap-10 min-[960px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[960px]:gap-24">
          <div className="flex flex-col gap-5">
            <img
              src="/images/sofia-polykarpou.jpg"
              alt={t('about.portraitAlt')}
              width={695}
              height={868}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-[4px] bg-placeholder object-cover"
            />
            <div className="flex flex-col items-center gap-0.5 text-center">
              <span className="text-[18px] font-semibold">{t('about.name')}</span>
              <span className="text-[15px] text-muted">{t('about.role')}</span>
            </div>
          </div>
          <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[22px] text-center">
            <SectionLabel className="leading-none text-accent">{t('about.label')}</SectionLabel>
            <FitText as="h2" reference={enT('about.title')} className={H2}>
              {t('about.title')}
            </FitText>
            {(['p1', 'p2', 'p3', 'p4'] as const).map((p) => (
              <p
                key={p}
                className="m-0 w-full text-[18px] leading-[1.75] text-ink-soft [hyphens:auto] [text-align:left]"
              >
                {t(`about.${p}`)}
              </p>
            ))}
            <AnchorLink
              to="/#contact"
              className="inline-flex min-h-[44px] items-center gap-2.5 self-center border-b-[1.5px] border-ink pb-1 font-semibold no-underline"
            >
              {t('buttons.arrangeConsultation')}
              <ArrowRight size={16} />
            </AnchorLink>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="expertise" className="bg-white py-20 min-[960px]:py-[140px]">
        <div className="wrap">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
            <div className="flex max-w-[720px] flex-col gap-5">
              <SectionLabel>{t('expertise.label')}</SectionLabel>
              <FitText as="h2" reference={enT('expertise.title')} className={H2}>
                {t('expertise.title')}
              </FitText>
            </div>
            <AnchorLink
              to="/#contact"
              className="inline-flex min-h-[44px] items-center gap-2.5 font-semibold no-underline"
            >
              {t('buttons.discussCase')}
              <ArrowRight size={16} />
            </AnchorLink>
          </div>
          <div className="grid grid-cols-1 border-t border-ink min-[960px]:grid-cols-2 min-[960px]:gap-x-16">
            {practiceAreas.map((area) => (
              <PracticeAreaRow
                key={area.slug}
                num={area.num}
                title={area.title}
                titleReference={enTitles[area.slug]}
                blurb={area.homeBlurb}
                slug={area.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="bg-navy py-20 text-slate-light min-[960px]:py-[140px]">
        <div className="wrap">
          <div className="mb-16 flex max-w-[760px] flex-col gap-5">
            <SectionLabel className="text-slate-label">{t('technology.label')}</SectionLabel>
            <FitText as="h2" reference={enT('technology.title')} className={`${H2} text-white`}>
              {t('technology.title')}
            </FitText>
            <p className="m-0 text-[19px]">{t('technology.intro')}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 min-[960px]:grid-cols-2">
            <TechCard
              icon={<MonitorIcon />}
              title={t('technology.card1Title')}
              titleReference={enT('technology.card1Title')}
              body={t('technology.card1Body')}
              cta={t('buttons.bookCall')}
            />
            <TechCard
              icon={<LockIcon />}
              title={t('technology.card2Title')}
              titleReference={enT('technology.card2Title')}
              body={t('technology.card2Body')}
              cta={t('buttons.learnMore')}
            />
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section id="careers" className="border-t border-line py-20 min-[960px]:py-[120px]">
        <div className="wrap grid grid-cols-1 gap-10 min-[960px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[960px]:gap-24">
          <div className="flex flex-col gap-5">
            <SectionLabel>{t('careers.label')}</SectionLabel>
            <FitText as="h2" reference={enT('careers.title')} className={H2}>
              {t('careers.title')}
            </FitText>
          </div>
          <div className="flex flex-col gap-6 pt-2">
            <p className="m-0 text-[19px] text-ink-70">{t('careers.intro')}</p>
            <div className="flex flex-col gap-1.5 border-b border-line border-t-ink py-6 [border-top-width:1px]">
              <span className="text-[20px] font-medium">{t('careers.noOpen')}</span>
              <span className="text-[15px] text-muted">{t('careers.noOpenNote')}</span>
            </div>
            <Button
              to="mailto:[careers@domain.com.cy]"
              variant="navy"
              size="md"
              arrow
              className="self-start"
            >
              {t('buttons.sendCv')}
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white py-20 min-[960px]:py-[140px]">
        <div className="wrap grid grid-cols-1 gap-10 min-[960px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[960px]:gap-24">
          <div className="flex flex-col gap-6">
            <SectionLabel>{t('contact.label')}</SectionLabel>
            <FitText
              as="h2"
              reference={enT('contact.title')}
              className="m-0 text-[36px] font-medium leading-[1.0] tracking-[-0.045em] min-[960px]:text-[64px]"
            >
              {t('contact.title')}
            </FitText>
            <p className="m-0 text-[19px] text-muted">{t('contact.intro')}</p>
            <div className="mt-3 flex flex-col gap-1.5 border-t border-line pt-7">
              <span className="text-[13px] font-semibold tracking-[0.04em] text-num-grey">
                {t('contact.officeLabel')}
              </span>
              <span>{t('contact.officeAddress')}</span>
              <a
                href={`tel:${t('contact.phone').replace(/\s/g, '')}`}
                className="mt-2.5 font-semibold no-underline"
              >
                {t('contact.phone')}
              </a>
              <a href={`mailto:${t('contact.email')}`} className="font-semibold no-underline">
                {t('contact.email')}
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer variant="full" />
    </div>
  );
}

function TechCard({
  icon,
  title,
  titleReference,
  body,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  titleReference: string;
  body: string;
  cta: string;
}) {
  return (
    <div className="tech-card flex min-h-[320px] flex-col gap-5 rounded-md bg-navy-card p-11">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-navy">
        {icon}
      </span>
      <FitText
        reference={titleReference}
        className="text-[30px] font-medium tracking-[-0.03em] text-white"
      >
        {title}
      </FitText>
      <span className="grow">{body}</span>
      <AnchorLink
        to="/#contact"
        className="inline-flex min-h-[44px] items-center gap-2.5 font-semibold text-white no-underline"
      >
        {cta}
        <ArrowRight size={16} />
      </AnchorLink>
    </div>
  );
}
