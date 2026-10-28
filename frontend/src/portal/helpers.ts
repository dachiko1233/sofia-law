import { useTranslation } from 'react-i18next';

// Maps a backend error code to a localized portal message, falling back to the
// generic string for anything unmapped.
export function useErrorText() {
  const { t } = useTranslation();
  return (code: string): string => {
    const key = `portal.errors.${code}`;
    const msg = t(key);
    return msg === key ? t('portal.errors.generic') : msg;
  };
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
