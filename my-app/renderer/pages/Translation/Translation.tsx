import { FC, useEffect, useState, useRef } from 'react';
import TStyles from './Transletion.module.css';
import ListCamera from '../../components/ListCamera';
import StreamPlayer from '../../components/StartStream'; // Импортируйте StreamPlayer
import JSMpeg from '@cycjimmy/jsmpeg-player';

interface Camera {
  id: number;
  name: string;
  address: string;
  rtspUrl: string;
}

const Translation: FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [FlagLocal, setFlagLocal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const canvasesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCameras = localStorage.getItem('cameras');
    if (savedCameras) {
      const cameras = JSON.parse(savedCameras);
      setCameras(cameras);
    }
  }, [FlagLocal]);

  const handleCameraSelection = (cameras: Camera[]) => {
    setSelectedCameras(cameras);
    setIsListCameraOpen(false);
  };

  const handleAddCamera = async () => {
    setIsListCameraOpen(true);
  };

  return (
    <div>
      <ListCamera
        open={isListCameraOpen}
        onClose={() => setIsListCameraOpen(false)}
        onSelectCameras={handleCameraSelection}
        FlagLocal={() => setFlagLocal(prev => !prev)}
      />

      {/* Отображение стримов для каждой выбранной камеры */}
      <div id="canvases" className={TStyles.canvasesContainer} /* ref={canvasesContainerRef} */>
        {cameras.map((camera) => (
          <StreamPlayer
            key={camera.id}
            rtspUrl={camera.rtspUrl}
            id={camera.id}
            cameraName={camera.name ? camera.name : 'N/A'}
            setCam={setCameras}
          />
        ))}
        <span
          className={TStyles.plusSign}
          onClick={handleAddCamera}
          style={{ pointerEvents: isLoading ? 'none' : 'auto', cursor: isLoading ? 'default' : 'pointer' }}
        >
          {isLoading ? 'Подождите...' : '+'}
        </span>
      </div>
    </div>
  );
};

export default Translation;