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

export type PolicyKey = 'privacy' | 'cookies' | 'legal' | 'terms';

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
    lead: 'This policy explains how Polykarpou & Co. LLC collects and uses personal data when you visit this website, contact us or become a client, in line with the EU General Data Protection Regulation (GDPR) and Cyprus data protection law.',
    sections: [
      {
        id: 'who',
        heading: '1. Who we are',
        blocks: [
          {
            type: 'p',
            text: 'The data controller is **Polykarpou & Co. LLC**, Sofia Polykarpou, Advocate, Limassol, Cyprus. Email: [name@domain.com.cy] · Phone: +357 97 776 761.',
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
              { text: 'Enquiries that do not lead to an engagement: up to 5 years.' },
              {
                text: 'Client files: retained permanently, in line with our legal and professional obligations.',
              },
              { text: 'Newsletter: until you unsubscribe.' },
              { text: 'Job applications: up to 12 months, unless you agree to a longer period.' },
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
    lead: 'This policy explains how spolykarpou.com uses cookies and similar technologies, and how you can control them.',
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
            ],
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
              ['Name', 'Polykarpou & Co. LLC — Sofia Polykarpou, Advocate'],
              ['Address', 'Limassol, Cyprus'],
              ['Phone', '+357 97 776 761'],
              ['Email', '[name@domain.com.cy]'],
              [
                'Professional body',
                'Member of the Cyprus Bar Association · Registration No. [XXXXX]',
              ],
              ['VAT / Tax ID', '[XXXXXXXXX]'],
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
            text: 'All content on this website, including text, design and logos, belongs to Polykarpou & Co. LLC or is used with permission. You may not copy or reuse it for commercial purposes without our written consent. Images are used under licence from their respective owners.',
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

  terms: {
    lead: 'These Terms of Engagement set out the basis on which Polykarpou & Co. LLC acts for its clients. They apply together with any individual Engagement Letter we send you; if an Engagement Letter and these Terms differ, the Engagement Letter prevails for that matter.',
    sections: [
      {
        id: 'relationship',
        heading: '1. Our relationship with you',
        blocks: [
          {
            type: 'p',
            text: 'In these Terms, “we”, “us” and “our” mean Polykarpou & Co. LLC, and “you” means the client named in the Engagement Letter. Together, these Terms and the Engagement Letter form the contract between us.',
          },
          {
            type: 'p',
            text: 'Our relationship begins only once we have confirmed in writing that we are able to act for you, after completing our client-acceptance checks. Contacting us does not by itself create an advocate–client relationship.',
          },
          {
            type: 'p',
            text: 'We may update these Terms from time to time. The latest version will always be available on this page and applies to work carried out after it is published.',
          },
        ],
      },
      {
        id: 'services',
        heading: '2. Our advice and services',
        blocks: [
          {
            type: 'p',
            text: 'We advise only on the law of the Republic of Cyprus. Where your matter involves the law of another country, we can work with suitable foreign lawyers, but we do not accept responsibility for their advice.',
          },
          {
            type: 'p',
            text: 'The scope of each matter is set out in the Engagement Letter. We will agree any significant change in scope with you before carrying it out.',
          },
          {
            type: 'p',
            text: 'Sofia Polykarpou has overall responsibility for your matter. We may ask colleagues or trusted external professionals to assist, but you will always know who is handling your work.',
          },
        ],
      },
      {
        id: 'aml',
        heading: '3. Client identification',
        blocks: [
          {
            type: 'p',
            text: 'Cyprus law requires us to verify the identity of our clients and, where relevant, their beneficial owners and source of funds, before and during our work. We may ask you for identification documents and other information.',
          },
          {
            type: 'p',
            text: 'We cannot begin or continue acting until these checks are completed to our satisfaction. We may be required by law to report certain matters to the authorities, and in some cases without being able to tell you.',
          },
        ],
      },
      {
        id: 'fees',
        heading: '4. Fees, invoicing and payment',
        blocks: [
          {
            type: 'p',
            text: 'Our fees are based on the time spent and on the nature, complexity and urgency of the matter. We will give you an estimate or fee basis in the Engagement Letter. Estimates are given in good faith and are not a fixed quotation unless we say so in writing.',
          },
          {
            type: 'p',
            text: 'Unless stated otherwise, our fees are exclusive of VAT and of disbursements — amounts we pay on your behalf, such as court fees, official charges and expert fees.',
          },
          {
            type: 'p',
            text: 'We may ask you for funds on account of fees and disbursements before or during a matter, and apply them against our invoices.',
          },
          {
            type: 'list',
            items: [
              { text: 'Invoices are payable within the period stated on the invoice.' },
              { text: 'We may charge interest on amounts that remain unpaid after their due date.' },
              {
                text: 'If an invoice remains unpaid, we may stop work and keep your documents until payment is received, to the extent permitted by law.',
              },
            ],
          },
        ],
      },
      {
        id: 'confidentiality',
        heading: '5. Confidentiality and third parties',
        blocks: [
          {
            type: 'p',
            text: 'Everything you tell us is kept in strict confidence and is protected by professional secrecy, except where disclosure is required by law or permitted under these Terms.',
          },
          {
            type: 'p',
            text: 'To carry out your work we may use trusted service providers, such as IT, hosting and email providers, and may involve experts, translators or agents. We take reasonable care in selecting them and put appropriate confidentiality arrangements in place.',
          },
        ],
      },
      {
        id: 'data',
        heading: '6. Data protection',
        blocks: [
          {
            type: 'p',
            text: 'We process personal data in line with the EU General Data Protection Regulation (GDPR) and Cyprus data protection law. How we handle your personal data is explained in our {privacy}.',
          },
        ],
      },
      {
        id: 'retention',
        heading: '7. Keeping your documents',
        blocks: [
          {
            type: 'p',
            text: 'After a matter ends we keep the file for the period required by law and professional rules. We may keep documents in electronic form and destroy paper originals, unless you ask us in writing to return specific originals to you.',
          },
        ],
      },
      {
        id: 'ip',
        heading: '8. Intellectual property',
        blocks: [
          {
            type: 'p',
            text: 'We keep the copyright and other intellectual property in the documents and materials we create. You may use them for the purpose for which they were prepared, but not for any other purpose or for the benefit of a third party without our written consent.',
          },
        ],
      },
      {
        id: 'liability',
        heading: '9. Our liability',
        blocks: [
          {
            type: 'p',
            text: 'We carry out your work with reasonable care and skill. To the extent permitted by law, our liability in connection with a matter is limited as set out in the Engagement Letter, and we are not liable for loss that is not a foreseeable result of our work, or for loss caused by information you give us that is incomplete or inaccurate.',
          },
          {
            type: 'p',
            text: 'Nothing in these Terms limits any liability that cannot be limited under Cyprus law.',
          },
        ],
      },
      {
        id: 'termination',
        heading: '10. Ending the engagement',
        blocks: [
          {
            type: 'p',
            text: 'You may end our engagement at any time by telling us in writing. We may stop acting for good reason — for example, if a conflict of interest arises, if our checks cannot be completed, or if our invoices are not paid — and will give you reasonable notice where we can.',
          },
          {
            type: 'p',
            text: 'If the engagement ends, you remain responsible for our fees and disbursements for the work done up to that point.',
          },
        ],
      },
      {
        id: 'complaints',
        heading: '11. Complaints',
        blocks: [
          {
            type: 'p',
            text: 'We aim to provide a high standard of service. If you have any concern about our work or a bill, please raise it with Sofia Polykarpou as soon as possible so that we can try to put it right. You may also have the right to complain to the Cyprus Bar Association.',
          },
        ],
      },
      {
        id: 'law',
        heading: '12. Governing law and jurisdiction',
        blocks: [
          {
            type: 'p',
            text: 'These Terms and any Engagement Letter are governed by the laws of the Republic of Cyprus, and the courts of Cyprus have exclusive jurisdiction over any dispute arising from them.',
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
