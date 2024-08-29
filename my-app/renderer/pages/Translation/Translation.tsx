/* import React, { useState, useEffect, useRef } from 'react';
import TStyles from './Transletion.module.css';
import ListCamera from '../../components/ListCamera';
import StartStream from '../../components/StartStream';
import JSMpeg from '@cycjimmy/jsmpeg-player';

interface Camera {
  id: number;
  name: string;
  address: string;
  rtspUrl: string;
}

const Translation: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [FlagLocal, setFlagLocal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCameras = localStorage.getItem('cameras');
    console.log(savedCameras);
    if (savedCameras) {
      const cameras = JSON.parse(savedCameras);
      setCameras(cameras);
    }
  }, [FlagLocal]);

  const handleCameraSelection = (cameras: Camera[]) => {
    setCameras(cameras);
    setIsListCameraOpen(false);
  };

  const handleAddCamera = async () => {
    setIsListCameraOpen(true);
  };

  return (
    <div className={TStyles.canvasesContainer}>
      {cameras.map((camera) => (
        <StartStream
          key={camera.id}
          rtspUrl={camera.rtspUrl}
          id={camera.id}
          cameraName={camera.name ? camera.name : 'N/A'}
          setCam={setCameras}
        />
      ))}
      <div className={TStyles.listCameraPlaceholder}>
        {isLoading ? (
          <span className={TStyles.plusSign}>Подождите...</span>
        ) : (
          <>
            {isListCameraOpen && (
              <ListCamera
                open={isListCameraOpen}
                onClose={() => setIsListCameraOpen(false)}
                onSelectCameras={handleCameraSelection}
                FlagLocal={() => setFlagLocal(prev => !prev)}
              />
            )}
            {!isListCameraOpen && (
              <span
                className={TStyles.plusSign}
                onClick={handleAddCamera}
                style={{ pointerEvents: isLoading ? 'none' : 'auto', cursor: isLoading ? 'default' : 'pointer' }}
              >
                +
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Translation; */