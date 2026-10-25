import type { Faq } from '../data/practiceAreas';

interface Props {
  items: Faq[];
}

// FAQ definition list used on the practice-area pages.
export default function FaqList({ items }: Props) {
  return (
    <dl className="m-0 border-t border-ink">
      {items.map((item) => (
        <div key={item.q} className="border-b border-line py-[26px]">
          <dt className="mb-2 text-xl font-semibold tracking-[-0.01em]">{item.q}</dt>
          <dd className="m-0 text-muted">{item.a}</dd>
        </div>
      ))}
    </dl>
  );
}
