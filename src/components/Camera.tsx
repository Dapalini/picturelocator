// components/Camera.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onUpload: (imageFiles: FileList) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onUpload }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    startCamera();

    return () => {
      // Stop the video stream when the component unmounts
      stream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setErrorMessage('No camera found');
    }
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        onCapture(imageData);
      }
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onUpload(event.target.files);
    }
  };

  return (
    <div className="camera-container">
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
          <div className="camera-controls">
            <button className="switch-camera-button" onClick={switchCamera}>
              🔄
            </button>
            <button className="capture-button" onClick={takePicture}></button>
            <label htmlFor="upload-input" className="upload-button">
              ⬆️
              <input
                id="upload-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </>
      )}

      <style jsx>{`
        .camera-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background-color: black;
        }

        .camera-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .error-message {
          color: white;
          text-align: center;
          margin-top: 20px;
        }

        .camera-controls {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .switch-camera-button {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.7);
          border: none;
          border-radius: 5px;
          font-size: 24px;
          pointer-events: auto;
        }

        .capture-button {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 70px;
          background-color: red;
          border: 5px solid black;
          border-radius: 50%;
          pointer-events: auto;
        }

        .upload-button {
          position: absolute;
          bottom: 40px;
          right: 20px;
          width: 60px;
          height: 60px;
          background-color: blue;
          border: none;
          border-radius: 5px;
          font-size: 24px;
          color: white;
          text-align: center;
          line-height: 60px;
          cursor: pointer;
          pointer-events: auto;
        }

        /* Hide the file input */
        .upload-button input[type='file'] {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Camera;
