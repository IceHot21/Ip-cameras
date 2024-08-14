import { FC, useEffect, useState } from 'react';
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

const Translation: FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [FlagLocal, setFlagLocal] = useState(true);

  useEffect(() => {
    const savedCameras = localStorage.getItem('cameras');
    if (savedCameras) {
      const cameras = JSON.parse(savedCameras);
      setCameras(cameras);
    }
  }, [FlagLocal]);

  const handleDeleteCamera = async (id: number) => {
    const savedCameras = localStorage.getItem('cameras');
    if (!savedCameras) return;
  
    let newCameras: Camera[] = JSON.parse(savedCameras);
    const camera = newCameras.find((camera) => camera.id === id);
    if (!camera) return;

    const port = 9999 + id;
    const response = await fetch('http://localhost:4200/ip/stop-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ port })
    });

    if (!response.ok) {
      console.error(`Failed to stop stream: ${response.statusText}`);
      return;
    }

    if (JSMpeg.Players && JSMpeg.Players[port]) {
      JSMpeg.Players[port].destroy();
      delete JSMpeg.Players[port];
    }

    newCameras = newCameras.filter((camera) => camera.id !== id);
    localStorage.setItem('cameras', JSON.stringify(newCameras));
    const canvasContainer = document.querySelector(`.canvas-container[data-index="${id}"]`);
    if (canvasContainer) {
      canvasContainer.parentElement?.removeChild(canvasContainer);
    }
    setCameras(newCameras);
  };

  const handleCameraSelection = (cameras: Camera[]) => {
    setSelectedCameras(cameras);
    setIsListCameraOpen(false);
  };

  return (
    <div>
      <button className={TStyles.plusSing} onClick={() => setIsListCameraOpen(true)}>+</button>

      <ListCamera 
        open={isListCameraOpen} 
        onClose={() => setIsListCameraOpen(false)} 
        onSelectCameras={handleCameraSelection}
        FlagLocal={() => setFlagLocal(prev => !prev)}
      />

      {/* Отображение стримов для каждой выбранной камеры */}
      <div id="canvases">
        {cameras.map((camera) => (
          <div key={camera.id}>
            <h3>{camera.name ? camera.name : 'N/A'}</h3>
            <StartStream rtspUrl={camera.rtspUrl} id={camera.id} cameraName={camera.name ? camera.name : 'N/A'} />
            <button onClick={() => handleDeleteCamera(camera.id)}>Удалить камеру</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Translation;