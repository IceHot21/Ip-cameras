import React, { FC, useState, useEffect } from 'react';
import { BsLayoutTextWindow } from "react-icons/bs";
import FStyles from './Feeding.module.css';
import Room from '../../components/Room';
import Grid from '../../components/Grid';
import ListCamera from '../../components/ListCamera';

interface Camera {
  id: number;
  name: string;
  address: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}

const Feeding: FC = () => {
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFloor, setActiveFloor] = useState(0);
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera }>({});
  
  useEffect(() => {
    const storedCameras = localStorage.getItem('droppedCameras');
    if (storedCameras) {
      setDroppedCameras(JSON.parse(storedCameras));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(droppedCameras).length > 0) {
      localStorage.setItem('droppedCameras', JSON.stringify(droppedCameras));
    }
  }, [droppedCameras]);

  const handleListCameraToggle = () => {
    setIsListCameraOpen(!isListCameraOpen);
  };

  const handleGridOpen = () => {
    setIsGridOpen(prev => !prev);
    setIsEditing(!isGridOpen);
  };

  const handleCameraDrop = (camera: Camera, rowIndex: number, colIndex: number) => {
    const cellKey = `${activeFloor}-${rowIndex}-${colIndex};`
    const updatedCamera: Camera = {
      ...camera,
      floor: activeFloor,
      cell: cellKey,
      initialPosition: { rowIndex, colIndex },
    };

    setDroppedCameras(prev => ({
      ...prev,
      [cellKey]: updatedCamera,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setIsGridOpen(false);
  };

  const handleFloorChange = (floor: number) => {
    setActiveFloor(floor);
  };

  return (
    <div>
      <div className={FStyles.listContainer}>
        <BsLayoutTextWindow
          className={FStyles.listIcon}
          onClick={handleListCameraToggle}
        />
      </div>
      {isListCameraOpen && (
        <ListCamera
          open={isListCameraOpen}
          onClose={() => setIsListCameraOpen(false)}
          onSelectCameras={handleListCameraToggle}
          FlagLocal={() => {}}
          onGridOpen={handleGridOpen}
        />
      )}
      <div className={FStyles.roomContainer}>
        <Room
          children={null}
          svgProps={{}}
          onCameraDropped={handleCameraDrop}
          droppedCameras={droppedCameras}
          activeFloor={activeFloor}
          onFloorChange={handleFloorChange}
        />
        {isEditing && (
          <div className={FStyles.gridContainer}>
            <Grid
              onCameraDrop={handleCameraDrop}
              droppedCameras={droppedCameras}
              activeFloor={activeFloor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Feeding;