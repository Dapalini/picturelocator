// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import dbConnect from '@/lib/mongoose';
import Photo from '@/models/Photo';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { image, latitude, longitude, timestamp } = await req.json();

    // Validate the required fields
    if (!image || latitude === undefined || longitude === undefined || !timestamp) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Decode the base64 image
    const buffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    // Generate a unique filename
    const fileName = `images/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}.png`;

    // Upload to Vercel Blob Storage using the new API
    const result = await put(fileName, buffer, {
      access: 'public',
      contentType: 'image/png',
    });

    const imageUrl = result.url;

    // Create a new Photo document
    const photo = new Photo({
      imageUrl,
      latitude,
      longitude,
      timestamp,
    });

    // Save the document to MongoDB
    await photo.save();

    return NextResponse.json(
      { message: 'Photo uploaded successfully', imageUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { message: 'Error uploading photo' },
      { status: 500 }
    );
  }
}
