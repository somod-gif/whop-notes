import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWhopUser } from '@/app/backend/lib/whopClients';
import NoteList from './components/NoteList';
import Note from '@/app/backend/models/Note';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const whopToken = (await cookieStore).get('whop_session')?.value;

  if (!whopToken) redirect('/login');

  const user = await getWhopUser(whopToken);
  if (!user) redirect('/login');

  // Fetch user’s notes
  const notes = await Note.find({ userId: user.id }).sort({ updatedAt: -1 }).lean();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}</h1>
      <NoteList notes={notes} />
    </div>
  );
}
