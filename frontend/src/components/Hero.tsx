import { useTranslation } from 'react-i18next';
import SectionLabel from './SectionLabel';
import Button from './Button';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section
      id="top"
      className="relative flex min-h-[680px] flex-col justify-center pb-[140px] pt-20 min-[960px]:min-h-[760px] min-[960px]:pt-[120px]"
    >
      <div className="wrap relative w-full">
        <div className="flex max-w-[760px] flex-col gap-8">
          <SectionLabel className="text-slate-label" dot>
            {t('hero.eyebrow')}
          </SectionLabel>
          <h1 className="m-0 text-[52px] font-medium leading-[1.0] tracking-[-0.045em] text-white min-[960px]:text-[72px]">
            {t('hero.title')}
          </h1>
          <p className="m-0 max-w-[560px] text-[19px] text-slate-light">{t('hero.subtitle')}</p>
          <div className="flex flex-wrap gap-3.5">
            <Button to="/#expertise" variant="white" size="lg" arrow>
              {t('buttons.exploreExpertise')}
            </Button>
            <Button to="/#about" variant="outlineHero" size="lg">
              {t('buttons.aboutMe')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
