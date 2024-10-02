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
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  useEffect(() => {
    startCamera();

    return () => {
      // Stop the video stream when the component unmounts
      stream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const startCamera = async () => {
    setErrorMessage(''); // Reset error message
    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
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
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
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

        // Trigger flash effect
        setIsFlashing(true);
        setTimeout(() => {
          setIsFlashing(false);
        }, 1000);
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
      <video ref={videoRef} autoPlay playsInline className="camera-video" />
      <div className="camera-controls">
        <button className="switch-camera-button" onClick={switchCamera}>
          🔄
        </button>
        {errorMessage ? (
          <div className="error-message">{errorMessage}</div>
        ) : (
          <>
            <button
              className={`capture-button ${isFlashing ? 'flashing' : ''}`}
              onClick={takePicture}
            ></button>
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
          </>
        )}
      </div>

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

        .switch-camera-button,
        .upload-button {
          position: absolute;
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.7);
          border: none;
          border-radius: 5px;
          font-size: 24px;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .switch-camera-button {
          top: 20px;
          right: 20px;
        }

        .upload-button {
          bottom: 40px;
          right: 20px;
          cursor: pointer;
        }

        /* Hide the file input */
        .upload-button input[type='file'] {
          display: none;
        }

        .capture-button {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 70px;
          background-color: red;
          border: 5px solid red; /* Outer red border */
          border-radius: 50%;
          position: relative;
          pointer-events: auto;
        }

        .capture-button::after {
          content: '';
          position: absolute;
          top: 5px; /* Equal to outer border thickness */
          left: 5px;
          width: calc(100% - 10px);
          height: calc(100% - 10px);
          background-color: red;
          border: 2px solid black; /* Inner black border */
          border-radius: 50%;
        }

        @keyframes flash {
          0% {
            background-color: red;
          }
          50% {
            background-color: white;
          }
          100% {
            background-color: red;
          }
        }

        .capture-button.flashing {
          animation: flash 1s;
        }
      `}</style>
    </div>
  );
};

export default Camera;
