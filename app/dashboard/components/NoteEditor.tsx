'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/app/types/frontend';
import Button from '@/app/components/Button';

interface NoteEditorProps {
  note?: Note; // Optional for editing
  onSave: (note: { title: string; content: string }) => void;
}

export default function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <input
        type="text"
        placeholder="Title"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div
        contentEditable
        suppressContentEditableWarning
        className="prose min-h-[200px] border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <Button variant="primary" onClick={() => onSave({ title, content })}>
        Save Note
      </Button>
    </div>
  );
}
