import { FC, useEffect, useState, memo } from 'react';
import MSStyles from '../styles/ModalStream.module.css';
import StartStream from './StartStream';

interface ModalStreamProps {
  navigate: (path: string) => Promise<boolean>;
  selectedCameras: Camera[];
  setCam: (cameras: any) => void;
  onClose: () => void;
  isPredictions: Prediction | null;
}

interface Camera {
  id: number;
  port:number;
  name: string;
  address: string;
  floor?: number;
  cell?: string;
  initialPosition?: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}

interface Prediction {
  id: number;
  camera_port: number;
  item_predict: string;
  score_predict: string;
  date: string;
  bbox: number[];
}


const ModalStream: FC<ModalStreamProps> = memo(({ selectedCameras, setCam, onClose, isPredictions, navigate }) => {
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
                navigate={navigate}
                key={camera.id}
                port={camera.port}
                rtspUrl={camera.rtspUrl}
                id={camera.id}
                cameraName={camera.name}
                isPredictions={isPredictions}
                setCam={setCam}
                onClose={onClose}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ModalStream;