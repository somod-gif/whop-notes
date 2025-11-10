// src/hooks/useNotes.ts
'use client';

import { useNotesStore } from '@/app/store/index';
import { Note } from '@/app/types/frontend';
import axios from 'axios';

export function useNotes() {
  const { notes, setNotes, addNote, updateNote, deleteNote } = useNotesStore();

  const fetchNotes = async () => {
    try {
      const res = await axios.get<Note[]>('/api/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const createNote = async (note: Partial<Note>) => {
    try {
      const res = await axios.post<Note>('/api/notes', note);
      addNote(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to create note:', err);
      throw err;
    }
  };

  const editNote = async (id: string, note: Partial<Note>) => {
    try {
      const res = await axios.put<Note>(`/api/notes/${id}`, note);
      updateNote(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to update note:', err);
      throw err;
    }
  };

  const removeNote = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      deleteNote(id);
    } catch (err) {
      console.error('Failed to delete note:', err);
      throw err;
    }
  };

  return { notes, fetchNotes, createNote, editNote, removeNote };
}
