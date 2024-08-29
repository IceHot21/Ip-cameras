import React, { FC, useState, useEffect } from 'react';
import { BsLayoutTextWindow } from "react-icons/bs";
import FStyles from './Feeding.module.css';
import Room from '../../components/Room';
import Grid from '../../components/Grid';
import ListCamera from '../../components/ListCamera1';
import ModalStream from '../../components/ModalStream';

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
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [isModalStreamOpen, setIsModalStreamOpen] = useState(false);
  const [FlagLocal, setFlagLocal] = useState(true);

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

  useEffect(() => {
    if (FlagLocal) {
      const savedCameras = localStorage.getItem('cameras');
      if (savedCameras) {
        const cameras = JSON.parse(savedCameras);
        setSelectedCameras(cameras);
      }
      console.log(savedCameras);
      setIsModalStreamOpen(true);
    }
  }, [FlagLocal]);

  const handleListCameraToggle = () => {
    setIsListCameraOpen(!isListCameraOpen);
  };

  const handleGridOpen = () => {
    setIsGridOpen((prev) => !prev);
    setIsEditing(!isGridOpen);
  };

  const handleCameraDrop = (camera: Camera, rowIndex: number, colIndex: number) => {
    const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
    const updatedCamera: Camera = {
      ...camera,
      floor: activeFloor,
      cell: cellKey,
      initialPosition: { rowIndex, colIndex },
    };
    setDroppedCameras((prev) => ({ ...prev, [cellKey]: updatedCamera }));
  };

  const handleFloorChange = (floor: number) => {
    setActiveFloor(floor);
  };

  const handleCloseModalStream = () => {
    setIsModalStreamOpen(false);
    setFlagLocal(true);
    localStorage.removeItem('cameras');
  };

  const handleDoubleClickCamera = (camera: Camera) => {
    setSelectedCameras([camera]);
    setIsModalStreamOpen(true);
  };

  return (
    <div>
      <div className={FStyles.listContainer}>
        <div className={FStyles.listButton}>
          <label className={FStyles.listLabel}>Этаж {activeFloor + 1}</label>
        </div>
        <BsLayoutTextWindow
          className={FStyles.listIcon}
          onClick={handleListCameraToggle}
          title="Открыть список камер"
        />
      </div>
      {isListCameraOpen && (
        <ListCamera
          open={isListCameraOpen}
          onClose={() => setIsListCameraOpen(false)}
          FlagLocal={() => setFlagLocal(prev => !prev)}
          onGridOpen={handleGridOpen}
          onDoubleClickCamera={handleDoubleClickCamera}
        />
      )}
      <div className={`${FStyles.roomContainer} ${isGridOpen ? FStyles.transparentBackground : ''}`}>
        <Room
          children={null}
          svgProps={{}}
          onCameraDropped={handleCameraDrop}
          droppedCameras={droppedCameras}
          activeFloor={activeFloor}
          onFloorChange={handleFloorChange}
          onDoubleClickCamera={handleDoubleClickCamera}
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
      {isModalStreamOpen && (
        <ModalStream
          onClose={handleCloseModalStream}
          selectedCameras={selectedCameras}
          setCam={setSelectedCameras}
        />
      )}
    </div>
  );
};

export default Feeding;
