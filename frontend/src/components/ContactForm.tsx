import { useRef, useState, type FormEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AnchorLink } from './AnchorLink';
import { ArrowRight } from './icons';
import { submitContact } from '../lib/api';
import {
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '../lib/validation';

type Status = 'idle' | 'loading' | 'success' | 'error';

// Area chips. `value` is the stable English string sent to the backend;
// the visible label is translated.
const AREAS = [
  { key: 'corporate', value: 'Corporate' },
  { key: 'litigation', value: 'Litigation' },
  { key: 'criminal', value: 'Criminal' },
  { key: 'realEstate', value: 'Real Estate' },
  { key: 'family', value: 'Family' },
  { key: 'other', value: 'Other' },
] as const;

// `border-0` zeroes every side's width (so there's no box outline), then
// `border-b-[1.5px]` restores just the bottom edge as a 1.5px solid underline.
// The colour comes from the per-field `underline()` helper. NB: do not use
// `border-none` here — it sets `border-style: none`, which cancels the
// underline regardless of width.
const inputBase =
  'border-0 border-b-[1.5px] bg-transparent py-3 text-[17px] min-h-[48px] text-ink font-sans focus:outline-none';

export default function ContactForm() {
  const { t } = useTranslation();
  const [values, setValues] = useState<ContactValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    area: 'Corporate', // matches the design's pre-selected chip
    message: '',
    consent: false,
  });
  const [company, setCompany] = useState(''); // honeypot
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  function setField<K extends keyof ContactValues>(key: K, val: ContactValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function underline(field: ContactField) {
    return errors[field] ? 'border-red-600' : 'border-input-line';
  }

  function fieldError(field: ContactField) {
    if (!errors[field]) return null;
    return (
      <span id={`err-${field}`} role="alert" className="text-[13px] font-normal text-red-600">
        {t(`contact.form.errors.${field}`)}
      </span>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;

    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    setStatus('loading');
    try {
      await submitContact({ ...values, company });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex min-h-[200px] flex-col justify-center gap-3 rounded-md border border-line bg-white p-10"
      >
        <span className="text-[26px] font-medium tracking-[-0.02em] text-ink">
          {t('contact.form.success')}
        </span>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[22px]">
      <div className="grid grid-cols-1 gap-5 min-[960px]:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t('contact.form.firstName')}
          <input
            type="text"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'err-firstName' : undefined}
            className={`${inputBase} ${underline('firstName')}`}
          />
          {fieldError('firstName')}
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t('contact.form.lastName')}
          <input
            type="text"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'err-lastName' : undefined}
            className={`${inputBase} ${underline('lastName')}`}
          />
          {fieldError('lastName')}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[960px]:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t('contact.form.email')}
          <input
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'err-email' : undefined}
            className={`${inputBase} ${underline('email')}`}
          />
          {fieldError('email')}
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t('contact.form.phone')}
          <input
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            className={`${inputBase} border-input-line`}
          />
        </label>
      </div>

      <fieldset className="m-0 border-none p-0">
        <legend className="mb-3 p-0 text-sm font-semibold">{t('contact.form.areaLegend')}</legend>
        <div className="flex flex-wrap gap-2.5">
          {AREAS.map((a) => {
            const selected = values.area === a.value;
            return (
              <button
                key={a.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setField('area', a.value)}
                className={`min-h-[44px] cursor-pointer rounded-pill border border-ink px-[18px] py-2.5 text-sm font-semibold font-sans ${
                  selected ? 'bg-ink text-white' : 'bg-transparent text-ink'
                }`}
              >
                {t(`contact.areas.${a.key}`)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2 text-sm font-semibold">
        {t('contact.form.message')}
        <textarea
          rows={4}
          value={values.message}
          onChange={(e) => setField('message', e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'err-message' : undefined}
          className={`${inputBase} resize-y ${underline('message')}`}
        />
        {fieldError('message')}
      </label>

      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="hidden"
      />

      <label className="flex items-start gap-3 text-sm font-normal text-muted">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(e) => setField('consent', e.target.checked)}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? 'err-consent' : undefined}
          className="mt-0.5 h-5 w-5 shrink-0"
        />
        <span>
          <Trans
            i18nKey="contact.form.consent"
            components={[<AnchorLink key="privacy" to="/privacy" className="text-accent" />]}
          />
          {errors.consent && (
            <span id="err-consent" role="alert" className="mt-1 block text-red-600">
              {t('contact.form.errors.consent')}
            </span>
          )}
        </span>
      </label>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex min-h-[56px] cursor-pointer items-center gap-3 self-start rounded-pill border-none bg-ink px-[34px] py-[18px] text-base font-semibold leading-none text-white font-sans disabled:opacity-60"
      >
        {status === 'loading' ? t('contact.form.sending') : t('buttons.sendEnquiry')}
        {status !== 'loading' && <ArrowRight size={18} />}
      </button>

      {status === 'error' && (
        <p role="alert" className="m-0 text-sm text-red-600">
          {t('contact.form.error')}
        </p>
      )}
    </form>
  );
}
