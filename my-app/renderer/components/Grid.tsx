import { FC } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';

interface Camera {
  id: number;
  name: string;
  address: string;
  position: { row: number, col: number } | null;
}

interface GridProps {
  cameras: Camera[];
  onUpdateCameraPosition: (camera: Camera, position: { row: number; col: number }) => void; // правильно указанное имя функции
}

const Grid: FC<GridProps> = ({ cameras, onUpdateCameraPosition }) => {

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    
    const cameraData = e.dataTransfer.getData('camera');
    const camera: Camera = JSON.parse(cameraData);
    
    onUpdateCameraPosition(camera, { row: rowIndex, col: colIndex });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={GStyles.gridContainer}>
      <div className={GStyles.grid}>
        {Array.from({ length: 15 }).map((_, rowIndex) => (
          Array.from({ length: 20 }).map((_, colIndex) => {
            const cameraInCell = cameras.find(camera => 
              camera.position?.row === rowIndex && camera.position?.col === colIndex
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={GStyles.gridCell}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                onDragOver={handleDragOver}
              >
                {cameraInCell && <BsFillCameraVideoFill />}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Grid;
