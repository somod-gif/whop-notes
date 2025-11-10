// src/components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store';
import Button from './Button';

export default function LogoutButton() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogout = async () => {
    try {
      // Optionally call API to invalidate session
      // await fetch('/api/auth/logout', { method: 'POST' });

      // Clear local auth state
      setUser(null);
      setToken(null);

      // Redirect to login
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to logout');
    }
  };

  return (
    <Button variant="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
}
