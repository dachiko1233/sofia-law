import { describe, it, expect, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import i18n from './index';
import HomePage from '../pages/HomePage';
import ExpertisePage from '../pages/ExpertisePage';
import PrivacyPage from '../pages/PrivacyPage';

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/expertise/:slug" element={<ExpertisePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
}

afterAll(async () => {
  await i18n.changeLanguage('en');
});

describe('language switching renders translated content', () => {
  it('renders the home page in Greek', async () => {
    await i18n.changeLanguage('gr');
    const { unmount } = renderAt('/');
    expect(
      screen.getByText('Εστιασμένοι τομείς δικαίου, με πλήρη διαχείριση.')
    ).toBeInTheDocument();
    // nav
    expect(screen.getAllByText('Εξειδίκευση').length).toBeGreaterThan(0);
    unmount();
  });

  it('renders the home page in Russian', async () => {
    await i18n.changeLanguage('ru');
    const { unmount } = renderAt('/');
    expect(screen.getByText('Чем я могу помочь?')).toBeInTheDocument();
    unmount();
  });

  it('renders an expertise page in Greek', async () => {
    await i18n.changeLanguage('gr');
    const { unmount } = renderAt('/expertise/corporate');
    expect(
      screen.getByRole('heading', { name: 'Εταιρικό & Εμπορικό Δίκαιο', level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText('Σύσταση εταιρείας')).toBeInTheDocument();
    unmount();
  });

  it('renders the privacy policy in Russian', async () => {
    await i18n.changeLanguage('ru');
    const { unmount } = renderAt('/privacy');
    expect(screen.getByRole('heading', { name: '1. Кто мы', level: 2 })).toBeInTheDocument();
    unmount();
  });
});
