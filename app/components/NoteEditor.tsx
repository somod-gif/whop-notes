"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-wysiwyg";

interface Note {
  _id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface NoteEditorProps {
  activeNote: Note | null;
  onSaveNote: (note: Note) => void;
}

export default function NoteEditor({
  activeNote,
  onSaveNote,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setTitle(activeNote?.title || "");
    setContent(activeNote?.content || "");

    // Ensure lastSaved is always a proper Date object
    if (activeNote?.updatedAt) {
      const updatedAt =
        typeof activeNote.updatedAt === "string"
          ? new Date(activeNote.updatedAt)
          : activeNote.updatedAt;
      setLastSaved(updatedAt);
    } else {
      setLastSaved(null);
    }
  }, [activeNote]);

  // Auto-save functionality
  useEffect(() => {
    if (!activeNote?._id) return;

    const timeoutId = setTimeout(async () => {
      if (title !== activeNote.title || content !== activeNote.content) {
        setIsSaving(true);
        const updatedNote: Note = {
          ...activeNote,
          title,
          content,
          updatedAt: new Date(),
        };
        await onSaveNote(updatedNote);
        setIsSaving(false);
        setLastSaved(new Date());
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title, content, activeNote, onSaveNote]);
  const formatDate = (date: Date | string) => {
    // Ensure date is a proper Date object
    const noteDate = date instanceof Date ? date : new Date(date);

    // Check if it's a valid date
    if (isNaN(noteDate.getTime())) {
      return "Unknown date";
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - noteDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return noteDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  const formatLastSaved = () => {
    if (!lastSaved) return "";

    // Ensure lastSaved is a Date object
    const lastSavedDate =
      lastSaved instanceof Date ? lastSaved : new Date(lastSaved);

    // Check if it's a valid date
    if (isNaN(lastSavedDate.getTime())) {
      return "Unknown";
    }

    const now = new Date();
    const diffMs = now.getTime() - lastSavedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    return lastSavedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCreationDate = (date: Date | string) => {
    const creationDate = date instanceof Date ? date : new Date(date);

    if (isNaN(creationDate.getTime())) {
      return "Unknown date";
    }

    return creationDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <input
          type="text"
          className="w-full text-2xl font-light text-gray-900 outline-none placeholder-gray-400 mb-2"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {activeNote && (
              <>
                <span>Created: {formatCreationDate(activeNote.createdAt)}</span>
                <span>•</span>
                <span className={isSaving ? "text-blue-500" : "text-green-500"}>
                  {isSaving ? "Saving..." : `Saved ${formatLastSaved()}`}
                </span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {content.replace(/<[^>]*>/g, "").length} characters
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 overflow-auto">
        <Editor
          value={content}
          onChange={(e) => setContent(e.target.value)}
          containerProps={{
            style: {
              height: "100%",
              border: "none",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
          }}
        />
      </div>
    </div>
  );
}
