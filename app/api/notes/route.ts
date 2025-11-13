import { NextRequest, NextResponse } from 'next/server';
import { getNotesCollection, noteToJSON } from '@/lib/mongodb';

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

    return NextResponse.json(notes.map(noteToJSON));
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const notesCollection = await getNotesCollection();
    const newNote = {
      title: body.title,
      content: body.content,
      userId: body.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await notesCollection.insertOne(newNote);
    
    // Fetch the complete note with the generated _id
    const createdNote = await notesCollection.findOne({ _id: result.insertedId });
    
    if (!createdNote) {
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }

    return NextResponse.json(noteToJSON(createdNote), { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}