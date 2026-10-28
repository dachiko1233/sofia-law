import { useState } from 'react';
import { isLoggedIn } from '../lib/portal';
import AuthGate from './AuthGate';
import PortalLayout from './PortalLayout';

// Gate for the whole /portal area: unauthenticated visitors see the sign-in /
// register screen; authenticated clients get the dashboard shell (which renders
// the active child route via <Outlet/>).
export default function PortalShell() {
  const [authed, setAuthed] = useState(isLoggedIn());
  return authed ? (
    <PortalLayout onLogout={() => setAuthed(false)} />
  ) : (
    <AuthGate onAuthed={() => setAuthed(true)} />
  );
}
