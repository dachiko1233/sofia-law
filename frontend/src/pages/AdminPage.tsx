import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import { ArrowRight, Check } from '../components/icons';
import { PortalError, type PortalDocument } from '../lib/portal';
import {
  isAdminLoggedIn,
  adminLogin,
  adminLogout,
  listClients,
  setDocumentSeen,
  addComment,
  adminDownloadDocument,
  type AdminClient,
} from '../lib/admin';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminPage() {
  const { t } = useTranslation();
  const [authed, setAuthed] = useState(isAdminLoggedIn());

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <Seo title={t('admin.metaTitle')} description="" path="/admin" noindex />

      <div className="pa-head text-slate-doc">
        <Header variant="inner" />
        <section className="wrap flex flex-col gap-4 pb-16 pt-16 min-[960px]:pb-20 min-[960px]:pt-20">
          <SectionLabel className="text-slate-breadcrumb">{t('admin.eyebrow')}</SectionLabel>
          <h1 className="m-0 text-[40px] font-medium leading-[1.05] tracking-[-0.04em] text-white min-[960px]:text-[56px]">
            {t('admin.title')}
          </h1>
          <p className="m-0 max-w-[560px] text-[18px] text-slate-doc">{t('admin.subtitle')}</p>
        </section>
      </div>

      <main className="wrap grow py-16 min-[960px]:py-24">
        {authed ? (
          <Dashboard onLogout={() => setAuthed(false)} />
        ) : (
          <LoginForm onAuthed={() => setAuthed(true)} />
        )}
      </main>

      <Footer variant="practice" />
    </div>
  );
}

function errorTextFactory(t: (k: string) => string) {
  return (code: string): string => {
    const key = `portal.errors.${code}`;
    const msg = t(key);
    return msg === key ? t('portal.errors.generic') : msg;
  };
}

function LoginForm({ onAuthed }: { onAuthed: () => void }) {
  const { t } = useTranslation();
  const errorText = errorTextFactory(t);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await adminLogin(email, password);
      onAuthed();
    } catch (err) {
      setError(errorText(err instanceof PortalError ? err.code : 'generic'));
    } finally {
      setBusy(false);
    }
  }

  const field =
    'border-0 border-b-[1.5px] border-input-line bg-transparent py-3 text-[17px] min-h-[48px] text-ink focus:outline-none';

  return (
    <div className="mx-auto flex max-w-[460px] flex-col gap-8 rounded-md border border-line bg-white p-8 min-[960px]:p-10">
      <h2 className="m-0 text-[20px] font-semibold">{t('admin.signInTitle')}</h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
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
          {busy ? t('portal.working') : t('portal.signIn')}
          {!busy && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { t } = useTranslation();
  const errorText = errorTextFactory(t);
  const [clients, setClients] = useState<AdminClient[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setClients(await listClients());
    } catch (err) {
      if (err instanceof PortalError && err.status === 401) {
        adminLogout();
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

  function handleLogout() {
    adminLogout();
    onLogout();
  }

  const totalDocs = clients?.reduce((n, c) => n + c.documents.length, 0) ?? 0;

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-[15px] text-muted">
          {t('admin.summary', { clients: clients?.length ?? 0, documents: totalDocs })}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="min-h-[44px] text-[15px] font-semibold text-ink underline-offset-4 hover:text-accent hover:underline"
        >
          {t('portal.logout')}
        </button>
      </div>

      {error && (
        <p role="alert" className="m-0 text-[14px] text-red-600">
          {error}
        </p>
      )}

      {clients === null ? (
        <p className="m-0 text-[15px] text-muted">{t('portal.loading')}</p>
      ) : clients.length === 0 ? (
        <p className="m-0 rounded-md border border-dashed border-line bg-white px-6 py-10 text-center text-[15px] text-muted">
          {t('admin.noClients')}
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {clients.map((c) => (
            <ClientCard
              key={c.id}
              client={c}
              onChanged={refresh}
              errorText={errorText}
              setError={setError}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ClientCard({
  client,
  onChanged,
  errorText,
  setError,
}: {
  client: AdminClient;
  onChanged: () => Promise<void>;
  errorText: (code: string) => string;
  setError: (msg: string | null) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5 rounded-md border border-line bg-white p-6 min-[960px]:p-8">
      <div className="flex flex-col gap-1 border-b border-line pb-4">
        <h3 className="m-0 text-[18px] font-semibold">
          {client.name} {client.surname}
        </h3>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-muted">
          <a href={`mailto:${client.email}`} className="hover:text-accent hover:underline">
            {client.email}
          </a>
          <a href={`tel:${client.phone}`} className="hover:text-accent hover:underline">
            {client.phone}
          </a>
          <span>{t('admin.joined', { date: client.createdAt.slice(0, 10) })}</span>
        </div>
      </div>

      {client.documents.length === 0 ? (
        <p className="m-0 text-[14px] text-muted">{t('admin.noDocuments')}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {client.documents.map((d) => (
            <DocumentRow
              key={d.id}
              doc={d}
              onChanged={onChanged}
              errorText={errorText}
              setError={setError}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function DocumentRow({
  doc,
  onChanged,
  errorText,
  setError,
}: {
  doc: PortalDocument;
  onChanged: () => Promise<void>;
  errorText: (code: string) => string;
  setError: (msg: string | null) => void;
}) {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await onChanged();
    } catch (err) {
      setError(errorText(err instanceof PortalError ? err.code : 'generic'));
    } finally {
      setBusy(false);
    }
  }

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    const body = comment.trim();
    if (!body || busy) return;
    await run(() => addComment(doc.id, body));
    setComment('');
  }

  return (
    <li className="flex flex-col gap-3 rounded-md border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{doc.name}</span>
          <span className="text-[13px] text-muted">
            {formatSize(doc.size)} · {doc.createdAt.slice(0, 10)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => adminDownloadDocument(doc)}
            className="min-h-[44px] text-[15px] font-semibold text-accent hover:underline"
          >
            {t('portal.download')}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => setDocumentSeen(doc.id, !doc.seenAt))}
            className={`inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold disabled:opacity-60 ${
              doc.seenAt ? 'text-accent' : 'text-muted hover:text-ink'
            }`}
          >
            {doc.seenAt && <Check size={14} />}
            {doc.seenAt ? t('admin.markUnseen') : t('admin.markSeen')}
          </button>
        </div>
      </div>

      {doc.comments.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2 rounded-md bg-bg px-4 py-3">
          {doc.comments.map((cm) => (
            <li key={cm.id} className="flex flex-col">
              <span className="text-[14px] text-ink">{cm.body}</span>
              <span className="text-[12px] text-muted">{cm.createdAt.slice(0, 10)}</span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleComment} className="flex flex-wrap items-end gap-3">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('admin.commentPlaceholder')}
          className="min-h-[44px] flex-1 border-0 border-b-[1.5px] border-input-line bg-transparent py-2 text-[15px] text-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !comment.trim()}
          className="min-h-[44px] rounded-pill bg-navy px-5 text-[14px] font-semibold text-white disabled:opacity-60"
        >
          {t('admin.addComment')}
        </button>
      </form>
    </li>
  );
}
