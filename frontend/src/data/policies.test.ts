import { describe, it, expect } from 'vitest';
import { POLICIES_EN, getPolicy, type PolicyKey } from './policies';
import { POLICIES_GR } from './policies.gr';
import { POLICIES_RU } from './policies.ru';

const KEYS: PolicyKey[] = ['privacy', 'cookies', 'legal'];

describe('policy content', () => {
  it('GR and RU mirror the English structure (same sections & block types)', () => {
    for (const key of KEYS) {
      const en = POLICIES_EN[key];
      for (const map of [POLICIES_GR, POLICIES_RU]) {
        const other = map[key];
        expect(other.sections.map((s) => s.id)).toEqual(en.sections.map((s) => s.id));
        en.sections.forEach((s, i) => {
          expect(other.sections[i].blocks.map((b) => b.type)).toEqual(s.blocks.map((b) => b.type));
        });
      }
    }
  });

  it('returns translated headings but keeps section ids', () => {
    const en = getPolicy('privacy', 'en');
    const gr = getPolicy('privacy', 'gr');
    expect(gr.sections[0].id).toBe(en.sections[0].id);
    expect(gr.sections[0].heading).not.toBe(en.sections[0].heading);
  });

  it('falls back to English for an unknown language key', () => {
    // @ts-expect-error — exercising the runtime fallback path
    expect(getPolicy('legal', 'xx')).toBe(POLICIES_EN.legal);
  });
});
