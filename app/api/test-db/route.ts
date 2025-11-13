import { NextResponse } from 'next/server';
import { getNotesCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const notesCollection = await getNotesCollection();
    
    // Test the connection by counting documents
    const count = await notesCollection.countDocuments();
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      noteCount: count
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}