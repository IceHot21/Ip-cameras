import { FC, useState } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs'

interface Camera {
  id: number;
  name: string;
  address: string;
}

const Grid: FC = () => {
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera | null }>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const cameraData = e.dataTransfer.getData('camera');
    const camera: Camera = JSON.parse(cameraData);

    setDroppedCameras((prev) => ({
      ...prev,
      [`${rowIndex}-${colIndex}`]: camera,
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
      <div
        className={GStyles.grid}
      >
        {Array.from({ length: 15 }).map((_, rowIndex) => (
          Array.from({ length: 20 }).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              id={`${rowIndex}-${colIndex}`}
              className={GStyles.gridCell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              onDragOver={handleDragOver}
            >
              {droppedCameras && droppedCameras[`${rowIndex}-${colIndex}`] !== null && (
                <BsFillCameraVideoFill />
              )}
              {selectedCell === `${rowIndex}-${colIndex}` && (
                <div className={GStyles.selectedCell} />
              )}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default Grid;