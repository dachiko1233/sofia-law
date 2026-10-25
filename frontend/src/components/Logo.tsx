import { useTranslation } from 'react-i18next';
import { AnchorLink } from './AnchorLink';

interface Props {
  to?: string;
  /** Font size in px (24 in headers, 22 in the footer). */
  size?: number;
  className?: string;
}

export default function Logo({ to = '/', size = 24, className = '' }: Props) {
  const { t } = useTranslation();
  return (
    <AnchorLink
      to={to}
      className={`flex items-baseline gap-2.5 no-underline ${className}`}
      aria-label={`${t('brand.name1')} ${t('brand.name2')}`}
    >
      <span className="font-bold tracking-logo text-white" style={{ fontSize: size }}>
        {t('brand.name1')}
      </span>
      <span className="font-light tracking-logo text-white" style={{ fontSize: size }}>
        {t('brand.name2')}
      </span>
    </AnchorLink>
  );
}
