import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/backend/lib/database';
import Note from '@/app/backend/models/Note';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const note = await Note.findById(params.id).lean();
  if (!note) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  return NextResponse.json(note);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { title, content } = await req.json();
  const updatedNote = await Note.findByIdAndUpdate(
    params.id,
    { title, content },
    { new: true }
  );
  if (!updatedNote) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  return NextResponse.json(updatedNote);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const deletedNote = await Note.findByIdAndDelete(params.id);
  if (!deletedNote) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  return NextResponse.json({ message: 'Deleted successfully' });
}
