import { describe, it, expect } from 'vitest';
import en from './locales/en.json';
import gr from './locales/gr.json';
import ru from './locales/ru.json';

// Collect all leaf key paths, ignoring the placeholder _meta block in gr/ru.
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    if (k === '_meta') return [];
    const path = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === 'object' ? keyPaths(v as Record<string, unknown>, path) : [path];
  });
}

describe('i18n locale files', () => {
  const enKeys = keyPaths(en).sort();

  it('GR has exactly the same keys as EN', () => {
    expect(keyPaths(gr).sort()).toEqual(enKeys);
  });

  it('RU has exactly the same keys as EN', () => {
    expect(keyPaths(ru).sort()).toEqual(enKeys);
  });

  it('GR and RU are actually translated (values differ from EN)', () => {
    expect(gr.nav.home).not.toBe(en.nav.home);
    expect(gr.buttons.subscribe).not.toBe(en.buttons.subscribe);
    expect(ru.nav.home).not.toBe(en.nav.home);
    expect(ru.contact.title).not.toBe(en.contact.title);
  });
});
