'use client';

import { Note } from '@/app/types/frontend';
import Link from 'next/link';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/notes/${note._id}`}>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
        <h3 className="text-lg font-semibold mb-2">{note.title || 'Untitled Note'}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{note.content || 'No content yet...'}</p>
        <div className="text-right text-xs text-gray-400 mt-2">
          {new Date(note.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
