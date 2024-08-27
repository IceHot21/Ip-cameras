import { FC, useState, useEffect } from 'react';
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
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [isModalStreamOpen, setIsModalStreamOpen] = useState(false);

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
    setIsGridOpen((prev) => !prev);
    setIsEditing(!isGridOpen);
  };

  const handleCameraDrop = (camera: Camera, rowIndex: number, colIndex: number) => {
    const cellKey = `${activeFloor}-${rowIndex}-${colIndex};`;
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

  const handleSelectCameras = (cameras: Camera[]) => {
    setSelectedCameras(cameras);
    setCameras(cameras);
    setIsModalStreamOpen(true);
  };

  const handleCloseModalStream = () => {
    setIsModalStreamOpen(false);
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
          onSelectCameras={handleSelectCameras}
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