import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { submitNewsletter } from '../lib/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    try {
      await submitNewsletter({ email, company });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="text-[15px] text-white">
        {t('newsletter.success')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex rounded-pill border border-navy-border p-1">
        <label className="flex grow">
          <span className="sr-only">{t('newsletter.placeholder')}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            autoComplete="email"
            className="min-w-0 grow border-none bg-transparent px-4 py-2.5 text-[15px] text-white placeholder:text-slate-label focus:outline-none"
          />
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
        <button
          type="submit"
          disabled={status === 'loading'}
          className="min-h-[44px] cursor-pointer rounded-pill border-none bg-accent-bright px-[18px] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {t('buttons.subscribe')}
        </button>
      </div>
      {status === 'error' && (
        <p role="alert" className="mt-2 text-[13px] text-slate-light">
          {t('newsletter.error')}
        </p>
      )}
    </form>
  );
}
