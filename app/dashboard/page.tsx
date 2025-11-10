/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import NoteList from '@/app/dashboard/components/NoteList';
import { getWhopUser } from '@/app/backend/lib/whopClients';
import Note from '@/app/backend/models/Note';

export default async function DashboardPage({ cookies }: any) {
  const whopToken = cookies.get('whop_session')?.value;

  if (!whopToken) redirect('https://whop.com/login'); // or Whop main page

  const user = await getWhopUser(whopToken);

  const notes = await Note.find({ userId: user.id }).sort({ updatedAt: -1 }).lean();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>
      <NoteList notes={notes} />
    </div>
  );
}
