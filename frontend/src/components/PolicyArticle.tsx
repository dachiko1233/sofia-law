import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AnchorLink } from './AnchorLink';
import type { Policy } from '../data/policies';

const TOKEN_RE = /(\*\*[^*]+\*\*|\{privacy\}|\{cookies\}|\{dpa\})/g;

// Parse a tokenized string into React nodes:
//   **bold** → <strong>, {privacy}/{cookies} → internal links, {dpa} → external link.
function useInline() {
  const { t } = useTranslation();
  return function inline(text: string): ReactNode[] {
    return text.split(TOKEN_RE).map((part, i) => {
      if (!part) return <Fragment key={i} />;
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part === '{privacy}') {
        return (
          <AnchorLink key={i} to="/privacy">
            {t('footer.privacy')}
          </AnchorLink>
        );
      }
      if (part === '{cookies}') {
        return (
          <AnchorLink key={i} to="/cookies">
            {t('footer.cookies')}
          </AnchorLink>
        );
      }
      if (part === '{dpa}') {
        return (
          <a key={i} href="https://www.dataprotection.gov.cy">
            dataprotection.gov.cy
          </a>
        );
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
  };
}

// Renders a Policy's lead + sections. Intended to sit inside PolicyLayout's
// <article className="policy-doc">, which supplies the typography.
export default function PolicyArticle({ policy }: { policy: Policy }) {
  const inline = useInline();

  return (
    <>
      {policy.lead && <p className="text-[19px]">{inline(policy.lead)}</p>}

      {policy.sections.map((section) => (
        <Fragment key={section.id}>
          <h2 id={section.id}>{section.heading}</h2>
          {section.blocks.map((block, bi) => {
            switch (block.type) {
              case 'p':
                return <p key={bi}>{inline(block.text)}</p>;
              case 'list':
                return (
                  <ul key={bi}>
                    {block.items.map((item, ii) => (
                      <li key={ii}>
                        {item.label && <strong>{item.label}</strong>} {inline(item.text)}
                      </li>
                    ))}
                  </ul>
                );
              case 'table':
                return (
                  <div
                    key={bi}
                    className="my-5 overflow-x-auto rounded-md border border-line bg-white"
                  >
                    <table className="policy-table">
                      <thead>
                        <tr>
                          {block.headers.map((h) => (
                            <th key={h} scope="col">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci}>{ci === 0 ? <strong>{cell}</strong> : inline(cell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              case 'deflist':
                return (
                  <dl
                    key={bi}
                    className="m-0 grid grid-cols-[minmax(0,220px)_minmax(0,1fr)] border-t border-line"
                  >
                    {block.rows.map(([term, desc]) => (
                      <div key={term} className="contents">
                        <dt className="border-b border-line py-3.5 font-semibold">{term}</dt>
                        <dd className="m-0 border-b border-line py-3.5">{desc}</dd>
                      </div>
                    ))}
                  </dl>
                );
              default:
                return null;
            }
          })}
        </Fragment>
      ))}
    </>
  );
}
