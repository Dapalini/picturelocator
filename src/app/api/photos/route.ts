// app/api/photos/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Photo from '@/models/Photo';

export async function GET() {
  try {
    await dbConnect();
    const photos = await Photo.find({});
    return NextResponse.json({ photos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ message: 'Error fetching photos' }, { status: 500 });
  }
}
