// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/app/store';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Whop Notes
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">Hello, {user.name}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
