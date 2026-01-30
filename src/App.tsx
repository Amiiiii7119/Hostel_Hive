import { useState } from 'react';
import { useStore } from '@/store';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoginPage } from '@/components/auth/LoginPage';
import { SignupPage } from '@/components/auth/SignupPage';

export function App() {
  const { currentUser } = useStore();
  const [showSignup, setShowSignup] = useState(false);

  if (currentUser) {
    return <DashboardLayout />;
  }

  if (showSignup) {
    return <SignupPage onSwitchToLogin={() => setShowSignup(false)} />;
  }

  return <LoginPage onSwitchToSignup={() => setShowSignup(true)} />;
}
