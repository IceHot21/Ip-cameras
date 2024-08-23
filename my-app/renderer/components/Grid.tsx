import { FC, useState } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';

interface Camera {
  id: number;
  name: string;
  address: string;
}

const Grid: FC = () => {
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera | null }>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const cameraData = e.dataTransfer.getData('camera');
    const camera: Camera = JSON.parse(cameraData);

    const cellKey = `${rowIndex}-${colIndex}`;

    setDroppedCameras((prev) => ({
      ...prev,
      [cellKey]: camera,
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell(`${rowIndex}-${colIndex}`);
  };

  return (
    <div className={GStyles.gridContainer}>
      <div className={GStyles.grid}>
        {Array.from({ length: 15 }).map((_, rowIndex) => (
          Array.from({ length: 20 }).map((_, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;

            return (
              <div
                key={cellKey}
                id={cellKey}
                className={GStyles.gridCell}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                onDragOver={handleDragOver}
              >
                {droppedCameras[cellKey] && (
                  <div className={GStyles.cameraIcon}>
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
