// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/app/store';

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <aside className="w-64 bg-gray-100 min-h-screen p-4">
      <h2 className="text-lg font-semibold mb-4">Your Notes</h2>
      <ul className="flex flex-col gap-2">
        <li>
          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/notes/new" className="hover:text-blue-600">
            + New Note
          </Link>
        </li>
      </ul>
    </aside>
  );
}
