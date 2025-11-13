import { NextRequest, NextResponse } from 'next/server';
import { getNotesCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const notesCollection = await getNotesCollection();
    const notes = await notesCollection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    
    const serializedNotes = notes.map(note => ({
      ...note,
      _id: note._id?.toString(),
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    }));
    
    return NextResponse.json(serializedNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch notes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const notesCollection = await getNotesCollection();
    const newNote = {
      title: body.title || 'Untitled Note',
      content: body.content || '',
      userId: body.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Fix: Use simpler insert without complex write concern
    const result = await notesCollection.insertOne(newNote, { 
      writeConcern: { w: 1 } // Use simpler write concern
    });
    
    const createdNote = { 
      ...newNote, 
      _id: result.insertedId.toString(),
      createdAt: newNote.createdAt.toISOString(),
      updatedAt: newNote.updatedAt.toISOString(),
    };

    return NextResponse.json(createdNote);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ 
      error: 'Failed to create note',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}