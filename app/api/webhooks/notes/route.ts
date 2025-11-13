import { NextRequest, NextResponse } from 'next/server';
import { getNotesCollection, Note } from '@/lib/mongodb';
import { headers } from 'next/headers';
import { whopsdk } from '@/lib/whop-sdk';

export async function GET(request: NextRequest) {
  try {
    // Verify user token from Whop
    const token = headers().get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await whopsdk.verifyUserToken(token);
    const notesCollection = await getNotesCollection();
    const notes = await notesCollection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    
    // Convert _id to string for JSON serialization
    const serializedNotes = notes.map(note => ({
      ...note,
      _id: note._id?.toString(),
    }));
    
    return NextResponse.json(serializedNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = headers().get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await whopsdk.verifyUserToken(token);
    const body = await request.json();
    
    const notesCollection = await getNotesCollection();
    const newNote: Omit<Note, '_id'> = {
      title: body.title || 'Untitled Note',
      content: body.content || '',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await notesCollection.insertOne(newNote);
    const createdNote = { ...newNote, _id: result.insertedId.toString() };

    return NextResponse.json(createdNote);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}