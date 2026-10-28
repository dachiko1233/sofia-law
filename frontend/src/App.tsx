import { Routes, Route } from 'react-router-dom';
import ScrollManager from './components/ScrollManager';
import CookieBanner from './components/CookieBanner';
import HomePage from './pages/HomePage';
import ExpertisePage from './pages/ExpertisePage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import LegalNoticePage from './pages/LegalNoticePage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import PortalShell from './portal/PortalShell';
import DashboardPage from './portal/pages/DashboardPage';
import DocumentsPage from './portal/pages/DocumentsPage';
import CasesPage from './portal/pages/CasesPage';
import MessagesPage from './portal/pages/MessagesPage';
import AppointmentsPage from './portal/pages/AppointmentsPage';
import BillingPage from './portal/pages/BillingPage';
import ProfilePage from './portal/pages/ProfilePage';
import SupportPage from './portal/pages/SupportPage';

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expertise/:slug" element={<ExpertisePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/portal" element={<PortalShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CookieBanner />
    </>
  );
}
