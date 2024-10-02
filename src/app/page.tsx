// app/page.tsx
'use client';

import React, { useState } from 'react';
import Camera from '../components/Camera';

interface PhotoData {
  image: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const HomePage: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  const handleCapture = (imageData: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = new Date().toISOString();

          const photoData: PhotoData = {
            image: imageData,
            latitude,
            longitude,
            timestamp,
          };

          // Send data to the server
          fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(photoData),
          })
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((error) => {
              console.error('Error uploading photo:', error);
              setMessage('Error uploading photo');
            });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setMessage('Error getting geolocation');
        }
      );
    } else {
      setMessage('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <h1>Take a Picture</h1>
      <Camera onCapture={handleCapture} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default HomePage;
