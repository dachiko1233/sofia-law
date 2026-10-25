import { describe, it, expect } from 'vitest';
import { validateContact, isValidEmail, type ContactValues } from './validation';

const valid: ContactValues = {
  firstName: 'Sofia',
  lastName: 'Polykarpou',
  email: 'sofia@example.com',
  phone: '+357 00 000000',
  area: 'Corporate',
  message: 'I would like advice on forming a company.',
  consent: true,
};

describe('isValidEmail', () => {
  it('accepts well-formed addresses', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('  trimmed@example.com  ')).toBe(true);
  });
  it('rejects malformed addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('no-at')).toBe(false);
    expect(isValidEmail('no@domain')).toBe(false);
    expect(isValidEmail('a b@c.com')).toBe(false);
  });
});

describe('validateContact', () => {
  it('returns no errors for a valid payload', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('flags every missing required field', () => {
    const errors = validateContact({
      firstName: '  ',
      lastName: '',
      email: 'bad',
      phone: '',
      area: '',
      message: '   ',
      consent: false,
    });
    expect(errors).toEqual({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      area: 'area',
      message: 'message',
      consent: 'consent',
    });
  });

  it('requires consent even when all else is valid', () => {
    expect(validateContact({ ...valid, consent: false })).toEqual({ consent: 'consent' });
  });
});
