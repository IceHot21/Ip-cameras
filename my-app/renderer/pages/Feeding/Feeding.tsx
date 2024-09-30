import React, { FC, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { BsLayoutTextWindow, BsWrenchAdjustable } from "react-icons/bs";
import FStyles from './Feeding.module.css';
import Floor from '../../components/Floor';
import Grid from '../../components/Grid';
import ListCamera from '../../components/ListCamera';
import ListSVG from '../../components/ListSVG';
import ModalStream from '../../components/ModalStream';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify'; // Импортируем toast и ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Добавляем стили для уведомлений

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

interface Prediction {
  id: number;
  camera_port: number;
  item_predict: string;
  score_predict: string;
  date: string;
  bbox: number[];
}

interface SVGItem {
  id: number;
  name: string;
}

interface FeedingProps {
  navigate: (path: string) => Promise<boolean>;
}

const Feeding: FC<FeedingProps> = ({ navigate }) => {
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [isListSVGOpen, setIsListSVGOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera }>({});
  const [droppedSVGs, setDroppedSVGs] = useState<{ [key: string]: SVGItem }>({});
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [isModalStreamOpen, setIsModalStreamOpen] = useState(false);
  const [FlagLocal, setFlagLocal] = useState(true);
  const [movedCameras, setMovedCameras] = useState<Set<number>>(new Set());
  const [rotationAngles, setRotationAngles] = useState<{ [key: string]: number }>({});
  const router = useRouter();
  const { floor } = router.query;
  const [activeFloor, setActiveFloor] = useState<number>(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [isPredictions, setIsPredictions] = useState<Prediction | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.0.136:9999');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onmessage = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        const predictions = JSON.parse(reader.result as string);
        console.log(predictions);
        setIsPredictions(predictions);
      };
      reader.readAsText(event.data);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (floor) {
      setActiveFloor(Number(floor));
    }
  }, [floor]);

  useEffect(() => {
    const storedCameras = localStorage.getItem('droppedCameras');
    const storedSVGs = localStorage.getItem('droppedSVGs');
    if (storedCameras) {
      setDroppedCameras(JSON.parse(storedCameras));
    }
    if (storedSVGs) {
      setDroppedSVGs(JSON.parse(storedSVGs));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(droppedCameras).length > 0) {
      localStorage.setItem('droppedCameras', JSON.stringify(droppedCameras));
    }
  }, [droppedCameras]);

  useEffect(() => {
    if (Object.keys(droppedSVGs).length > 0) {
      localStorage.setItem('droppedSVGs', JSON.stringify(droppedSVGs));
    }
  }, [droppedSVGs]);

  useEffect(() => {
    setIsEditing(isListCameraOpen || isListSVGOpen);
  }, [isListCameraOpen, isListSVGOpen]);

  useEffect(() => {
    if (FlagLocal) {
      setIsModalStreamOpen(true);
    }
  }, [FlagLocal]);

  const handleListCameraToggle = useCallback(() => {
    setIsListCameraOpen(!isListCameraOpen);
  }, [isListCameraOpen]);

  const handleListSVGToggle = useCallback(() => {
    setIsListSVGOpen(!isListSVGOpen);
  }, [isListSVGOpen]);

  const handleCameraDrop = useCallback((camera: Camera, rowIndex: number, colIndex: number) => {
    const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
    const updatedCamera: Camera = {
      ...camera,
      floor: activeFloor,
      cell: cellKey,
      initialPosition: { rowIndex, colIndex },
    };
    setDroppedCameras((prev) => ({ ...prev, [cellKey]: updatedCamera }));
    setMovedCameras((prev) => new Set(prev).add(camera.id));
  }, [activeFloor]);

  const handleSVGDrop = useCallback((svg: SVGItem, rowIndex: number, colIndex: number) => {
    const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
    setDroppedSVGs((prev) => ({ ...prev, [cellKey]: svg }));
  }, [activeFloor]);

  const handleFloorChange = useCallback((floor: number) => {
    setActiveFloor(floor);
  }, []);

  const handleLeftClick = useCallback(() => {
    if (activeFloor > 0) {
      setActiveFloor(prevFloor => prevFloor - 1);
    }
  }, [activeFloor]);

  const handleRightClick = useCallback(() => {
    if (activeFloor < 2) {
      setActiveFloor(prevFloor => prevFloor + 1);
    }
  }, [activeFloor]);

  const handleDoubleClickCamera = useCallback((camera: Camera) => {
    setSelectedCameras([camera]);
    setIsModalStreamOpen(true);
  }, []);

  const floors = [0, 1, 2]; // Массив этажей

  const memoizedDroppedCameras = useMemo(() => droppedCameras, [droppedCameras]);
  const memoizedDroppedSVGs = useMemo(() => droppedSVGs, [droppedSVGs]);
  const memoizedRotationAngles = useMemo(() => rotationAngles, [rotationAngles]);
  const memoizedSelectedCells = useMemo(() => selectedCells, [selectedCells]);

  const memoizedFlagLocalToggle = useCallback(() => setFlagLocal(prev => !prev), []);

  const memoizedActiveFloorContent = useMemo(() => (
    <div className={FStyles.activeFloor}>
      <MemoizedFloor
        navigate={navigate}
        children={null}
        onCameraDropped={handleCameraDrop}
        droppedCameras={memoizedDroppedCameras}
        activeFloor={activeFloor}
        onFloorChange={handleFloorChange}
        onDoubleClickCamera={handleDoubleClickCamera}
        FlagLocal={memoizedFlagLocalToggle}
        rotationAngles={memoizedRotationAngles}
        setRotationAngles={setRotationAngles}
        droppedSVGs={memoizedDroppedSVGs}
        onSVGDrop={handleSVGDrop}
        floorIndex={activeFloor}
        isActive={true}
        // isPredictions={isPredictions}
        setDroppedSVGs={setDroppedSVGs}
        setDroppedCameras={setDroppedCameras}
      />
    </div>
  ), [activeFloor, memoizedDroppedCameras, memoizedDroppedSVGs, memoizedRotationAngles, handleCameraDrop, handleFloorChange, handleDoubleClickCamera, navigate, memoizedFlagLocalToggle]);

  const memoizedInactiveFloorsContent = useMemo(() => (
    <div className={FStyles.inactiveFloors}>
      {floors.map(floorIndex => (
        <div
          key={floorIndex}
          className={`${FStyles.inactiveFloor} ${floorIndex === activeFloor ? FStyles.activeThumbnail : ''}`}
          onClick={() => handleFloorChange(floorIndex)}
        >
          <MemoizedFloor
            navigate={navigate}
            children={null}
            onCameraDropped={handleCameraDrop}
            droppedCameras={memoizedDroppedCameras}
            activeFloor={activeFloor}
            onFloorChange={handleFloorChange}
            onDoubleClickCamera={handleDoubleClickCamera}
            FlagLocal={memoizedFlagLocalToggle}
            rotationAngles={memoizedRotationAngles}
            setRotationAngles={setRotationAngles}
            droppedSVGs={memoizedDroppedSVGs}
            onSVGDrop={handleSVGDrop}
            floorIndex={floorIndex}
            isActive={floorIndex === activeFloor}
            // isPredictions={isPredictions} 
            setDroppedSVGs={setDroppedSVGs}
            setDroppedCameras={setDroppedCameras}
          />
        </div>
      ))}
    </div>
  ), [activeFloor, memoizedDroppedCameras, memoizedDroppedSVGs, memoizedRotationAngles, handleCameraDrop, handleFloorChange, handleDoubleClickCamera, navigate, floors, memoizedFlagLocalToggle]);

  const memoizedGridContent = useMemo(() => (
    <div className={FStyles.gridContainer}>
      <MemoizedGrid
        setDroppedSVGs={setDroppedSVGs}
        setDroppedCameras={setDroppedCameras}
        navigate={navigate}
        isSelecting={isSelecting}
        onCameraDrop={handleCameraDrop}
        onSVGDrop={handleSVGDrop}
        droppedCameras={memoizedDroppedCameras}
        droppedSVGs={memoizedDroppedSVGs}
        activeFloor={activeFloor}
        onDoubleClickCamera={handleDoubleClickCamera}
        FlagLocal={memoizedFlagLocalToggle}
        rotationAngles={memoizedRotationAngles}
        setRotationAngles={setRotationAngles}
        selectedCells={memoizedSelectedCells}
        setSelectedCells={setSelectedCells}
      />
    </div>
  ), [activeFloor, memoizedDroppedCameras, memoizedDroppedSVGs, memoizedRotationAngles, memoizedSelectedCells, isSelecting, handleCameraDrop, handleSVGDrop, handleDoubleClickCamera, navigate, memoizedFlagLocalToggle]);

  return (
    <div>
      <div className={FStyles.listContainer}>
        <BsWrenchAdjustable
          className={FStyles.listIcon}
          onClick={handleListSVGToggle}
          title="Открыть список SVG"
        />
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
        <MemoizedListCamera
          navigate={navigate}
          open={isListCameraOpen}
          onClose={() => setIsListCameraOpen(false)}
          FlagLocal={memoizedFlagLocalToggle}
          onDoubleClickCamera={handleDoubleClickCamera}
          movedCameras={movedCameras}
          droppedCameras={memoizedDroppedCameras}
        />
      )}
      {isListSVGOpen && (
        <MemoizedListSVG
          navigate={navigate}
          open={isListSVGOpen}
          onClose={() => setIsListSVGOpen(false)}
          onSVGDrop={(svg) => handleSVGDrop(svg, 0, 0)}
          activeFloor={activeFloor}
          isSelecting={isSelecting}
          setIsSelecting={setIsSelecting}
          selectedCells={memoizedSelectedCells}
          setSelectedCells={setSelectedCells}
        />
      )}
      <div className={FStyles.FloorContainer}>
        {memoizedActiveFloorContent}
        {memoizedInactiveFloorsContent}
        {isEditing && memoizedGridContent}
      </div>
      {isModalStreamOpen && (
        <MemoizedModalStream
          navigate={navigate}
          selectedCameras={selectedCameras}
          setCam={setSelectedCameras}
          isPredictions={isPredictions}
          onClose={() => setIsModalStreamOpen(false)}
        />
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

const MemoizedFloor = memo(Floor);
const MemoizedGrid = memo(Grid);
const MemoizedListCamera = memo(ListCamera);
const MemoizedListSVG = memo(ListSVG);
const MemoizedModalStream = memo(ModalStream);

export default Feeding;