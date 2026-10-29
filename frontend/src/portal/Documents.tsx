import { useRef, useState, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  uploadDocument,
  downloadDocument,
  deleteDocument,
  PortalError,
  type PortalDocument,
} from '../lib/portal';
import { formatSize, formatDate, useErrorText } from './helpers';
import {
  UploadCloudIcon,
  DownloadIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatIcon,
} from './icons';

/** Per-file upload limit, kept in sync with the backend's MaxUploadBytes. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Drag-and-drop (or click) upload target wired to the real backend. */
export function UploadDropzone({ onUploaded }: { onUploaded: () => Promise<void> }) {
  const { t } = useTranslation();
  const errorText = useErrorText();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(file: File) {
    setError(null);
    // Mirror the backend's 10 MB cap so oversized files fail instantly with a
    // clear message instead of a slow round-trip.
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(errorText('file_too_large'));
      return;
    }
    setBusy(true);
    try {
      await uploadDocument(file);
      await onUploaded();
    } catch (err) {
      setError(errorText(err instanceof PortalError ? err.code : 'generic'));
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void send(file);
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        disabled={busy}
        aria-label={t('portal.uploadButton')}
        className={`portal-dropzone flex min-h-[168px] w-full flex-col items-center justify-center gap-2.5 rounded-[12px] border border-dashed px-6 py-8 text-center disabled:opacity-70 ${
          dragging
            ? 'border-gold bg-gold-wash'
            : 'border-[#cdc4b2] bg-[#faf8f3] hover:border-gold hover:bg-gold-wash/60'
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-wash text-gold">
          <UploadCloudIcon size={24} />
        </span>
        <span className="text-[15px] font-semibold text-portal-ink">
          {busy ? t('portal.uploading') : t('portal.dropTitle')}
        </span>
        <span className="text-[13px] text-portal-muted">{t('portal.dropBrowse')}</span>
        <span className="mt-1 text-[12px] text-portal-muted">{t('portal.dropFormats')}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (file) void send(file);
          e.currentTarget.value = '';
        }}
      />
      {error && (
        <p role="alert" className="m-0 text-[13px] font-medium text-bad">
          {error}
        </p>
      )}
    </div>
  );
}

/** List of the client's uploaded documents with office status and comments. */
export function DocumentList({
  docs,
  onChanged,
}: {
  docs: PortalDocument[];
  onChanged: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const errorText = useErrorText();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function remove(doc: PortalDocument) {
    if (!window.confirm(t('portal.confirmDelete', { name: doc.name }))) return;
    setError(null);
    setBusyId(doc.id);
    try {
      await deleteDocument(doc.id);
      await onChanged();
    } catch (err) {
      setError(errorText(err instanceof PortalError ? err.code : 'generic'));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p role="alert" className="m-0 text-[13px] font-medium text-bad">
          {error}
        </p>
      )}
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {docs.map((d) => (
          <li
            key={d.id}
            className="flex flex-col gap-3 rounded-[12px] border border-portal-line bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-gold-wash text-gold">
                  <FileGlyph name={d.name} />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[15px] font-semibold text-portal-ink">
                    {d.name}
                  </span>
                  <span className="text-[12.5px] text-portal-muted">
                    {formatSize(d.size)} · {formatDate(d.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`mr-2 inline-flex items-center gap-1.5 text-[13px] font-semibold ${
                    d.seenAt ? 'text-ok' : 'text-portal-muted'
                  }`}
                >
                  {d.seenAt ? <CheckCircleIcon size={15} /> : <ClockIcon size={15} />}
                  {d.seenAt ? t('portal.statusSeen') : t('portal.statusPending')}
                </span>
                <IconButton label={t('portal.download')} onClick={() => downloadDocument(d)}>
                  <DownloadIcon size={18} />
                </IconButton>
                <IconButton
                  label={t('portal.delete')}
                  danger
                  disabled={busyId === d.id}
                  onClick={() => remove(d)}
                >
                  <TrashIcon size={18} />
                </IconButton>
              </div>
            </div>

            {d.comments.length > 0 && (
              <div className="flex flex-col gap-2 rounded-[10px] bg-[#faf8f3] px-4 py-3">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-gold">
                  <ChatIcon size={14} />
                  {t('portal.officeNotes')}
                </span>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {d.comments.map((cm) => (
                    <li key={cm.id} className="flex flex-col">
                      <span className="text-[14px] text-portal-ink">{cm.body}</span>
                      <span className="text-[12px] text-portal-muted">
                        {formatDate(cm.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-[9px] text-portal-muted transition-colors disabled:opacity-50 ${
        danger ? 'hover:bg-bad-wash hover:text-bad' : 'hover:bg-gold-wash hover:text-gold'
      }`}
    >
      {children}
    </button>
  );
}

// A tiny file-type initial badge drawn from the extension, no emoji.
function FileGlyph({ name }: { name: string }) {
  const ext = name.includes('.') ? name.split('.').pop()!.slice(0, 3).toUpperCase() : 'DOC';
  return <span className="text-[10px] font-bold tracking-tight">{ext}</span>;
}
