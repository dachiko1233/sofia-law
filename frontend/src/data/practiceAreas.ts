// Practice-area content for all 9 areas, keyed by language. The English map
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
// Ordered alphabetically by English title.
export const PRACTICE_AREA_META: { slug: string; num: string }[] = [
  {
    slug: 'banking-finance',
    num: '01',
  },
  {
    slug: 'corporate',
    num: '02',
  },
  {
    slug: 'employment',
    num: '03',
  },
  {
    slug: 'family',
    num: '04',
  },
  {
    slug: 'immigration',
    num: '05',
  },
  {
    slug: 'private-client',
    num: '06',
  },
  {
    slug: 'real-estate',
    num: '07',
  },
  {
    slug: 'sports-law',
    num: '08',
  },
  {
    slug: 'tech-ip',
    num: '09',
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
  'sports-law': {
    title: 'Sports Law',
    homeBlurb: 'Contracts, transfers, disciplinary and regulatory matters.',
    intro:
      'Legal support for athletes, clubs, agents and sports bodies in Cyprus — from playing and sponsorship contracts to disciplinary and regulatory disputes.',
    overviewTitle: 'Protecting careers and clubs on and off the field.',
    overviewParas: [
      'Sport is a business as much as a passion. A clear contract, the right image-rights terms and proper handling of disciplinary matters protect both the athlete’s career and the club’s interests.',
      'I advise players, coaches, agents and clubs on contracts, transfers, sponsorship and disputes, and represent them before sporting bodies and dispute panels. [Adjust to your own experience and typical clients.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Playing & coaching contracts',
        desc: 'Drafting and negotiating contracts for athletes and coaching staff.',
      },
      {
        name: 'Transfers & loans',
        desc: 'Transfer agreements, loan deals and the paperwork behind them.',
      },
      {
        name: 'Sponsorship & image rights',
        desc: 'Endorsement, sponsorship and image-rights agreements.',
      },
      {
        name: 'Agent & representation agreements',
        desc: 'Agreements between athletes and their agents or intermediaries.',
      },
      {
        name: 'Disciplinary proceedings',
        desc: 'Representation in disciplinary and misconduct hearings.',
      },
      {
        name: 'Sports disputes & arbitration',
        desc: 'Claims before federations, tribunals and sports arbitration bodies.',
      },
      {
        name: 'Club governance & regulation',
        desc: 'Advising clubs and associations on rules, licensing and compliance.',
      },
      {
        name: 'Doping & eligibility',
        desc: 'Advice and defence in anti-doping and eligibility matters.',
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
        q: 'Can you review a contract before I sign with a club or agent?',
        a: 'Yes. I can review the terms, explain the obligations and risks, and negotiate changes before you commit.',
      },
      {
        q: 'What can I do about a disciplinary decision?',
        a: 'Many sporting bodies have internal appeal and arbitration procedures with strict deadlines. I can advise on the grounds and represent you through the process.',
      },
      {
        q: 'Do you advise both athletes and clubs?',
        a: 'Yes — on either side, provided there is no conflict of interest in the specific matter.',
      },
    ],
    ctaTitle: 'Discuss your sports matter',
    ctaText: 'The first 30-minute consultation is free and confidential.',
    metaTitle: 'Sports Law — Polykarpou Law',
    metaDescription:
      'Legal support for athletes, clubs, agents and sports bodies in Cyprus — from playing and sponsorship contracts to disciplinary and regulatory disputes.',
  },
  'banking-finance': {
    title: 'Banking & Finance',
    homeBlurb: 'Lending, security, regulation and financial agreements.',
    intro:
      'Clear legal support for banking, lending and financial transactions in Cyprus — from loan and security documents to regulatory compliance.',
    overviewTitle: 'Financing that is properly documented and secure.',
    overviewParas: [
      'Whether you are borrowing, lending or structuring a financial transaction, the terms of the facility and the security behind it decide how protected you are if things go wrong.',
      'I advise borrowers, lenders and businesses on loan agreements, security, refinancing and regulatory questions — explained in plain language, with documents that match the deal in front of you. [Adjust to your own experience and typical clients.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'Loan & facility agreements',
        desc: 'Drafting and reviewing credit facilities, term loans and overdrafts.',
      },
      {
        name: 'Security & collateral',
        desc: 'Mortgages, pledges, guarantees and assignments to secure lending.',
      },
      {
        name: 'Refinancing & restructuring',
        desc: 'Renegotiating existing debt and restructuring facilities.',
      },
      {
        name: 'Loan recovery & enforcement',
        desc: 'Enforcing security and recovering amounts owed to lenders.',
      },
      {
        name: 'Banking regulation',
        desc: 'Licensing and compliance for banks, EMIs and payment institutions.',
      },
      {
        name: 'Financial services agreements',
        desc: 'Account, custody, factoring and intermediary agreements.',
      },
      {
        name: 'AML & compliance',
        desc: 'Anti-money-laundering procedures, policies and due diligence.',
      },
      {
        name: 'Debt & facility disputes',
        desc: 'Disputes between borrowers, guarantors and financial institutions.',
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
        q: 'Can you review a loan agreement before I sign?',
        a: 'Yes. I can review the facility and security documents, explain the risks and the key obligations, and suggest changes before you commit.',
      },
      {
        q: 'What security can a lender take over a Cyprus asset?',
        a: 'Common forms include mortgages over property, pledges over shares and bank accounts, and personal or corporate guarantees. I can advise which fits your transaction.',
      },
      {
        q: 'Do you advise both borrowers and lenders?',
        a: 'Yes — on either side of a transaction, provided there is no conflict of interest in the specific matter.',
      },
    ],
    ctaTitle: 'Discuss your financing matter',
    ctaText: 'The first 30-minute consultation is free and confidential.',
    metaTitle: 'Banking & Finance — Polykarpou Law',
    metaDescription:
      'Clear legal support for banking, lending and financial transactions in Cyprus — from loan and security documents to regulatory compliance.',
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
  'private-client': {
    title: 'Private Client',
    homeBlurb: 'Wealth, succession, trusts and tax planning for individuals.',
    intro:
      'Discreet, personal advice for individuals and families in Cyprus and abroad — from wills and succession to trusts, tax and relocation.',
    overviewTitle: 'Your wealth and your family, carefully planned.',
    overviewParas: [
      'Looking after personal and family wealth means thinking ahead — about succession, tax and the structures that protect what you have built, at home and across borders.',
      'I advise individuals, families and private banks on wills, estates, trusts, tax planning and relocation to Cyprus, coordinating the legal, personal and cross-border sides of each matter. [Adjust to your own experience and typical clients.]',
    ],
    servicesTitle: 'How I can help',
    services: [
      {
        name: 'International tax planning',
        desc: 'Cross-border tax structuring and compliance for private clients.',
      },
      {
        name: 'Succession planning',
        desc: 'Passing wealth and assets to the next generation efficiently.',
      },
      {
        name: 'Estate planning',
        desc: 'Structuring personal and financial affairs around your long-term goals.',
      },
      {
        name: 'Wills & probate',
        desc: 'Drafting wills and administering estates through probate.',
      },
      {
        name: 'Trusts',
        desc: 'Setting up and managing trusts for asset protection and distribution.',
      },
      {
        name: 'Property & conveyancing',
        desc: 'Buying, selling and transferring personal real estate holdings.',
      },
      {
        name: 'Residency & relocation',
        desc: 'Residence, relocation and immigration support for private clients.',
      },
      {
        name: 'Family arrangements',
        desc: 'Marriage, civil partnership, divorce and related personal matters.',
      },
    ],
    approachTitle: 'Why clients work with me',
    why: [
      {
        num: '01',
        title: 'Discreet & personal',
        desc: 'Your affairs handled with complete confidentiality and care.',
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
        q: 'Do I need a Cyprus will if I own property here?',
        a: 'A Cyprus will can make administering local assets much simpler. I can advise how it should work alongside any will you hold abroad.',
      },
      {
        q: 'What is a trust used for?',
        a: 'Trusts are used to protect assets, plan succession and manage wealth for family members. I can explain whether one fits your situation.',
      },
      {
        q: 'Can you help me relocate to Cyprus?',
        a: 'Yes. I coordinate the residency, tax and estate-planning sides of a move so they work together.',
      },
    ],
    ctaTitle: 'Plan for your family’s future',
    ctaText: 'The first 30-minute consultation is free and confidential.',
    metaTitle: 'Private Client — Polykarpou Law',
    metaDescription:
      'Discreet, personal advice for individuals and families in Cyprus and abroad — from wills and succession to trusts, tax and relocation.',
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
