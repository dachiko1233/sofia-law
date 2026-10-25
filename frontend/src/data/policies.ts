// Policy page content (Privacy, Cookie, Legal Notice), keyed by language.
// Text may contain lightweight tokens handled by the PolicyArticle renderer:
//   **bold**        → <strong>
//   {privacy}       → link to /privacy  (label from i18n footer.privacy)
//   {cookies}       → link to /cookies  (label from i18n footer.cookies)
//   {dpa}           → external link to the Cyprus data protection authority
// [square-bracket] placeholders are kept verbatim and must NOT be translated.
import type { Language } from '../i18n';
import { POLICIES_GR } from './policies.gr';
import { POLICIES_RU } from './policies.ru';

export type PolicyKey = 'privacy' | 'cookies' | 'legal';

export type PolicyBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: { label?: string; text: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'deflist'; rows: [string, string][] };

export interface PolicySection {
  id: string;
  heading: string;
  blocks: PolicyBlock[];
}

export interface Policy {
  lead?: string;
  sections: PolicySection[];
}

export type PolicyMap = Record<PolicyKey, Policy>;

export const POLICIES_EN: PolicyMap = {
  privacy: {
    lead: 'This policy explains how Polykarpou Law collects and uses personal data when you visit this website, contact us or become a client, in line with the EU General Data Protection Regulation (GDPR) and Cyprus data protection law.',
    sections: [
      {
        id: 'who',
        heading: '1. Who we are',
        blocks: [
          {
            type: 'p',
            text: 'The data controller is **Polykarpou Law**, [Full Name], Advocate, Limassol, Cyprus. Email: [name@domain.com.cy] · Phone: +357 97 776 761.',
          },
        ],
      },
      {
        id: 'data',
        heading: '2. Data we collect',
        blocks: [
          {
            type: 'list',
            items: [
              {
                label: 'Contact form and enquiries:',
                text: 'your name, email address, phone number, the area of law and the information you choose to share about your matter.',
              },
              { label: 'Newsletter:', text: 'your email address, if you subscribe.' },
              {
                label: 'Clients:',
                text: 'identification documents and information we are legally required to collect, together with the details of your case.',
              },
              { label: 'Job applicants:', text: 'your CV and the information you send with it.' },
              {
                label: 'Website use:',
                text: 'basic technical data such as browser type and pages visited. See our {cookies}.',
              },
            ],
          },
        ],
      },
      {
        id: 'why',
        heading: '3. Why we use it',
        blocks: [
          {
            type: 'list',
            items: [
              {
                text: 'To reply to your enquiry and take steps before entering into an engagement with you.',
              },
              { text: 'To provide legal services under our agreement with you.' },
              {
                text: 'To meet our legal obligations, including client identification and anti-money-laundering rules, and professional record-keeping.',
              },
              {
                text: 'To send our newsletter, only with your consent — you can unsubscribe at any time.',
              },
              { text: 'To consider your job application.' },
              {
                text: 'To keep our website secure and working properly, based on our legitimate interests.',
              },
            ],
          },
          {
            type: 'p',
            text: 'We do not sell your personal data, and we do not use it for automated decision-making.',
          },
        ],
      },
      {
        id: 'share',
        heading: '4. Who we share it with',
        blocks: [
          {
            type: 'p',
            text: 'All client information is protected by professional secrecy. We share personal data only where necessary with:',
          },
          {
            type: 'list',
            items: [
              {
                text: 'courts, public authorities and other parties where required for your case or by law;',
              },
              {
                text: 'trusted service providers who support our work, such as IT, hosting and email providers, under confidentiality and data-processing agreements;',
              },
              {
                text: 'other professionals, such as experts or translators, only with your agreement.',
              },
            ],
          },
          {
            type: 'p',
            text: 'If data is transferred outside the European Economic Area, we make sure appropriate safeguards are in place.',
          },
        ],
      },
      {
        id: 'keep',
        heading: '5. How long we keep it',
        blocks: [
          {
            type: 'list',
            items: [
              { text: 'Enquiries that do not lead to an engagement: up to [X months].' },
              {
                text: 'Client files: for the period required by law and professional rules, generally [X years] after the matter ends.',
              },
              { text: 'Newsletter: until you unsubscribe.' },
              { text: 'Job applications: up to [X months], unless you agree to a longer period.' },
            ],
          },
        ],
      },
      {
        id: 'rights',
        heading: '6. Your rights',
        blocks: [
          { type: 'p', text: 'Under the GDPR you have the right to:' },
          {
            type: 'list',
            items: [
              { text: 'access the personal data we hold about you;' },
              { text: 'ask us to correct inaccurate data;' },
              { text: 'ask us to delete your data, where we have no legal reason to keep it;' },
              { text: 'restrict or object to certain processing;' },
              { text: 'receive your data in a portable format;' },
              { text: 'withdraw your consent at any time, where processing is based on consent.' },
            ],
          },
          {
            type: 'p',
            text: 'Some rights may be limited where we must keep information to meet legal or professional obligations.',
          },
        ],
      },
      {
        id: 'contact-us',
        heading: '7. Contact & complaints',
        blocks: [
          {
            type: 'p',
            text: 'To exercise your rights or ask a question about this policy, email us at [name@domain.com.cy]. We will reply within one month.',
          },
          {
            type: 'p',
            text: 'You also have the right to complain to the Office of the Commissioner for Personal Data Protection in Cyprus ({dpa}).',
          },
          {
            type: 'p',
            text: 'We may update this policy from time to time. The latest version will always be available on this page.',
          },
        ],
      },
    ],
  },

  cookies: {
    lead: 'This policy explains how polykarpoulaw.com [your domain] uses cookies and similar technologies, and how you can control them.',
    sections: [
      {
        id: 'what',
        heading: '1. What are cookies?',
        blocks: [
          {
            type: 'p',
            text: 'Cookies are small text files stored on your device when you visit a website. They help the site work, remember your preferences and, with your consent, show us how visitors use the site.',
          },
        ],
      },
      {
        id: 'use',
        heading: '2. Cookies we use',
        blocks: [
          {
            type: 'table',
            headers: ['Type', 'Purpose', 'Consent needed?'],
            rows: [
              [
                'Strictly necessary',
                'Keep the website secure and working, and remember your cookie choices.',
                'No',
              ],
              ['Preferences', 'Remember your language choice (EN, GR or RU).', 'Yes'],
              [
                'Analytics',
                'Help us understand how many people visit and which pages are useful. [Remove this row if you do not use analytics.]',
                'Yes',
              ],
            ],
          },
          {
            type: 'p',
            text: '[List the specific cookies and providers your website uses, e.g. hosting or analytics tools, with their names and how long they last.]',
          },
          { type: 'p', text: 'We do not use advertising or tracking cookies to show you ads.' },
        ],
      },
      {
        id: 'manage',
        heading: '3. Managing cookies',
        blocks: [
          {
            type: 'p',
            text: 'When you first visit the website, you can accept or reject non-essential cookies. You can change your choice at any time using the cookie settings link at the bottom of the page.',
          },
          {
            type: 'p',
            text: 'You can also block or delete cookies in your browser settings. Blocking strictly necessary cookies may stop parts of the website from working.',
          },
        ],
      },
      {
        id: 'changes',
        heading: '4. Changes & contact',
        blocks: [
          {
            type: 'p',
            text: 'We may update this policy if the cookies we use change. For questions, email [name@domain.com.cy]. For more on how we handle personal data, see our {privacy}.',
          },
        ],
      },
    ],
  },

  legal: {
    sections: [
      {
        id: 'operator',
        heading: '1. Website operator',
        blocks: [
          {
            type: 'deflist',
            rows: [
              ['Name', 'Polykarpou Law — [Full Name], Advocate'],
              ['Address', 'Limassol, Cyprus'],
              ['Phone', '+357 97 776 761'],
              ['Email', '[name@domain.com.cy]'],
              [
                'Professional body',
                'Member of the Cyprus Bar Association · Registration No. [XXXXX]',
              ],
              ['VAT / Tax ID', '[XXXXXXXXX] [Remove if not applicable]'],
            ],
          },
        ],
      },
      {
        id: 'advice',
        heading: '2. No legal advice',
        blocks: [
          {
            type: 'p',
            text: 'The content of this website is for general information only and does not constitute legal advice. It may not reflect the latest changes in the law. You should not act on any information on this website without obtaining advice about your specific situation.',
          },
          {
            type: 'p',
            text: 'Contacting us through this website, by email or by phone does not by itself create an advocate–client relationship. That relationship begins only once we have agreed to act for you in writing.',
          },
        ],
      },
      {
        id: 'liability',
        heading: '3. Liability',
        blocks: [
          {
            type: 'p',
            text: 'We take care to keep the information on this website accurate and up to date, but we make no guarantee that it is complete or error-free. To the extent permitted by law, we accept no liability for loss arising from use of, or reliance on, this website.',
          },
          {
            type: 'p',
            text: 'This website may contain links to external websites. We are not responsible for their content or their privacy practices.',
          },
        ],
      },
      {
        id: 'ip',
        heading: '4. Intellectual property',
        blocks: [
          {
            type: 'p',
            text: 'All content on this website, including text, design and logos, belongs to Polykarpou Law or is used with permission. You may not copy or reuse it for commercial purposes without our written consent. Images are used under licence from their respective owners.',
          },
        ],
      },
      {
        id: 'law',
        heading: '5. Governing law',
        blocks: [
          {
            type: 'p',
            text: 'This legal notice is governed by the laws of the Republic of Cyprus, and the courts of Cyprus have jurisdiction over any dispute arising from it.',
          },
          { type: 'p', text: 'See also our {privacy} and {cookies}.' },
        ],
      },
    ],
  },
};

const POLICIES: Record<Language, PolicyMap> = {
  en: POLICIES_EN,
  gr: POLICIES_GR,
  ru: POLICIES_RU,
};

export function getPolicy(key: PolicyKey, lang: Language = 'en'): Policy {
  return POLICIES[lang]?.[key] ?? POLICIES_EN[key];
}

// Derives the "On this page" table of contents from a policy's sections.
export function policyToc(policy: Policy): { id: string; label: string }[] {
  return policy.sections.map((s) => ({ id: s.id, label: s.heading }));
}
