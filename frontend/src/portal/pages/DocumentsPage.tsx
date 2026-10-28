import { useTranslation } from 'react-i18next';
import { usePortal } from '../PortalContext';
import { Panel, PanelHeading, EmptyState } from '../ui';
import { UploadDropzone, DocumentList } from '../Documents';
import { FileIcon } from '../icons';

export default function DocumentsPage() {
  const { t } = useTranslation();
  const { docs, docsLoading, refreshDocs } = usePortal();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="portal-display m-0 text-[30px] font-medium text-portal-ink">
          {t('portal.nav.documents')}
        </h1>
        <p className="m-0 mt-1 text-[15px] text-portal-muted">{t('portal.documentsIntro')}</p>
      </header>

      <Panel className="flex flex-col gap-4 p-6">
        <PanelHeading title={t('portal.uploadTitle')} />
        <UploadDropzone onUploaded={refreshDocs} />
      </Panel>

      <Panel className="p-6">
        <PanelHeading title={t('portal.documentsTitle')} />
        <div className="mt-4">
          {docsLoading ? (
            <p className="m-0 py-6 text-center text-[15px] text-portal-muted">
              {t('portal.loading')}
            </p>
          ) : docs.length === 0 ? (
            <EmptyState
              icon={<FileIcon size={24} />}
              title={t('portal.documentsEmptyTitle')}
              body={t('portal.documentsEmptyBody')}
            />
          ) : (
            <DocumentList docs={docs} onChanged={refreshDocs} />
          )}
        </div>
      </Panel>
    </div>
  );
}
