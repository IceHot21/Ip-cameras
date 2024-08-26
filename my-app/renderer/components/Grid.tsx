import React, { FC, useState } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import StartStream from './StartStream';
import ModalStream from './ModalStream'; // Импортируйте компонент Modal

interface Camera {
  id: number;
  name: string;
  address: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}

interface GridProps {
  onCameraDrop: (camera: Camera, rowIndex: number, colIndex: number) => void;
  droppedCameras: { [key: string]: Camera };
  activeFloor: number;
}

const Grid: FC<GridProps> = ({ onCameraDrop, droppedCameras, activeFloor }) => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('camera', JSON.stringify(camera));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDoubleClick = (camera: Camera) => {
    setSelectedCamera(camera);
    setShowModal(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const cameraData = e.dataTransfer.getData('camera');
    const camera: Camera = JSON.parse(cameraData);

    if (typeof camera.initialPosition === 'object' && camera.initialPosition !== null) {
      const initialCellKey = `${activeFloor}-${camera.initialPosition.rowIndex}-${camera.initialPosition.colIndex}`;
      delete droppedCameras[initialCellKey];
    }

    const newCellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
    droppedCameras[newCellKey] = camera;
    camera.initialPosition = { rowIndex, colIndex };
    onCameraDrop(camera, rowIndex, colIndex);
  };

  return (
    <div className={GStyles.gridContainer}>
      <div className={GStyles.grid}>
        {Array.from({ length: 15 }).map((_, rowIndex) =>
          Array.from({ length: 20 }).map((_, colIndex) => {
            const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;

            return (
              <div
                key={cellKey}
                id={cellKey}
                className={GStyles.gridCell}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              >
                {droppedCameras[cellKey] && (
                  <div
                    className={GStyles.cameraIcon}
                    id="cameraIcon"
                    draggable
                    onDragStart={(e) => handleDragStart(e, droppedCameras[cellKey])}
                    onDoubleClick={() => handleDoubleClick(droppedCameras[cellKey])}
                  >
                    <BsFillCameraVideoFill />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ModalStream isOpen={showModal} onClose={() => setShowModal(false)}>
        {selectedCamera && (
          <StartStream
            rtspUrl={selectedCamera.rtspUrl}
            id={selectedCamera.id}
            cameraName={selectedCamera.name}
            setCam={() => setShowModal(false)}  // Добавляем закрытие стрима
          />
        )}
      </ModalStream>
    </div>
  );
};

export default Grid;
