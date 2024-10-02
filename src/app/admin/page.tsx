// app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PhotoData } from '@/models/Photo';
import { useRouter } from 'next/navigation';

const MapComponent = dynamic(() => import('../../components/MapComponent'), {
    ssr: false, // This line disables SSR for MapComponent
  });

const AdminPage: React.FC = () => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const router = useRouter();


  useEffect(() => {
    const password = prompt('Enter admin password:');
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert('Incorrect password');
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (authorized) {
      fetch('/api/photos')
        .then((res) => res.json())
        .then((data) => setPhotos(data.photos))
        .catch((error) => console.error('Error fetching photos:', error));
    }
  }, [authorized]);

  if (!authorized) {
    return null;
  }

  return (
    <div>
      <h1>Admin Map</h1>
      <MapComponent photos={photos} />
    </div>
  );
};

export default AdminPage;
