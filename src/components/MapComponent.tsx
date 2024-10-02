// components/MapComponent.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PhotoData } from '@/models/Photo';

interface MapComponentProps {
  photos: PhotoData[];
}

interface DefaultIconPrototype extends L.Icon.Default {
    _getIconUrl?: () => string;
  }

delete (L.Icon.Default.prototype as DefaultIconPrototype)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent: React.FC<MapComponentProps> = ({ photos }) => {
  const position: [number, number] = [0, 0];

  return (
    <MapContainer center={position} zoom={2} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {photos.map((photo, idx) => (
        <Marker key={idx} position={[photo.latitude, photo.longitude]}>
          <Popup>
          <Image
                src={photo.image}
                alt="User Photo"
                width={200}
                height={200}
                unoptimized // Add this prop to allow data URLs or external images
            />
            <p>{new Date(photo.timestamp).toLocaleString()}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
