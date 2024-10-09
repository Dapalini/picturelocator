// app/page.tsx
'use client';

import React, { useState } from 'react';
import Camera from '../components/Camera';


const HomePage: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  const handleCapture = (imageData: string) => {
    uploadPhoto(imageData);
  };

  const handleUpload = (imageFiles: FileList) => {
    Array.from(imageFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        uploadPhoto(imageData);
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadPhoto = (imageData: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = new Date().toISOString();

          const photoData = {
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
      <Camera onCapture={handleCapture} onUpload={handleUpload} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default HomePage;
