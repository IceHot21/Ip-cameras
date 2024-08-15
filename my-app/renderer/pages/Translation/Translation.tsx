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



  const handleStartRecording = (id: number) => {
    console.log(`Start recording for camera with id ${id}`);
    // Implement your recording logic here
  };

  const handleTakeScreenshot = (id: number) => {
    console.log(`Take screenshot for camera with id ${id}`);
    // Implement your screenshot logic here
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
          <StartStream
            key={camera.id}
            rtspUrl={camera.rtspUrl}
            id={camera.id}
            cameraName={camera.name ? camera.name : 'N/A'}
/*             onDelete={handleDeleteCamera}
            onStartRecording={handleStartRecording}
            onTakeScreenshot={handleTakeScreenshot} */
          />
        ))}
      </div>
    </div>
  );
};

export default Translation;