import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router does not scroll on navigation. This restores sensible behaviour:
//  - a URL with a #hash smoothly scrolls that element into view (also when the
//    hash is reached from another route);
//  - a URL without a hash scrolls back to the top on route change.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Defer so the target has mounted after a cross-route navigation.
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo(0, 0);
        }
      });
      return () => cancelAnimationFrame(raf);
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);

  return null;
}
