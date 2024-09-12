import React, { FC, useState, useEffect } from 'react';
import { BsLayoutTextWindow } from "react-icons/bs";
import FStyles from './Feeding.module.css';
import Room from '../../components/Room';
import Grid from '../../components/Grid';
import ListCamera from '../../components/ListCamera';
import ModalStream from '../../components/ModalStream';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/router';

interface Camera {
  id: number;
  port: number;
  name: string;
  address: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
  rtspUrl: string;
  isDisabled: boolean;
  rotationAngle: number;
}

const Feeding: FC = () => {
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera }>({});
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [isModalStreamOpen, setIsModalStreamOpen] = useState(false);
  const [FlagLocal, setFlagLocal] = useState(true);
  const [movedCameras, setMovedCameras] = useState<Set<number>>(new Set());
  const [rotationAngles, setRotationAngles] = useState<{ [key: string]: number }>({});
  const router = useRouter();
  const { floor } = router.query; 
  const [activeFloor, setActiveFloor] = useState<number>(0);

  useEffect(() => {
    if (floor) {
      setActiveFloor(Number(floor)); 
    }
  }, [floor]);

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
    setMovedCameras((prev) => new Set(prev).add(camera.id));
  };

  const handleFloorChange = (floor: number) => {
    setActiveFloor(floor);
  };

  const handleLeftClick = () => {
    if (activeFloor > 0) {
      setActiveFloor(prevFloor => prevFloor - 1);
    }
  };

  const handleRightClick = () => {
    if (activeFloor < 2) {
      setActiveFloor(prevFloor => prevFloor + 1);
    }
  };

  const handleDoubleClickCamera = (camera: Camera) => {
    setSelectedCameras([camera]);
    setIsModalStreamOpen(true);
  };

  return (
    <div>
      <div className={FStyles.listContainer}>
        <div className={FStyles.listButton}>
          <FaChevronLeft className={`${FStyles.leftSvg} ${activeFloor === 0 ? FStyles.disabled : ''}`} onClick={handleLeftClick} />
          <h1 className={FStyles.listLabel}>Этаж {activeFloor + 1}</h1>
          <FaChevronRight className={`${FStyles.rightSvg} ${activeFloor === 2 ? FStyles.disabled : ''}`} onClick={handleRightClick} />
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
          movedCameras={movedCameras}
          droppedCameras={droppedCameras}
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
          FlagLocal={() => setFlagLocal(prev => !prev)}
          rotationAngles={rotationAngles}
          setRotationAngles={setRotationAngles}
        />
        {isEditing && (
          <div className={FStyles.gridContainer}>
            <Grid
              onCameraDrop={handleCameraDrop}
              droppedCameras={droppedCameras}
              activeFloor={activeFloor}
              onDoubleClickCamera={handleDoubleClickCamera}
              FlagLocal={() => setFlagLocal(prev => !prev)}
              rotationAngles={rotationAngles}
              setRotationAngles={setRotationAngles}
            />
          </div>
        )}
      </div>
      {isModalStreamOpen && (
        <ModalStream
          selectedCameras={selectedCameras}
          setCam={setSelectedCameras}
          onClose={() => setIsModalStreamOpen(false)}
        />
      )}
    </div>
  );
};

export default Feeding;