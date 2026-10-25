import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
};

// A single link primitive used everywhere.
//  - "tel:", "mailto:", "http(s):" and "#" (bare) → plain <a>
//  - everything else (including "/#contact", "/expertise/x") → router <Link>,
//    with scroll-to-hash handled centrally by <ScrollManager />.
export const AnchorLink = forwardRef<HTMLAnchorElement, Props>(function AnchorLink(
  { to, children, ...rest },
  ref
) {
  const isPlain =
    to.startsWith('tel:') ||
    to.startsWith('mailto:') ||
    to.startsWith('http') ||
    to.startsWith('#');

  if (isPlain) {
    return (
      <a ref={ref} href={to} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} to={to} {...rest}>
      {children}
    </Link>
  );
});
