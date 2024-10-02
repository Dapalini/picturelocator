// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Photo from '@/models/Photo';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const data = await req.json();

    // Create a new Photo document
    const photo = new Photo(data);

    // Save the document to MongoDB
    await photo.save();

    return NextResponse.json({ message: 'Photo uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ message: 'Error uploading photo' }, { status: 500 });
  }
}
