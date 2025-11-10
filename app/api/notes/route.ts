import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/backend/lib/database';
import Note from '@/app/backend/models/Note';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const notes = await Note.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { title, content, userId } = await req.json();

  if (!title || !content || !userId) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const note = await Note.create({ title, content, userId });
  return NextResponse.json(note, { status: 201 });
}
