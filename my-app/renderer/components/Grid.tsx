import React, { FC, useState, useEffect, lazy, Suspense, useCallback, memo } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { Menu, Item, useContextMenu, ItemParams, Separator } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";
import { motion } from 'framer-motion';

interface Camera {
  id: number;
  port: number;
  name: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
  rtspUrl: string;
  isDisabled: boolean;
  address: string;
  rotationAngle: number;
}

interface SVGItem {
  id: number;
  name: string;
}

interface GridProps {
  navigate: (path: string) => Promise<boolean>;
  onCameraDrop: (camera: Camera, rowIndex: number, colIndex: number) => void;
  onSVGDrop: (svg: SVGItem, rowIndex: number, colIndex: number) => void;
  droppedCameras: { [key: string]: Camera };
  droppedSVGs: { [key: string]: SVGItem };
  activeFloor: number;
  onDoubleClickCamera: (camera: Camera) => void;
  FlagLocal: () => void;
  rotationAngles: { [key: string]: number };
  setRotationAngles: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  isSelecting: boolean;
  selectedCells: number[][];
  setSelectedCells: React.Dispatch<React.SetStateAction<number[][]>>;
  setDroppedSVGs: React.Dispatch<React.SetStateAction<{ [key: string]: SVGItem }>>;
  setDroppedCameras: React.Dispatch<React.SetStateAction<{ [key: string]: Camera }>>;
}

const Grid: FC<GridProps> = memo(({
  navigate,
  onCameraDrop,
  onSVGDrop,
  droppedCameras,
  droppedSVGs,
  activeFloor,
  onDoubleClickCamera,
  FlagLocal,
  rotationAngles,
  setRotationAngles,
  isSelecting,
  selectedCells,
  setSelectedCells,
  setDroppedSVGs,
  setDroppedCameras,
}) => {
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [savedCells, setSavedCells] = useState<number[][]>([]);
  const menuClick = "Меню";
  const { show } = useContextMenu({ id: menuClick });

  useEffect(() => {
    if (selectedCameras) {
      FlagLocal();
    }
  }, [selectedCameras]);

  useEffect(() => {
    const savedDroppedCameras = localStorage.getItem('droppedCameras');
    if (savedDroppedCameras) {
      const parsedDroppedCameras = JSON.parse(savedDroppedCameras);
      const initialRotationAngles: { [key: string]: number } = {};
      Object.keys(parsedDroppedCameras).forEach((cameraKey) => {
        const camera = parsedDroppedCameras[cameraKey];
        if (camera.rotationAngle !== undefined) {
          const cameraId = `Камера ${camera.name.split(/[^a-zA-Z0-9]/)[0]}`;
          initialRotationAngles[cameraId] = camera.rotationAngle;
        }
      });
      setRotationAngles(initialRotationAngles);
    }
  }, []);

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem('selectedRooms') || '[]');
    const filteredPositions = storedRooms
      .filter((room: { activeFloor: number }) => room.activeFloor === activeFloor)
      .flatMap((room: { positions: number[][] }) => room.positions);
    setSavedCells(filteredPositions);
  }, [activeFloor, isSelecting]); // Добавляем activeFloor в зависимости

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Camera | SVGItem) => {
    console.log('Drag start:', item);
    e.dataTransfer.setData('droppedCameras', JSON.stringify(item));
  };

  const displayMenu = useCallback((e: React.MouseEvent<HTMLDivElement>, cameraId: string, svgKey?: string) => {
    e.preventDefault();
    show({ event: e, props: { cameraId, svgKey } });
    console.log(svgKey);
  }, [show]);

  const handleItemClick = useCallback(({ id, event, props }: ItemParams<any, any>) => {
    const cameraId = props.cameraId;
    const svgKey = props.svgKey;

    if (id === "rotateLeft" || id === "rotateRight") {
      setRotationAngles((prevAngles) => ({ ...prevAngles, [cameraId]: id === "rotateLeft" ? (prevAngles[cameraId] || 0) - 45 : (prevAngles[cameraId] || 0) + 45, }));
    } else if (cameraId && id === 'deleteCamera') {
      const newDroppedCameras = { ...droppedCameras };
      delete newDroppedCameras[cameraId];
      setDroppedCameras(newDroppedCameras);
      localStorage.setItem('droppedCameras', JSON.stringify(newDroppedCameras));
    } else if (svgKey && id === 'deleteSVG') {
      const newDroppedSVGs = { ...droppedSVGs };
      delete newDroppedSVGs[svgKey];
      setDroppedSVGs(newDroppedSVGs);
      localStorage.setItem('droppedSVGs', JSON.stringify(newDroppedSVGs));
    }
  }, [setRotationAngles, droppedCameras, setDroppedCameras, droppedSVGs, setDroppedSVGs]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDoubleClick = useCallback((camera: Camera) => {
    if (!selectedCameras.some(c => c.id === camera.id)) {
      setSelectedCameras([camera]);
      onDoubleClickCamera(camera);
      FlagLocal();
    } else {
      setSelectedCameras([]);
    }
  }, [selectedCameras, onDoubleClickCamera, FlagLocal]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const itemDataCamera = e.dataTransfer.getData('droppedCameras');
    const itemDataSVG = e.dataTransfer.getData('svgItem');
    console.log('Dropped item itemDataSVG:', itemDataSVG);
    console.log('Dropped item itemDataCamera:', itemDataCamera);
    if (itemDataCamera) {
      const item: Camera = JSON.parse(itemDataCamera);
      console.log('Parsed item:', item);
      if ('port' in item) {
        // Это камера
        const camera = item as Camera;
        const port = camera.port;
        const cameraName = camera.name;
        const ipAddress = camera.rtspUrl;
        const rtspUrl = `rtsp://admin:Dd7560848@${ipAddress}`;
        const newCellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
        const existingCameraKey = Object.keys(droppedCameras).find(key => droppedCameras[key].name === cameraName);
        if (existingCameraKey) {
          if (existingCameraKey !== newCellKey) {
            delete droppedCameras[existingCameraKey];
          }
        }
        const newCamera: Camera = {
          id: Object.keys(droppedCameras).length + 1,
          port,
          rtspUrl,
          name: cameraName,
          floor: activeFloor,
          cell: newCellKey,
          initialPosition: { rowIndex, colIndex },
          isDisabled: false,
          address: camera.address,
          rotationAngle: rotationAngles[cameraName] || 0
        };
        droppedCameras[newCellKey] = newCamera;
        camera.initialPosition = { rowIndex, colIndex };
        onCameraDrop(newCamera, rowIndex, colIndex);
      }
    }
    if (itemDataSVG) {
      // Это SVG
      const item: SVGItem = JSON.parse(itemDataSVG);
      const svg = item as SVGItem;
      const newCellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
      droppedSVGs[newCellKey] = svg;
      onSVGDrop(svg, rowIndex, colIndex);
      localStorage.setItem('droppedSVGs', JSON.stringify(droppedSVGs));
    }
  }, [activeFloor, droppedCameras, droppedSVGs, onCameraDrop, rotationAngles]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (isSelecting) { // Проверяем состояние isSelecting
      const newPosition = [rowIndex, colIndex];
      if (selectedCells.some(pos => pos[0] === rowIndex && pos[1] === colIndex)) {
        setSelectedCells(selectedCells.filter(pos => pos[0] !== rowIndex || pos[1] !== colIndex));
      } else {
        setSelectedCells([...selectedCells, newPosition]);
      }
      console.log(selectedCells);
    }
  };

  const renderSVG = (svgName: string) => {
    const SVGComponent = lazy(() => import(`../assets/${svgName}.svg`));
    return (
      <Suspense>
        <SVGComponent />
      </Suspense>
    );
  };

  return (
    <motion.div className={GStyles.gridContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}>
      <div className={GStyles.grid}>
        {Array.from({ length: 15 }).map((_, rowIndex) =>
          Array.from({ length: 20 }).map((_, colIndex) => {
            const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
            const camera = droppedCameras[cellKey];
            const svg = droppedSVGs[cellKey];
            const cameraId = camera ? `Камера ${camera.name}` : '';
            const rotationAngle = rotationAngles[cameraId] || 0;
            const isSelected = selectedCells.some(pos => pos[0] === rowIndex && pos[1] === colIndex);
            const isSaved = savedCells.some(pos => pos[0] === rowIndex && pos[1] === colIndex);
            const svgKey = svg ? `SVG ${svg.id}` : '';

            return (
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              key={cellKey}
              id={cellKey}
              className={`${GStyles.gridCell} ${isSaved ? GStyles.savedCell : ''} ${isSelected ? GStyles.selectedCell : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {camera && (
                  <div
                    className={GStyles.cameraIcon}
                    draggable
                    onDragStart={(e) => handleDragStart(e, camera)}
                    onDoubleClick={() => handleDoubleClick(camera)}
                    id={cameraId}
                    title={cameraId}
                    onContextMenu={(e) => displayMenu(e, cameraId)}
                  >
                    <BsFillCameraVideoFill style={{ transform: `rotate(${rotationAngle}deg)` }} />
                    <Menu id={menuClick}>
                      <Item id='rotateRight' onClick={handleItemClick} data={{ cameraId }}>Поворот вправо</Item>
                      <Item id='rotateLeft' onClick={handleItemClick} data={{ cameraId }}>Поворот влево</Item>
                      <Separator />
                      <Item id='deleteCamera' onClick={handleItemClick} data={{ cameraId }}>Удалить камеру</Item>
                    </Menu>
                  </div>
                )}
                {svg && (
                  <div
                    className={GStyles.svgIcon}
                    draggable
                    onDragStart={(e) => handleDragStart(e, svg)}
                    id={svgKey}
                    title={svgKey}
                    onContextMenu={(e) => displayMenu(e, undefined, svgKey)}
                  >
                    {renderSVG(svg.name)}
                    <Menu id={menuClick}>
                      <Item id='deleteSVG' onClick={handleItemClick} data={{ svgKey }}>Удалить SVG</Item>
                    </Menu>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
});

export default Grid;