// components/Camera.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Stop the video stream when the component unmounts
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Error accessing camera');
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const imageData = canvasRef.current.toDataURL('image/png');
        onCapture(imageData);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay width="640" height="480" />
      <div>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={takePicture}>Take Picture</button>
      </div>
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;
