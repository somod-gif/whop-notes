import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getNotesCollection } from '@/lib/mongodb';
import { headers } from 'next/headers';
import { whopsdk } from '@/lib/whop-sdk';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const token = (await headers()).get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await whopsdk.verifyUserToken(token);
    const { id } = await params;
    const body = await request.json();
    
    const notesCollection = await getNotesCollection();
    const updatedNote = {
      title: body.title,
      content: body.content,
      updatedAt: new Date(),
    };

    const result = await notesCollection.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: updatedNote }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ ...updatedNote, _id: id });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const token = (await headers()).get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await whopsdk.verifyUserToken(token);
    const { id } = await params;
    
    const notesCollection = await getNotesCollection();
    const result = await notesCollection.deleteOne({
      _id: new ObjectId(id),
      userId
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