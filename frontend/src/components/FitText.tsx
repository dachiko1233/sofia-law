import { useLayoutEffect, useRef, type CSSProperties, type ElementType } from 'react';

interface Props {
  /** The text to display (already translated to the current language). */
  children: string;
  /** The English text — the reference height every language must match. */
  reference: string;
  /** Element to render (h1, h2, span…). Defaults to span. */
  as?: ElementType;
  className?: string;
  /** Lower bound for shrinking, relative to the design font-size (0–1). */
  minScale?: number;
}

const HIDDEN: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'block',
  visibility: 'hidden',
  pointerEvents: 'none',
  margin: 0,
  whiteSpace: 'normal',
  zIndex: -1,
};

// Keeps a heading/label the SAME height in every language. English is the
// reference and always renders at its design size; longer translations
// (Greek/Russian) are shrunk just enough to occupy the same number of lines as
// the English text at the current width — so the layout never shifts when the
// language changes. The English design is never altered.
export default function FitText({
  children,
  reference,
  as: Tag = 'span',
  className = '',
  minScale = 0.5,
}: Props) {
  const el = useRef<HTMLElement>(null);
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = el.current;
    const refNode = ref.current;
    if (!node || !refNode) return;

    const fit = () => {
      // Reset to the design size so we measure from a known baseline.
      node.style.fontSize = '';
      node.style.height = '';
      node.style.overflow = '';
      const base = parseFloat(getComputedStyle(node).fontSize);
      if (!base) return;

      // English already fits by definition — leave it at its design size.
      if (children === reference) return;

      // Measure the English reference at the same width and design size.
      refNode.style.width = `${node.getBoundingClientRect().width}px`;
      refNode.style.fontSize = `${base}px`;
      const target = refNode.getBoundingClientRect().height;

      // If the translation is taller (wraps to more lines), binary-search the
      // largest font-size that still fits the English height.
      if (node.getBoundingClientRect().height > target + 0.5) {
        let lo = base * minScale;
        let hi = base;
        for (let i = 0; i < 14; i++) {
          const mid = (lo + hi) / 2;
          node.style.fontSize = `${mid}px`;
          if (node.getBoundingClientRect().height <= target + 0.5) lo = mid;
          else hi = mid;
        }
        node.style.fontSize = `${lo}px`;
      }

      // Lock the box to the exact English height. A shrunk (or shorter)
      // translation then occupies the same vertical space as English, so the
      // element is identical across languages and the layout never shifts.
      node.style.height = `${target}px`;
      node.style.overflow = 'hidden';
    };

    fit();
    // Re-fit when the column width changes or the webfont finishes loading.
    // (ResizeObserver / document.fonts are absent in jsdom — guard both.)
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && node.parentElement) {
      ro = new ResizeObserver(fit);
      ro.observe(node.parentElement);
    }
    document.fonts?.ready?.then(fit).catch(() => {});
    return () => ro?.disconnect();
  }, [children, reference, minScale]);

  return (
    <>
      <Tag ref={el} className={className}>
        {children}
      </Tag>
      <span ref={ref} className={className} style={HIDDEN} aria-hidden="true">
        {reference}
      </span>
    </>
  );
}
