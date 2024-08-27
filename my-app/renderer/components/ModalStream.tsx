import { FC, useEffect, useState } from 'react';
import MSStyles from '../styles/ModalStream.module.css';
import StartStream from './StartStream';

interface ModalStreamProps {
  onClose: () => void;
  selectedCameras: any[];
  setCam: (cameras: any[]) => void;
}

const ModalStream: FC<ModalStreamProps> = ({ onClose, selectedCameras, setCam }) => {
  const [cameras, setCameras] = useState(selectedCameras);

  useEffect(() => {
    setCameras(selectedCameras);
  }, [selectedCameras]);

  if (!selectedCameras.length) return null;

  return (
    <div className={MSStyles.modalOverlay}>
      <div className={MSStyles.modalContent}>
        <button onClick={onClose} className={MSStyles.closeButton}>
          Close
        </button>
        <div className={MSStyles.cameraContainer}>
          {selectedCameras.map((camera) => (
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