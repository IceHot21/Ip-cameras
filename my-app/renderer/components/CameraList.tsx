import { FC, useEffect, useState } from 'react';
import CameraItem from './CameraItem';
import AddCameraButton from './AddCameraButton';

const CameraList:FC = () => {
  const [cameras, setCameras] = useState<any[]>([]);

  useEffect(() => {
    const savedCameras = localStorage.getItem('cameras');
    if (savedCameras) {
      setCameras(JSON.parse(savedCameras));
    }
  }, []);

  const handleDiscoverCameras = async () => {
    try {
      const response = await fetch('http://localhost:4200/ip/cameras-list');
      if (response.ok) {
        const discoveredCameras = await response.json();
        setCameras(discoveredCameras);
      } else {
        console.error('Failed to discover cameras');
      }
    } catch (error) {
      console.error('Error discovering cameras:', error);
    }
  };

  const handleAddCamera = (rtspUrl: string, cameraName: string, cameraId: number) => {
    const newCamera = { id: cameraId, rtspUrl, name: cameraName };
    const savedCameras = localStorage.getItem('cameras');
    let cameras = savedCameras ? JSON.parse(savedCameras) : [];
    cameras.push(newCamera);
    localStorage.setItem('cameras', JSON.stringify(cameras));
    setCameras(cameras);
  };

  return (
    <div>
      <AddCameraButton onClick={handleDiscoverCameras} />
      {cameras.map(camera => (
        <CameraItem key={camera.id} camera={camera} onAdd={handleAddCamera} />
      ))}
    </div>
  );
};

export default CameraList;