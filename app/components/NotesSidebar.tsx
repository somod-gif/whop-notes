'use client';

import { useState } from 'react';

interface Note {
  _id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface NotesSidebarProps {
  notes: Note[];
  activeNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onDuplicateNote: (note: Note) => void;
}

export default function NotesSidebar({ 
  notes, 
  activeNote, 
  onNoteSelect, 
  onCreateNote, 
  onDeleteNote,
  onDuplicateNote 
}: NotesSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | string) => {
    // Ensure date is a proper Date object
    const noteDate = date instanceof Date ? date : new Date(date);
    
    // Check if it's a valid date
    if (isNaN(noteDate.getTime())) {
      return 'Unknown date';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - noteDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return noteDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDeleteClick = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(noteId);
  };

  const confirmDelete = (noteId: string) => {
    onDeleteNote(noteId);
    setShowDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleDuplicate = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicateNote(note);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
          <button
            onClick={onCreateNote}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchTerm ? 'No notes found' : 'No notes yet'}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors group relative ${
                activeNote && activeNote._id === note._id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => onNoteSelect(note)}
            >
              {/* Delete Confirmation Overlay */}
              {showDeleteConfirm === note._id && (
                <div className="absolute inset-0 bg-red-50 border border-red-200 rounded flex items-center justify-center space-x-2 z-10">
                  <span className="text-red-600 text-sm font-medium">Delete?</span>
                  <button
                    onClick={() => confirmDelete(note._id!)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1"
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium px-2 py-1"
                  >
                    No
                  </button>
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 truncate flex-1 text-sm">
                  {note.title || 'Untitled Note'}
                </h3>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDuplicate(note, e)}
                    className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                    title="Duplicate note"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(note._id!, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete note"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 line-clamp-2 mb-2 text-xs">
                {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}
              </p>
              <p className="text-gray-400 text-xs">
                {formatDate(note.updatedAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}