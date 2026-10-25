// Practice-area content for all 8 areas, keyed by language. The English map
// below is the canonical structure; Greek and Russian live in sibling files and
// are merged by the resolver, falling back to English for any missing entry.
// [square-bracket] placeholders are kept verbatim and must NOT be translated.
import type { Language } from '../i18n';
import { PRACTICE_AREAS_GR } from './practiceAreas.gr';
import { PRACTICE_AREAS_RU } from './practiceAreas.ru';

export interface Service {
  name: string;
  desc: string;
}

export interface WhyCard {
  num: string;
  title: string;
  desc: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface PracticeAreaContent {
  title: string;
  homeBlurb: string;
  intro: string;
  overviewTitle: string;
  overviewParas: string[];
  servicesTitle: string;
  services: Service[];
  approachTitle: string;
  why: WhyCard[];
  faqTitle: string;
  faqs: Faq[];
  ctaTitle: string;
  ctaText: string;
  metaTitle: string;
  metaDescription: string;
}

export type PracticeAreaContentMap = Record<string, PracticeAreaContent>;

export interface PracticeArea extends PracticeAreaContent {
  slug: string;
  num: string;
}

// Fixed display order and numbering (identical across languages).
export const PRACTICE_AREA_META: { slug: string; num: string }[] = [
  {
    slug: 'corporate',
    num: '01',
  },
  {
    slug: 'litigation',
    num: '02',
  },
  {
    slug: 'criminal',
    num: '03',
  },
  {
    slug: 'real-estate',
    num: '04',
  },
  {
    slug: 'family',
    num: '05',
  },
  {
    slug: 'employment',
    num: '06',
  },
  {
    slug: 'tech-ip',
    num: '07',
  },
  {
    slug: 'immigration',
    num: '08',
  },
];

export const PRACTICE_AREA_SLUGS = PRACTICE_AREA_META.map((m) => m.slug);

export const PRACTICE_AREAS_EN: PracticeAreaContentMap = {
  corporate: {
    title: 'Corporate & Commercial',
    homeBlurb: 'Formation, contracts, M&A support and governance.',
    intro:
      'Practical legal support for companies, founders and investors in Cyprus — from setting up a business to the contracts and decisions that keep it running.',
    overviewTitle: 'Legal structure that lets your business grow.',
    overviewParas: [
      'Whether you are registering a new Cyprus company, bringing in a partner or signing a major supplier agreement, the right documents protect you from costly disputes later.',
      'I work with start-ups, family businesses and international clients doing business through Cyprus, giving clear advice in plain language and drafting agreements that match how your business actually operates. [Adjust to your own experience and typical clients.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Company formation',
        desc: 'Registering Cyprus companies, registered office and initial corporate documents.',
      },
      {
        name: 'Shareholder agreements',
        desc: 'Clear rules on ownership, decision-making, exits and deadlock.',
      },
      {
        name: 'Commercial contracts',
        desc: 'Drafting and reviewing supply, distribution, service and agency agreements.',
      },
      {
        name: 'Corporate governance',
        desc: 'Board and shareholder resolutions, annual compliance and corporate changes.',
      },
      {
        name: 'Mergers & acquisitions support',
        desc: 'Due diligence, share purchase agreements and closing documents.',
      },
      {
        name: 'Restructuring',
        desc: 'Share transfers, capital changes, conversions and strike-offs.',
      },
      {
        name: 'Partnership disputes',
        desc: 'Resolving disagreements between partners and shareholders.',
      },
      {
        name: 'Ongoing legal support',
        desc: 'A retained adviser for day-to-day business questions.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'Direct access',
        desc: 'You speak with me personally from the first call to the final result.',
      },
      {
        num: '02',
        title: 'Clear fees',
        desc: 'Fixed or hourly fees agreed in writing before any work begins.',
      },
      {
        num: '03',
        title: 'Three languages',
        desc: 'Advice and documents in English, Greek or Russian.',
      },
    ],
    faqTitle: 'Common questions',
    faqs: [
      {
        q: 'How long does it take to register a company in Cyprus?',
        a: 'Timing depends on name approval and the documents required. I will give you a realistic timeline once we discuss your structure. [Confirm your usual timeframe]',
      },
      {
        q: 'Do I need a shareholder agreement?',
        a: 'If a company has more than one owner, a shareholder agreement is strongly recommended — it sets out what happens when owners disagree or want to leave.',
      },
      {
        q: 'Can you review a contract I have already received?',
        a: 'Yes. I can review it, explain the risks and suggest changes before you sign.',
      },
    ],
    ctaTitle: 'Discuss your business matter',
    ctaText: 'The first 30-minute consultation is free and confidential.',
    metaTitle: 'Corporate & Commercial — Polykarpou Law',
    metaDescription:
      'Practical legal support for companies, founders and investors in Cyprus — from setting up a business to the contracts and decisions that keep it running.',
  },
  litigation: {
    title: 'Litigation & Dispute Resolution',
    homeBlurb: 'Civil and commercial disputes in all court instances.',
    intro:
      'Firm, well-prepared representation before the Cyprus courts — and, where it serves you better, a negotiated settlement that avoids a long trial.',
    overviewTitle: 'A clear strategy from the first letter to the final judgment.',
    overviewParas: [
      'Disputes cost time, money and peace of mind. I start by assessing the strength of your position honestly, so you can decide whether to negotiate, mediate or go to court.',
      'I represent individuals and companies in civil and commercial claims, handle urgent interim applications, and follow through to enforcement so a judgment in your favour turns into a real result. [Adjust to your own experience.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Civil claims',
        desc: 'Bringing and defending claims before the District Courts of Cyprus.',
      },
      {
        name: 'Commercial disputes',
        desc: 'Breach of contract, unpaid invoices and disputes between businesses.',
      },
      {
        name: 'Debt recovery',
        desc: 'Demand letters, legal proceedings and recovery of what you are owed.',
      },
      {
        name: 'Interim orders',
        desc: 'Urgent applications to freeze assets or prevent harmful action.',
      },
      {
        name: 'Enforcement of judgments',
        desc: 'Turning a court decision into payment or action.',
      },
      {
        name: 'Appeals',
        desc: 'Challenging or defending first-instance decisions on appeal.',
      },
      {
        name: 'Mediation & negotiation',
        desc: 'Resolving disputes out of court where that is in your interest.',
      },
      {
        name: 'Arbitration',
        desc: 'Representation in domestic and international arbitration proceedings.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'Direct access',
        desc: 'You speak with me personally from the first call to the final result.',
      },
      {
        num: '02',
        title: 'Clear fees',
        desc: 'Fixed or hourly fees agreed in writing before any work begins.',
      },
      {
        num: '03',
        title: 'Three languages',
        desc: 'Advice and documents in English, Greek or Russian.',
      },
    ],
    faqTitle: 'Common questions',
    faqs: [
      {
        q: 'Should I go to court or try to settle?',
        a: 'It depends on the evidence, the costs and what you want to achieve. After reviewing your documents I will explain the realistic options so you can decide.',
      },
      {
        q: 'How long does a civil case take in Cyprus?',
        a: 'Timeframes vary widely with the type of case and the court’s schedule. I will give you an honest estimate at the start and keep you updated as it progresses.',
      },
      {
        q: 'What should I do if I receive a court claim?',
        a: 'Contact a lawyer straight away — there are strict deadlines for responding, and missing them can lead to a judgment against you.',
      },
    ],
    ctaTitle: 'Facing a dispute? Let’s talk.',
    ctaText: 'Court deadlines can be short — the sooner we speak, the more options you have.',
    metaTitle: 'Litigation & Dispute Resolution — Polykarpou Law',
    metaDescription:
      'Firm, well-prepared representation before the Cyprus courts — and, where it serves you better, a negotiated settlement that avoids a long trial.',
  },
  criminal: {
    title: 'Criminal Defense',
    homeBlurb: 'From investigation and arrest through trial and appeal.',
    intro:
      'Calm, discreet and determined defence at every stage — from the first police questioning through trial and appeal.',
    overviewTitle: 'Your rights protected from the very first moment.',
    overviewParas: [
      'Being questioned, arrested or charged is stressful. What you say and do in the first hours can shape the whole case, so it is important to have a lawyer beside you early.',
      'I explain your rights, attend police interviews, challenge remand applications and build a careful defence based on the evidence. Everything you tell me stays strictly confidential. [Adjust to your own experience.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Police questioning',
        desc: 'Attending interviews and advising you on your rights before you speak.',
      },
      {
        name: 'Arrest & remand hearings',
        desc: 'Challenging detention and applying for release on conditions.',
      },
      {
        name: 'Defence at trial',
        desc: 'Preparing and presenting your defence before the criminal courts.',
      },
      {
        name: 'Appeals',
        desc: 'Appealing convictions and sentences where there are grounds.',
      },
      {
        name: 'Financial & white-collar offences',
        desc: 'Fraud, money-laundering and other economic allegations.',
      },
      {
        name: 'Traffic & driving offences',
        desc: 'Representation for serious road-traffic charges.',
      },
      {
        name: 'Victims of crime',
        desc: 'Supporting victims through the complaint and court process.',
      },
      {
        name: 'Extradition & European Arrest Warrants',
        desc: 'Advice and representation in cross-border criminal matters.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'Available when it matters',
        desc: 'Urgent matters such as arrests can be handled outside office hours.',
      },
      {
        num: '02',
        title: 'Strict confidentiality',
        desc: 'Everything you share is protected by professional secrecy.',
      },
      {
        num: '03',
        title: 'Three languages',
        desc: 'Advice in English, Greek or Russian, so nothing is lost in translation.',
      },
    ],
    faqTitle: 'Common questions',
    faqs: [
      {
        q: 'Do I have to answer police questions without a lawyer?',
        a: 'You have the right to consult a lawyer. It is usually wise to speak with one before giving a statement.',
      },
      {
        q: 'What happens at a remand hearing?',
        a: 'The court decides whether you can be held in custody while the investigation continues. A lawyer can challenge the request and argue for your release.',
      },
      {
        q: 'Can you help a foreign national arrested in Cyprus?',
        a: 'Yes. I can advise in English, Greek or Russian and coordinate with family or consular contacts where needed.',
      },
    ],
    ctaTitle: 'Need a defence lawyer now?',
    ctaText: 'Call directly for urgent matters. Your conversation is confidential.',
    metaTitle: 'Criminal Defense — Polykarpou Law',
    metaDescription:
      'Calm, discreet and determined defence at every stage — from the first police questioning through trial and appeal.',
  },
  'real-estate': {
    title: 'Real Estate & Construction',
    homeBlurb: 'Due diligence, transactions, registration and disputes.',
    intro:
      'Buying, selling or building property in Cyprus with confidence — careful checks, clear contracts and protection for your investment.',
    overviewTitle: 'Know exactly what you are buying.',
    overviewParas: [
      'Property is often the largest purchase people make. Before you pay a deposit, I check the title, encumbrances and permits so there are no surprises after the keys are handed over.',
      'I advise local and foreign buyers, sellers, developers and landlords in Limassol and across Cyprus — from the first offer to registration of the contract and the transfer of title. [Adjust to your own experience.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Property due diligence',
        desc: 'Checking title deeds, mortgages, encumbrances and building permits.',
      },
      {
        name: 'Sale & purchase contracts',
        desc: 'Drafting and negotiating terms that protect buyer or seller.',
      },
      {
        name: 'Land Registry procedures',
        desc: 'Depositing contracts and handling the transfer of title.',
      },
      {
        name: 'Off-plan purchases',
        desc: 'Reviewing developer contracts, payment plans and guarantees.',
      },
      {
        name: 'Leases',
        desc: 'Residential and commercial lease agreements and renewals.',
      },
      {
        name: 'Construction contracts',
        desc: 'Agreements with contractors, architects and developers.',
      },
      {
        name: 'Property disputes',
        desc: 'Title problems, boundary issues, defects and delays.',
      },
      {
        name: 'Inheritance of property',
        desc: 'Transferring inherited property and resolving co-ownership.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'Thorough checks',
        desc: 'Title, mortgages, permits and planning reviewed before you commit.',
      },
      {
        num: '02',
        title: 'Clear fees',
        desc: 'A fixed fee for standard purchases, agreed in writing up front.',
      },
      {
        num: '03',
        title: 'Buying from abroad',
        desc: 'Power of attorney and remote signing so you need not travel for every step.',
      },
    ],
    faqTitle: 'Common questions',
    faqs: [
      {
        q: 'Why should I check the title deed before buying?',
        a: 'The title deed shows who owns the property and whether there are mortgages or other charges. Problems found after payment are far harder to fix.',
      },
      {
        q: 'Can a foreign buyer purchase property in Cyprus?',
        a: 'Yes, though some non-EU buyers need permission for certain purchases. I can explain what applies in your case. [Confirm current rules before publishing]',
      },
      {
        q: 'What is depositing the sale contract at the Land Registry?',
        a: 'Depositing the signed contract helps protect the buyer’s rights until title is transferred. I handle this step for you.',
      },
    ],
    ctaTitle: 'Planning a property purchase?',
    ctaText: 'Speak to me before you sign or pay a deposit.',
    metaTitle: 'Real Estate & Construction — Polykarpou Law',
    metaDescription:
      'Buying, selling or building property in Cyprus with confidence — careful checks, clear contracts and protection for your investment.',
  },
  family: {
    title: 'Family & Inheritance',
    homeBlurb: 'Divorce, custody, support and succession matters.',
    intro:
      'Sensitive, practical guidance through divorce, children’s arrangements and inheritance — with your family’s future always in focus.',
    overviewTitle: 'Support for life’s hardest moments.',
    overviewParas: [
      'Family matters are personal. I listen first, explain your options clearly and aim for solutions that reduce conflict — while standing firm in court when that is needed.',
      'I represent clients before the Family Courts of Cyprus in divorce, parental care, maintenance and property claims, and help families plan and settle estates. [Adjust to your own experience.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Divorce',
        desc: 'Guidance and representation through divorce proceedings.',
      },
      {
        name: 'Parental care & custody',
        desc: 'Agreeing or deciding where children live and how decisions are made.',
      },
      {
        name: 'Contact arrangements',
        desc: 'Securing regular time between children and the other parent.',
      },
      {
        name: 'Child & spousal maintenance',
        desc: 'Claims for, and changes to, maintenance payments.',
      },
      {
        name: 'Property relations',
        desc: 'Claims over property acquired during the marriage.',
      },
      {
        name: 'Prenuptial agreements',
        desc: 'Clear agreements before marriage about property and finances.',
      },
      {
        name: 'Wills',
        desc: 'Drafting wills so your wishes are clear and legally valid.',
      },
      {
        name: 'Estate administration',
        desc: 'Letters of administration, probate and distribution of estates.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'Children first',
        desc: 'Arrangements built around your children’s wellbeing and stability.',
      },
      {
        num: '02',
        title: 'Discreet & respectful',
        desc: 'Your private life handled with complete confidentiality.',
      },
      {
        num: '03',
        title: 'International families',
        desc: 'Experience with cross-border cases and clients living abroad.',
      },
    ],
    faqTitle: 'Common questions',
    faqs: [
      {
        q: 'Do we have to go to court to divorce?',
        a: 'In Cyprus a divorce is granted by the Family Court, but many related issues — such as children and property — can be agreed between the parties to reduce conflict and cost.',
      },
      {
        q: 'Who decides where the children live?',
        a: 'Parents can agree, and the court can approve the arrangement. If they cannot agree, the court decides based on the best interests of the child.',
      },
      {
        q: 'What happens if someone dies without a will?',
        a: 'The estate is distributed according to the rules of intestate succession. An administrator is appointed to collect and distribute the assets, and I can guide you through that process.',
      },
    ],
    ctaTitle: 'Talk it through, in confidence',
    ctaText: 'A first conversation costs nothing and commits you to nothing.',
    metaTitle: 'Family & Inheritance — Polykarpou Law',
    metaDescription:
      'Sensitive, practical guidance through divorce, children’s arrangements and inheritance — with your family’s future always in focus.',
  },
  employment: {
    title: 'Employment',
    homeBlurb: 'Contracts, dismissals and workplace disputes.',
    intro:
      'Clear advice for employees and employers on contracts, dismissals and workplace disputes under Cyprus employment law.',
    overviewTitle: 'Fair treatment at work, on both sides.',
    overviewParas: [
      'If you have been dismissed, are owed wages or are facing a dispute with your employer, I explain your rights and the steps to protect them.',
      'For employers, I prepare contracts and policies that comply with the law and help handle terminations and redundancies correctly — before they turn into claims. [Adjust to your own experience.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Unfair dismissal',
        desc: 'Claims for compensation when employment is terminated unlawfully.',
      },
      {
        name: 'Redundancy',
        desc: 'Advice on redundancy procedures and payments for both sides.',
      },
      {
        name: 'Unpaid wages & benefits',
        desc: 'Recovering salary, bonuses and other amounts owed.',
      },
      {
        name: 'Employment contracts',
        desc: 'Drafting and reviewing contracts, including non-compete terms.',
      },
      {
        name: 'Workplace policies',
        desc: 'Handbooks, disciplinary and data protection policies for employers.',
      },
      {
        name: 'Discrimination & harassment',
        desc: 'Protecting employees and guiding employers on their obligations.',
      },
      {
        name: 'Settlement agreements',
        desc: 'Negotiating fair exit terms and reviewing proposed settlements.',
      },
      {
        name: 'Employment Disputes Tribunal',
        desc: 'Representation in claims before the tribunal.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'Fast first assessment',
        desc: 'Employment claims have deadlines — I review your case quickly.',
      },
      {
        num: '02',
        title: 'Clear fees',
        desc: 'Fixed or hourly fees agreed in writing before any work begins.',
      },
      {
        num: '03',
        title: 'Prevention first',
        desc: 'For employers, the right documents avoid most disputes before they start.',
      },
    ],
    faqTitle: 'Common questions',
    faqs: [
      {
        q: 'I have been dismissed — what should I do first?',
        a: 'Keep all documents, including your contract, payslips and any termination letter, and get advice quickly. Strict time limits can apply to employment claims.',
      },
      {
        q: 'Am I entitled to compensation?',
        a: 'That depends on your length of service, the reason given and the procedure followed. After reviewing your documents I can tell you what you may be entitled to.',
      },
      {
        q: 'Do you advise employers as well?',
        a: 'Yes. I help employers with contracts, policies, disciplinary procedures and terminations so that they comply with the law.',
      },
    ],
    ctaTitle: 'Problem at work?',
    ctaText: 'Get clear advice on your rights before you sign or respond to anything.',
    metaTitle: 'Employment — Polykarpou Law',
    metaDescription:
      'Clear advice for employees and employers on contracts, dismissals and workplace disputes under Cyprus employment law.',
  },
  'tech-ip': {
    title: 'Tech, IP & Data Protection',
    homeBlurb: 'Trademarks, IT contracts and personal data compliance.',
    intro:
      'Protecting your brand, your ideas and your customers’ data — with practical advice for tech companies and digital businesses.',
    overviewTitle: 'Your ideas are assets. Protect them.',
    overviewParas: [
      'Limassol is home to a growing number of tech and online businesses. Registering your trademarks, owning your code and handling personal data correctly are essential from day one.',
      'I help companies register and enforce intellectual property, draft technology contracts and comply with the GDPR — explained in plain language, without unnecessary jargon. [Adjust to your own experience.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Trademark registration',
        desc: 'Searches and filings in Cyprus and for EU trademarks.',
      },
      {
        name: 'IP protection & enforcement',
        desc: 'Acting against infringement of your brand, content or designs.',
      },
      {
        name: 'Software & IT contracts',
        desc: 'Development, licensing and SaaS agreements.',
      },
      {
        name: 'Website terms & policies',
        desc: 'Terms of use, privacy and cookie policies for websites and apps.',
      },
      {
        name: 'GDPR compliance',
        desc: 'Data protection audits, records and staff guidance.',
      },
      {
        name: 'Data processing agreements',
        desc: 'Contracts with suppliers who handle personal data for you.',
      },
      {
        name: 'Data breaches',
        desc: 'Responding to incidents and notifying the authorities where required.',
      },
      {
        name: 'IP in employment',
        desc: 'Making sure your company owns what employees and contractors create.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'Understands tech',
        desc: 'Comfortable with SaaS, apps, platforms and online business models.',
      },
      {
        num: '02',
        title: 'Clear fees',
        desc: 'Fixed fees for registrations and standard documents.',
      },
      {
        num: '03',
        title: 'Three languages',
        desc: 'Contracts and policies in English, Greek or Russian.',
      },
    ],
    faqTitle: 'Common questions',
    faqs: [
      {
        q: 'Should I register my trademark in Cyprus or the EU?',
        a: 'It depends on where you trade. A Cyprus mark covers Cyprus only, while an EU trademark covers all EU member states. I can recommend the right route for your business.',
      },
      {
        q: 'Does the GDPR apply to my small business?',
        a: 'If you process personal data of people in the EU — customers, employees or newsletter subscribers — the GDPR generally applies, whatever the size of the business.',
      },
      {
        q: 'Who owns code written by a freelancer?',
        a: 'Without a written agreement, ownership may not pass to you automatically. A clear contract should assign the rights to your company.',
      },
    ],
    ctaTitle: 'Protect your brand and data',
    ctaText: 'Start with a quick review of where you stand today.',
    metaTitle: 'Tech, IP & Data Protection — Polykarpou Law',
    metaDescription:
      'Protecting your brand, your ideas and your customers’ data — with practical advice for tech companies and digital businesses.',
  },
  immigration: {
    title: 'Immigration & Residency',
    homeBlurb: 'Residence permits, work permits and relocation to Cyprus.',
    intro:
      'Moving to Cyprus to live, work or invest — clear guidance on permits, applications and every step of the process.',
    overviewTitle: 'A smooth move to Cyprus.',
    overviewParas: [
      'Every year many families, professionals and investors relocate to Limassol. The right permit depends on your nationality, your plans and your income — and a well-prepared application saves months.',
      'I advise on the available routes, prepare and submit applications, and stay with you through renewals and family reunification. Advice is available in English, Greek and Russian. [Adjust to your own experience.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Temporary residence permits',
        desc: 'Visitor, employment and other temporary permits for non-EU nationals.',
      },
      {
        name: 'Permanent residence',
        desc: 'Applications for permanent residence, including through investment.',
      },
      {
        name: 'Work permits',
        desc: 'Permits for employees and support for companies hiring from abroad.',
      },
      {
        name: 'Digital nomad visas',
        desc: 'Residence for remote workers employed outside Cyprus.',
      },
      {
        name: 'EU citizens’ registration',
        desc: 'Registration certificates for EU nationals and their family members.',
      },
      {
        name: 'Family reunification',
        desc: 'Bringing spouses and children to join you in Cyprus.',
      },
      {
        name: 'Citizenship by naturalisation',
        desc: 'Assessing eligibility and preparing naturalisation applications.',
      },
      {
        name: 'Refusals & appeals',
        desc: 'Challenging refused applications and deportation decisions.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'The right route',
        desc: 'An honest view of which permit fits your situation best.',
      },
      {
        num: '02',
        title: 'Complete applications',
        desc: 'Documents checked carefully to avoid delays and refusals.',
      },
      {
        num: '03',
        title: 'Three languages',
        desc: 'Guidance in English, Greek or Russian from start to finish.',
      },
    ],
    faqTitle: 'Common questions',
    faqs: [
      {
        q: 'Which permit is right for me?',
        a: 'That depends on your nationality, whether you will work in Cyprus, and your income or investment. I review your situation and recommend the most suitable route. [Confirm current schemes before publishing]',
      },
      {
        q: 'Can my family come with me?',
        a: 'In many cases spouses and children can apply to join you. The conditions depend on the type of permit you hold.',
      },
      {
        q: 'How long does an application take?',
        a: 'Processing times vary by permit type and the authorities’ workload. A complete, well-prepared file is the best way to avoid delays.',
      },
    ],
    ctaTitle: 'Planning your move to Cyprus?',
    ctaText: 'Tell me your situation and I will outline the options that fit.',
    metaTitle: 'Immigration & Residency — Polykarpou Law',
    metaDescription:
      'Moving to Cyprus to live, work or invest — clear guidance on permits, applications and every step of the process.',
  },
};

const CONTENT: Record<Language, PracticeAreaContentMap> = {
  en: PRACTICE_AREAS_EN,
  gr: PRACTICE_AREAS_GR,
  ru: PRACTICE_AREAS_RU,
};

function contentFor(slug: string, lang: Language): PracticeAreaContent {
  return CONTENT[lang]?.[slug] ?? PRACTICE_AREAS_EN[slug];
}

// Returns all areas in display order, localized to the given language.
export function getPracticeAreas(lang: Language = 'en'): PracticeArea[] {
  return PRACTICE_AREA_META.map((m) => ({ ...m, ...contentFor(m.slug, lang) }));
}

// Returns a single area by slug, localized to the given language.
export function getPracticeArea(
  slug: string | undefined,
  lang: Language = 'en'
): PracticeArea | undefined {
  const m = PRACTICE_AREA_META.find((x) => x.slug === slug);
  if (!m) return undefined;
  return { ...m, ...contentFor(m.slug, lang) };
}
