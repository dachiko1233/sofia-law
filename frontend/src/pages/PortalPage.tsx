import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import { ArrowRight, Check, LockIcon } from '../components/icons';
import {
  isLoggedIn,
  login,
  register,
  logout,
  listDocuments,
  uploadDocument,
  downloadDocument,
  deleteDocument,
  PortalError,
  type PortalDocument,
} from '../lib/portal';

type Mode = 'login' | 'register';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PortalPage() {
  const { t } = useTranslation();
  const [authed, setAuthed] = useState(isLoggedIn());

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <Seo title={t('portal.metaTitle')} description={t('portal.metaDescription')} path="/portal" />

      <div className="pa-head text-slate-doc">
        <Header variant="inner" />
        <section className="wrap flex flex-col gap-4 pb-16 pt-16 min-[960px]:pb-20 min-[960px]:pt-20">
          <SectionLabel className="text-slate-breadcrumb">{t('portal.eyebrow')}</SectionLabel>
          <h1 className="m-0 text-[40px] font-medium leading-[1.05] tracking-[-0.04em] text-white min-[960px]:text-[56px]">
            {t('portal.title')}
          </h1>
          <p className="m-0 max-w-[560px] text-[18px] text-slate-doc">{t('portal.subtitle')}</p>
        </section>
      </div>

      <main className="wrap grow py-16 min-[960px]:py-24">
        {authed ? (
          <Dashboard onLogout={() => setAuthed(false)} />
        ) : (
          <AuthForm onAuthed={() => setAuthed(true)} />
        )}
      </main>

      <Footer variant="practice" />
    </div>
  );
}

function AuthForm({ onAuthed }: { onAuthed: () => void }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function errorText(code: string): string {
    const key = `portal.errors.${code}`;
    const msg = t(key);
    return msg === key ? t('portal.errors.generic') : msg;
  }

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

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => {
        setMode(m);
        setError(null);
      }}
      className={`min-h-[44px] flex-1 border-b-2 pb-3 text-[15px] font-semibold transition-colors ${
        mode === m ? 'border-accent text-ink' : 'border-line text-muted hover:text-ink'
      }`}
    >
      {label}
    </button>
  );

  const field =
    'border-0 border-b-[1.5px] border-input-line bg-transparent py-3 text-[17px] min-h-[48px] text-ink focus:outline-none';

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-8 rounded-md border border-line bg-white p-8 min-[960px]:p-10">
      <div className="flex gap-2">
        {tab('login', t('portal.tabLogin'))}
        {tab('register', t('portal.tabRegister'))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {mode === 'register' && (
          <>
            <div className="flex flex-col gap-6 min-[420px]:flex-row">
              <label className="flex flex-1 flex-col gap-2 text-sm font-semibold">
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
              <label className="flex flex-1 flex-col gap-2 text-sm font-semibold">
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
            </div>
            <label className="flex flex-col gap-2 text-sm font-semibold">
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
        <label className="flex flex-col gap-2 text-sm font-semibold">
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
        <label className="flex flex-col gap-2 text-sm font-semibold">
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
            <span className="text-[13px] font-normal text-muted">{t('portal.passwordHint')}</span>
          )}
        </label>

        {error && (
          <p role="alert" className="m-0 text-[14px] text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-pill bg-navy px-7 font-semibold text-white disabled:opacity-60"
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
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { t } = useTranslation();
  const [docs, setDocs] = useState<PortalDocument[] | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function errorText(code: string): string {
    const key = `portal.errors.${code}`;
    const msg = t(key);
    return msg === key ? t('portal.errors.generic') : msg;
  }

  async function refresh() {
    try {
      setDocs(await listDocuments());
    } catch (err) {
      if (err instanceof PortalError && err.status === 401) {
        logout();
        onLogout();
        return;
      }
      setError(errorText(err instanceof PortalError ? err.code : 'generic'));
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFile(e: FormEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setError(null);
    setUploadBusy(true);
    try {
      await uploadDocument(file);
      await refresh();
    } catch (err) {
      setError(errorText(err instanceof PortalError ? err.code : 'generic'));
    } finally {
      setUploadBusy(false);
      input.value = '';
    }
  }

  async function handleDelete(doc: PortalDocument) {
    if (!window.confirm(t('portal.confirmDelete', { name: doc.name }))) return;
    setError(null);
    try {
      await deleteDocument(doc.id);
      await refresh();
    } catch (err) {
      setError(errorText(err instanceof PortalError ? err.code : 'generic'));
    }
  }

  function handleLogout() {
    logout();
    onLogout();
  }

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-[15px] text-muted">
          <Check size={18} className="text-accent" />
          {t('portal.signedIn')}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="min-h-[44px] text-[15px] font-semibold text-ink underline-offset-4 hover:text-accent hover:underline"
        >
          {t('portal.logout')}
        </button>
      </div>

      {/* Upload */}
      <div className="flex flex-col gap-4 rounded-md border border-line bg-white p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-white">
            <LockIcon />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-[20px] font-semibold">{t('portal.uploadTitle')}</h2>
            <p className="m-0 text-[15px] text-muted">{t('portal.uploadHint')}</p>
          </div>
        </div>
        <input ref={fileRef} type="file" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploadBusy}
          className="inline-flex min-h-[48px] w-fit items-center gap-2.5 rounded-pill bg-navy px-6 font-semibold text-white disabled:opacity-60"
        >
          {uploadBusy ? t('portal.uploading') : t('portal.uploadButton')}
          {!uploadBusy && <ArrowRight size={16} />}
        </button>
        {error && (
          <p role="alert" className="m-0 text-[14px] text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* Document list */}
      <div className="flex flex-col gap-4">
        <h2 className="m-0 text-[20px] font-semibold">{t('portal.documentsTitle')}</h2>
        {docs === null ? (
          <p className="m-0 text-[15px] text-muted">{t('portal.loading')}</p>
        ) : docs.length === 0 ? (
          <p className="m-0 rounded-md border border-dashed border-line bg-white px-6 py-10 text-center text-[15px] text-muted">
            {t('portal.empty')}
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-0 rounded-md border border-line bg-white p-0">
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex flex-col gap-3 border-b border-line px-6 py-4 last:border-b-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{d.name}</span>
                    <span className="text-[13px] text-muted">
                      {formatSize(d.size)} · {d.createdAt.slice(0, 10)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${
                        d.seenAt ? 'text-accent' : 'text-muted'
                      }`}
                    >
                      {d.seenAt && <Check size={14} />}
                      {d.seenAt ? t('portal.statusSeen') : t('portal.statusPending')}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadDocument(d)}
                      className="min-h-[44px] text-[15px] font-semibold text-accent hover:underline"
                    >
                      {t('portal.download')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(d)}
                      className="min-h-[44px] text-[15px] font-semibold text-muted hover:text-red-600 hover:underline"
                    >
                      {t('portal.delete')}
                    </button>
                  </div>
                </div>

                {d.comments.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-md bg-bg px-4 py-3">
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                      {t('portal.officeNotes')}
                    </span>
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {d.comments.map((cm) => (
                        <li key={cm.id} className="flex flex-col">
                          <span className="text-[14px] text-ink">{cm.body}</span>
                          <span className="text-[12px] text-muted">
                            {cm.createdAt.slice(0, 10)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
