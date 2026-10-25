// Shared client-side validation for the contact form. Kept framework-free and
// pure so it can be unit-tested directly.

export interface ContactValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  consent: boolean;
}

export type ContactField = 'firstName' | 'lastName' | 'email' | 'area' | 'message' | 'consent';

export type ContactErrors = Partial<Record<ContactField, string>>;

// RFC-lite email check: good enough for UX; the server validates authoritatively.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

// Returns an error map keyed by field. Values are i18n keys under
// "contact.form.errors" so the caller can translate them.
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.firstName.trim()) errors.firstName = 'firstName';
  if (!values.lastName.trim()) errors.lastName = 'lastName';
  if (!isValidEmail(values.email)) errors.email = 'email';
  if (!values.area.trim()) errors.area = 'area';
  if (!values.message.trim()) errors.message = 'message';
  if (!values.consent) errors.consent = 'consent';
  return errors;
}
