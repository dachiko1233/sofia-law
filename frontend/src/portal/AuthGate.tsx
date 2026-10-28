import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { login, register, PortalError } from '../lib/portal';
import { useErrorText } from './helpers';
import { ArrowRight } from '../components/icons';

type Mode = 'login' | 'register';

function Monogram() {
  return (
    <svg width="40" height="40" viewBox="0 0 34 34" aria-hidden="true" className="text-gold">
      <path d="M4 11 17 4l13 7H4Z" fill="currentColor" opacity="0.92" />
      <rect x="7" y="13" width="2.6" height="12" fill="currentColor" />
      <rect x="12.4" y="13" width="2.6" height="12" fill="currentColor" />
      <rect x="18.9" y="13" width="2.6" height="12" fill="currentColor" />
      <rect x="24.4" y="13" width="2.6" height="12" fill="currentColor" />
      <rect x="4" y="26.4" width="26" height="2.6" fill="currentColor" />
    </svg>
  );
}

export default function AuthGate({ onAuthed }: { onAuthed: () => void }) {
  const { t } = useTranslation();
  const errorText = useErrorText();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      if (mode === 'register') await register({ name, surname, phone, email, password });
      else await login(email, password);
      onAuthed();
    } catch (err) {
      setError(errorText(err instanceof PortalError ? err.code : 'generic'));
    } finally {
      setBusy(false);
    }
  }

  const field =
    'w-full border-0 border-b-[1.5px] border-[#cdc4b2] bg-transparent py-2.5 text-[16px] text-portal-ink focus:border-gold focus:outline-none';
  const labelCls = 'flex flex-col gap-1.5 text-[13px] font-semibold text-portal-ink';

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => {
        setMode(m);
        setError(null);
      }}
      className={`min-h-[44px] flex-1 border-b-2 pb-3 text-[15px] font-semibold transition-colors ${
        mode === m
          ? 'border-gold text-portal-ink'
          : 'border-portal-line text-portal-muted hover:text-portal-ink'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="portal-root flex min-h-screen flex-col items-center justify-center bg-portal-bg px-5 py-12">
      <Seo
        title={t('portal.metaTitle')}
        description={t('portal.metaDescription')}
        path="/portal"
        noindex
      />

      <div className="mb-7 flex flex-col items-center gap-3 text-center">
        <Monogram />
        <div>
          <p className="portal-display m-0 text-[26px] font-medium text-portal-ink">
            {t('portal.title')}
          </p>
          <p className="m-0 mt-1 max-w-[42ch] text-[15px] text-portal-muted">
            {t('portal.subtitle')}
          </p>
        </div>
      </div>

      <div className="portal-card w-full max-w-[460px] rounded-[16px] border border-portal-line bg-white p-7 min-[560px]:p-9">
        <div className="flex">
          {tab('login', t('portal.tabLogin'))}
          {tab('register', t('portal.tabRegister'))}
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
          {mode === 'register' && (
            <>
              <label className={labelCls}>
                {t('portal.name')}
                <input
                  type="text"
                  autoComplete="given-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={field}
                />
              </label>
              <label className={labelCls}>
                {t('portal.surname')}
                <input
                  type="text"
                  autoComplete="family-name"
                  required
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className={field}
                />
              </label>
              <label className={labelCls}>
                {t('portal.phone')}
                <input
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={field}
                />
              </label>
            </>
          )}
          <label className={labelCls}>
            {t('portal.email')}
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </label>
          <label className={labelCls}>
            {t('portal.password')}
            <input
              type="password"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              required
              minLength={mode === 'register' ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
            {mode === 'register' && (
              <span className="text-[12.5px] font-normal text-portal-muted">
                {t('portal.passwordHint')}
              </span>
            )}
          </label>

          {error && (
            <p role="alert" className="m-0 text-[14px] font-medium text-bad">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-pill bg-gold px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#8f6d33] disabled:opacity-60"
          >
            {busy
              ? t('portal.working')
              : mode === 'register'
                ? t('portal.createAccount')
                : t('portal.signIn')}
            {!busy && <ArrowRight size={16} />}
          </button>
        </form>
      </div>

      <Link to="/" className="mt-7 text-[14px] font-medium text-portal-muted hover:text-gold">
        {t('portal.backToSite')}
      </Link>
    </div>
  );
}
