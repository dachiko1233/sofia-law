import { describe, it, expect } from 'vitest';
import {
  getPracticeAreas,
  getPracticeArea,
  PRACTICE_AREA_SLUGS,
  PRACTICE_AREAS_EN,
} from './practiceAreas';
import { PRACTICE_AREAS_GR } from './practiceAreas.gr';
import { PRACTICE_AREAS_RU } from './practiceAreas.ru';

const EXPECTED_SLUGS = [
  'banking-finance',
  'corporate',
  'employment',
  'family',
  'immigration',
  'private-client',
  'real-estate',
  'sports-law',
  'tech-ip',
];

describe('practice areas data', () => {
  it('contains all 9 expected areas in order', () => {
    expect(PRACTICE_AREA_SLUGS).toEqual(EXPECTED_SLUGS);
  });

  it('has complete content for every area (English)', () => {
    for (const area of getPracticeAreas('en')) {
      expect(area.title).toBeTruthy();
      expect(area.intro).toBeTruthy();
      expect(area.homeBlurb).toBeTruthy();
      expect(area.overviewParas.length).toBeGreaterThan(0);
      expect(area.services.length).toBe(8);
      expect(area.why.length).toBe(3);
      expect(area.faqs.length).toBe(3);
      expect(area.ctaTitle).toBeTruthy();
      expect(area.metaTitle).toContain('Polykarpou & Co. LLC');
    }
  });

  it('decodes HTML entities (no &amp; left in titles)', () => {
    const en = getPracticeAreas('en');
    expect(en.some((a) => a.title.includes('&'))).toBe(true);
    expect(en.some((a) => a.title.includes('&amp;'))).toBe(false);
  });

  it('looks areas up by slug and language', () => {
    expect(getPracticeArea('corporate')?.num).toBe('02');
    expect(getPracticeArea('nope')).toBeUndefined();
    // Greek/Russian return translated titles while keeping slug + num.
    expect(getPracticeArea('corporate', 'gr')?.title).not.toBe(
      getPracticeArea('corporate', 'en')?.title
    );
    expect(getPracticeArea('corporate', 'ru')?.num).toBe('02');
  });

  it('GR and RU cover every slug with the same shape as EN', () => {
    for (const slug of EXPECTED_SLUGS) {
      for (const map of [PRACTICE_AREAS_GR, PRACTICE_AREAS_RU]) {
        expect(map[slug]).toBeDefined();
        expect(map[slug].services.length).toBe(PRACTICE_AREAS_EN[slug].services.length);
        expect(map[slug].faqs.length).toBe(PRACTICE_AREAS_EN[slug].faqs.length);
        expect(map[slug].why.length).toBe(PRACTICE_AREAS_EN[slug].why.length);
        expect(map[slug].overviewParas.length).toBe(PRACTICE_AREAS_EN[slug].overviewParas.length);
      }
    }
  });
});
