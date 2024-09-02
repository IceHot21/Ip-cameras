import { FC, useEffect, useState } from 'react';
import MSStyles from '../styles/ModalStream.module.css';
import StartStream from './StartStream';

interface ModalStreamProps {
  selectedCameras: Camera[];
  setCam: (cameras: any) => void;
}

interface Camera {
  id: number;
  name: string;
  address: string;
  floor?: number;
  cell?: string;
  initialPosition?: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}

const ModalStream: FC<ModalStreamProps> = ({ selectedCameras, setCam }) => {
  const [cameras, setCameras] = useState<Camera[]>(selectedCameras);

  useEffect(() => {
    setCameras(selectedCameras);
  }, [selectedCameras]);

  if (!selectedCameras.length) return null;

  return (
    <div className={MSStyles.modalOverlay}>
      <div className={MSStyles.modalContent}>
        <div className={MSStyles.cameraContainer}>
          {cameras.map((camera) => (
            <div key={camera.id} className={MSStyles.cameraItem}>
              <StartStream
                key={camera.id}
                rtspUrl={camera.rtspUrl}
                id={camera.id}
                cameraName={camera.name}
                setCam={setCam}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalStream;