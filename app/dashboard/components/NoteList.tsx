'use client';

import NoteCard from './NoteCard';
import { Note } from '@/app/types/frontend';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  if (!notes || notes.length === 0) {
    return <p className="text-gray-500">No notes found. Create your first note!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
}
