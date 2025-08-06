'use client';

import { useAuth } from '../contexts/AuthContext';
import { SignInPage } from '../components/auth/SignInPage';
import { Dashboard } from '../components/dashboard/Dashboard';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <Dashboard />
      ) : (
        <SignInPage />
      )}
    </>
  );
}
