import { Check } from './icons';

interface Props {
  name: string;
  desc: string;
}

// One item in a practice area's "How I can help" grid.
export default function ServiceItem({ name, desc }: Props) {
  return (
    <div className="flex items-start gap-[18px] border-b border-line py-6">
      <span className="mt-[3px] shrink-0 text-accent">
        <Check size={22} strokeWidth={1.8} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[19px] font-semibold tracking-[-0.01em]">{name}</span>
        <span className="text-[15px] text-muted">{desc}</span>
      </span>
    </div>
  );
}
