// models/Photo.ts

import { Schema, model, models } from 'mongoose';

export interface PhotoData {
  image: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const PhotoSchema = new Schema<PhotoData>({
  image: { type: String, required: true },
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 },
  timestamp: { type: String, required: true },
});

const Photo = models.Photo || model<PhotoData>('Photo', PhotoSchema);

export default Photo;
