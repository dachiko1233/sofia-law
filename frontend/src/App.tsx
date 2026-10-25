import { Routes, Route } from 'react-router-dom';
import ScrollManager from './components/ScrollManager';
import CookieBanner from './components/CookieBanner';
import HomePage from './pages/HomePage';
import ExpertisePage from './pages/ExpertisePage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import LegalNoticePage from './pages/LegalNoticePage';
import NotFoundPage from './pages/NotFoundPage';

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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CookieBanner />
    </>
  );
}
