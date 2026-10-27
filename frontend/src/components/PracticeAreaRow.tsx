import { AnchorLink } from './AnchorLink';
import { ArrowRight } from './icons';
import FitText from './FitText';

interface Props {
  num: string;
  title: string;
  /** English title — the reference height this row's title must match. */
  titleReference: string;
  blurb: string;
  slug: string;
}

// One row in the home "Expertise" list. Hover behaviour (shift + recolour) is
// defined by the .exp-row rules in index.css.
export default function PracticeAreaRow({ num, title, titleReference, blurb, slug }: Props) {
  return (
    <AnchorLink
      to={`/expertise/${slug}`}
      className="exp-row flex min-h-[44px] items-center gap-7 border-b border-line py-[30px] text-ink no-underline"
    >
      <span className="w-7 text-sm font-semibold text-num-grey">{num}</span>
      <span className="flex grow flex-col gap-1">
        <FitText
          reference={titleReference}
          className="text-[26px] font-medium leading-[1.2] tracking-[-0.02em]"
        >
          {title}
        </FitText>
        <span className="text-[15px] text-muted">{blurb}</span>
      </span>
      <ArrowRight size={22} strokeWidth={1.6} className="arr" />
    </AnchorLink>
  );
}
