// app/api/photos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Photo, { PhotoData } from '@/models/Photo';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all photos from the database
    const photos: PhotoData[] = await Photo.find({});

    return NextResponse.json({ photos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ message: 'Error fetching photos' }, { status: 500 });
  }
}
