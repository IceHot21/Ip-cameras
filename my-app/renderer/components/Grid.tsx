import React, { FC } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';

interface Camera {
  id: number;
  name: string;
  address: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
}

interface GridProps {
  onCameraDrop: (camera: Camera, rowIndex: number, colIndex: number) => void;
  droppedCameras: { [key: string]: Camera };
  activeFloor: number;
}

const Grid: FC<GridProps> = ({ onCameraDrop, droppedCameras, activeFloor }) => {

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const cameraData = e.dataTransfer.getData('camera');
    const camera: Camera = JSON.parse(cameraData);

    onCameraDrop(camera, rowIndex, colIndex);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={GStyles.gridContainer}>
      <div className={GStyles.grid}>
        {Array.from({ length: 15 }).map((_, rowIndex) => (
          Array.from({ length: 20 }).map((_, colIndex) => {
            const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;

            return (
              <div
                key={cellKey}
                id={cellKey}
                className={GStyles.gridCell}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                onDragOver={handleDragOver}
              >
                {droppedCameras[cellKey] && (
                  <div className={GStyles.cameraIcon} id="cameraIcon">
                    <BsFillCameraVideoFill />
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Grid;
