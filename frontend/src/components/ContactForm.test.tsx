import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from './ContactForm';
import '../i18n';
import { submitContact } from '../lib/api';

vi.mock('../lib/api', () => ({
  submitContact: vi.fn(),
}));

const mockedSubmit = vi.mocked(submitContact);

function renderForm() {
  return render(
    <MemoryRouter>
      <ContactForm />
    </MemoryRouter>
  );
}

describe('ContactForm', () => {
  beforeEach(() => {
    mockedSubmit.mockReset();
  });

  it('shows validation errors and does not call the API on an empty submit', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    expect(await screen.findByText('Please enter your first name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText(/tick the consent box/i)).toBeInTheDocument();
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid enquiry and shows the success state', async () => {
    mockedSubmit.mockResolvedValueOnce({ status: 'ok' });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('First name'), 'Sofia');
    await user.type(screen.getByLabelText('Last name'), 'Polykarpou');
    await user.type(screen.getByLabelText('Email'), 'sofia@example.com');
    await user.type(screen.getByLabelText('Your message'), 'Please advise on a company.');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));

    await waitFor(() => expect(mockedSubmit).toHaveBeenCalledTimes(1));
    expect(mockedSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Sofia',
        email: 'sofia@example.com',
        area: 'Corporate',
        consent: true,
      })
    );
    expect(await screen.findByText('Thank you — enquiry received.')).toBeInTheDocument();
  });
});
