import type { ReactNode } from 'react';
import { AnchorLink } from './AnchorLink';
import { ArrowRight } from './icons';

type Variant = 'navy' | 'white' | 'ink' | 'outlineHero' | 'outlineLight';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  'aria-label'?: string;
}

interface LinkProps extends BaseProps {
  to: string;
  type?: never;
  onClick?: never;
  disabled?: never;
}

interface ButtonProps extends BaseProps {
  to?: never;
  type: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

type Props = LinkProps | ButtonProps;

const VARIANT: Record<Variant, string> = {
  navy: 'bg-navy text-white',
  white: 'bg-white text-ink',
  ink: 'bg-ink text-white',
  outlineHero: 'bg-transparent text-white border border-[#8A7360]',
  outlineLight: 'bg-transparent text-white border border-white/40',
};

const SIZE: Record<Size, string> = {
  sm: 'px-[22px] py-3 text-[15px] min-h-[44px] gap-2.5',
  md: 'px-7 py-4 text-[15px] min-h-[52px] gap-2.5',
  lg: 'px-[30px] py-[18px] text-base min-h-[56px] gap-3',
  xl: 'px-[34px] py-[18px] text-base min-h-[56px] gap-3',
};

export default function Button(props: Props) {
  const { children, variant = 'navy', size = 'sm', arrow = false, className = '' } = props;

  const classes = [
    // `leading-none` keeps the button height driven by padding + min-height
    // only, never by the inherited body line-height — so it is identical in
    // every language and immune to webfont swap (FOUT) shifts.
    'inline-flex items-center justify-center rounded-pill font-semibold font-sans no-underline leading-none',
    'whitespace-nowrap transition-colors',
    VARIANT[variant],
    SIZE[size],
    className,
  ].join(' ');

  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={size === 'sm' || size === 'md' ? 16 : 18} />}
    </>
  );

  if ('type' in props && props.type) {
    return (
      <button
        type={props.type}
        onClick={props.onClick}
        disabled={props.disabled}
        aria-label={props['aria-label']}
        className={`${classes} cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {content}
      </button>
    );
  }

  return (
    <AnchorLink to={props.to} aria-label={props['aria-label']} className={classes}>
      {content}
    </AnchorLink>
  );
}
