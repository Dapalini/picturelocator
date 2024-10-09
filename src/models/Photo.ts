// models/Photo.ts

import mongoose, { Document, Model } from 'mongoose';

export interface PhotoData {
  imageUrl: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface PhotoDocument extends PhotoData, Document {}

const PhotoSchema = new mongoose.Schema<PhotoDocument>({
  imageUrl: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const Photo: Model<PhotoDocument> =
  mongoose.models.Photo || mongoose.model<PhotoDocument>('Photo', PhotoSchema);

export default Photo;
