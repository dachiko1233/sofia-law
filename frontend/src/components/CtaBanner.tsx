import Button from './Button';

interface Props {
  title: string;
  text: string;
  buttonLabel: string;
  to?: string;
}

// The dark navy call-to-action band near the foot of each practice-area page.
export default function CtaBanner({ title, text, buttonLabel, to = '/#contact' }: Props) {
  return (
    <section className="bg-navy py-[72px] text-slate-doc min-[960px]:py-28">
      <div className="wrap flex flex-wrap items-end justify-between gap-8">
        <div className="flex max-w-[680px] flex-col gap-4">
          <h2 className="m-0 text-[48px] font-medium leading-[1.08] tracking-[-0.04em] text-white">
            {title}
          </h2>
          <p className="m-0 text-[18px]">{text}</p>
        </div>
        <Button to={to} variant="white" size="lg">
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
