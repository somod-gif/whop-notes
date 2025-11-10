/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Await the cookies object
  const cookieStore = await cookies(); 

  // Get all cookies as an array
  const allCookies = cookieStore.getAll?.() || []; // fallback just in case

  // Find the accessToken cookie
  const tokenCookie = allCookies.find((c: any) => c.name === 'accessToken');

  if (tokenCookie?.value) {
    redirect('/dashboard');
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to Whop Notes App</h1>
    </div>
  );
}
