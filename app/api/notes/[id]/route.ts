import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getNotesCollection, noteToJSON } from '@/lib/mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate the ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    const notesCollection = await getNotesCollection();
    const updatedNote = {
      title: body.title,
      content: body.content,
      updatedAt: new Date(),
    };

    const result = await notesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedNote }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Fetch the updated note to return complete data
    const updatedDocument = await notesCollection.findOne({ _id: new ObjectId(id) });
    
    if (!updatedDocument) {
      return NextResponse.json({ error: 'Note not found after update' }, { status: 404 });
    }

    return NextResponse.json(noteToJSON(updatedDocument));
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate the ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
    }
    
    const notesCollection = await getNotesCollection();
    const result = await notesCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}