import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Photo from '@/models/Photo';

export async function GET() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database.');

    console.log('Fetching photos...');
    const photos = await Photo.find({});
    console.log('Fetched photos:', photos);

    return NextResponse.json({ photos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ message: 'Error fetching photos' }, { status: 500 });
  }
}