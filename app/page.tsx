/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useWhop } from "@/hooks/useWhop";
import NotesSidebar from "@/app/components/NotesSidebar";
import NoteEditor from "@/app/components/NoteEditor";
import toast from "react-hot-toast";

interface Note {
  _id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function HomePage() {
  const { context, loading, error } = useWhop();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (context?.user?.id) {
      fetchNotes(context.user.id);
    }
  }, [context]);

  const fetchNotes = async (userId: string) => {
    try {
      const response = await fetch(`/api/notes?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch notes");
      const notesData = await response.json();
      
      const notesWithDates = notesData.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      
      setNotes(notesWithDates);
      if (notesWithDates.length > 0 && !activeNote) {
        setActiveNote(notesWithDates[0]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    }
  };

  const createNewNote = async () => {
    if (!context?.user?.id) {
      toast.error("No user context available");
      return;
    }

    const newNote: Omit<Note, '_id'> = {
      title: 'Untitled Note',
      content: '',
      userId: context.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `Failed to create note: ${response.status}`);
      }

      const savedNote = await response.json();
      
      const noteWithDates = {
        ...savedNote,
        createdAt: new Date(savedNote.createdAt),
        updatedAt: new Date(savedNote.updatedAt),
      };
      
      setNotes([noteWithDates, ...notes]);
      setActiveNote(noteWithDates);
      toast.success("Note created successfully!");
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error(`Failed to create note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateNote = async (updatedNote: Note) => {
    const originalNotes = [...notes];
    const updatedNotes = notes.map((note) => 
      note._id === updatedNote._id ? updatedNote : note
    );
    setNotes(updatedNotes);

    try {
      const response = await fetch(`/api/notes/${updatedNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      });
      if (!response.ok) throw new Error("Failed to update note");
      toast.success("Note saved!");
    } catch (error) {
      console.error("Error updating note:", error);
      setNotes(originalNotes);
      toast.error("Failed to save note");
    }
  };

  const duplicateNote = async (note: Note) => {
    if (!context?.user?.id) return;

    const duplicatedNote: Omit<Note, "_id"> = {
      title: `${note.title} (Copy)`,
      content: note.content,
      userId: context.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicatedNote),
      });

      if (!response.ok) throw new Error("Failed to duplicate note");
      const savedNote = await response.json();
      
      const noteWithDates = {
        ...savedNote,
        createdAt: new Date(savedNote.createdAt),
        updatedAt: new Date(savedNote.updatedAt),
      };
      
      setNotes([noteWithDates, ...notes]);
      setActiveNote(noteWithDates);
      toast.success("Note duplicated successfully!");
    } catch (error) {
      console.error("Error duplicating note:", error);
      toast.error("Failed to duplicate note");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note");

      setNotes(notes.filter((note) => note._id !== noteId));
      if (activeNote && activeNote._id === noteId) {
        setActiveNote(notes.find((note) => note._id !== noteId) || null);
      }
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading Whop Notes App...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Error</h2>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!context?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">
              Please access this app through Whop
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300`}
      >
        <NotesSidebar
          notes={notes}
          activeNote={activeNote}
          onNoteSelect={setActiveNote}
          onCreateNote={createNewNote}
          onDeleteNote={deleteNote}
          onDuplicateNote={duplicateNote}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {!isSidebarOpen && (
              <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {context.user.username || context.user.email || "User"}
            </span>
          </div>
        </header>

        <div className="flex-1 p-6">
          {activeNote ? (
            <NoteEditor activeNote={activeNote} onSaveNote={updateNote} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-4">No Note Selected</h2>
                <p>Select a note from the sidebar or create a new one</p>
                <button
                  onClick={createNewNote}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Your First Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}