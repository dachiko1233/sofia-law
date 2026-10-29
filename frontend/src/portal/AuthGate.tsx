import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import Header from '../components/Header';
import SectionLabel from '../components/SectionLabel';
import Button from '../components/Button';
import { login, register, PortalError } from '../lib/portal';
import { useErrorText } from './helpers';

type Mode = 'login' | 'register';

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
    'w-full border-0 border-b-[1.5px] border-[#cdc4b2] bg-transparent py-2.5 text-[16px] text-portal-ink focus:border-navy focus:outline-none';
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
          ? 'border-navy text-navy'
          : 'border-portal-line text-portal-muted hover:text-portal-ink'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="portal-root flex min-h-screen flex-col bg-portal-bg">
      <Seo
        title={t('portal.metaTitle')}
        description={t('portal.metaDescription')}
        path="/portal"
        noindex
      />

      {/* HERO + NAV over the Lady Justice photo (reuses the main site header) */}
      <div className="hero-wrap relative overflow-hidden bg-[#3D2B1F] text-[#E6DCD3]">
        <Header variant="inner" />
        <section className="relative flex min-h-[300px] items-center min-[960px]:min-h-[374px]">
          <div className="wrap w-full">
            <div className="flex max-w-[620px] flex-col gap-5 py-12 min-[960px]:py-16">
              <SectionLabel className="text-slate-label">{t('portal.eyebrow')}</SectionLabel>
              <h1 className="m-0 text-[44px] font-medium leading-[1.0] tracking-[-0.045em] text-white min-[960px]:text-[64px]">
                {t('portal.title')}
              </h1>
              <p className="m-0 max-w-[560px] text-[19px] text-slate-light min-[960px]:text-[20px]">
                {t('portal.subtitle')}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FORM CARD on the off-white page background */}
      <div className="flex-1 bg-portal-bg px-4 py-14 min-[560px]:py-20">
        <div className="portal-card mx-auto w-full max-w-[610px] rounded-[12px] border border-portal-line bg-white p-6 min-[560px]:p-10">
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

            <Button
              type="submit"
              variant="navy"
              size="md"
              arrow={!busy}
              disabled={busy}
              className="mt-1 w-full"
            >
              {busy
                ? t('portal.working')
                : mode === 'register'
                  ? t('portal.createAccount')
                  : t('portal.signIn')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
