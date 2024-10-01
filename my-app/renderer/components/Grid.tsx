import React, { FC, useState, useEffect, lazy, Suspense, useCallback, memo } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { Menu, Item, useContextMenu, ItemParams, Separator } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";
import { motion } from 'framer-motion';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Импортируем стили tippy.js

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
  setRoomCenters: React.Dispatch<React.SetStateAction<{ [key: string]: { x: number; y: number } }>>;
  //TODO: хуйня полная
  setRoomNames: any;
}

const Grid: FC<GridProps> = ({
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
  setRoomCenters,
  setRoomNames,
}) => {
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [savedCells, setSavedCells] = useState<number[][]>([]);
  const [roomNames, setLocalRoomNames] = useState<{ [key: string]: string }>({});
  const menuClick = "Меню";
  const { show } = useContextMenu({ id: menuClick });
  const [zIndex, setZIndex] = useState('auto');

  const calculateRoomCenters = (rooms: { activeFloor: number, roomName: string, positions: number[][] }[]) => {
    const centers: { [key: string]: { x: number; y: number } } = {};
    const centerNameRooms: { [key: string]: { roomName: string, center: { x: number; y: number } } } = {};

    rooms.forEach((room) => {
      if (room.activeFloor === activeFloor) {
        const positions = room.positions;
        const minX = Math.min(...positions.map(pos => pos[0]));
        const maxX = Math.max(...positions.map(pos => pos[0]));
        const minY = Math.min(...positions.map(pos => pos[1]));
        const maxY = Math.max(...positions.map(pos => pos[1]));

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const roomKey = `${activeFloor}-${centerX}-${centerY}`;
        centers[roomKey] = { x: centerX, y: centerY };

        // Сохраняем данные в centerNameRooms
        centerNameRooms[roomKey] = {
          roomName: room.roomName,
          center: { x: centerX, y: centerY }
        };
      }
    });

    // Сохраняем centerNameRooms в localStorage
    localStorage.setItem('centerNameRooms', JSON.stringify(centerNameRooms));
    setRoomCenters(centers);
    setRoomNames(centerNameRooms);
  };

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem('selectedRooms') || '[]');
    calculateRoomCenters(storedRooms);
  }, [activeFloor, isSelecting]);

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

    const roomNamesMap: { [key: string]: string } = {};
    storedRooms.forEach((room: { activeFloor: number, roomName: string, positions: number[][] }) => {
      if (room.activeFloor === activeFloor) {
        room.positions.forEach((pos: number[]) => {
          const cellKey = `${activeFloor}-${pos[0]}-${pos[1]}`;
          roomNamesMap[cellKey] = room.roomName;
        });
      }
    });
    setLocalRoomNames(roomNamesMap);
  }, [activeFloor, isSelecting]); // Добавляем activeFloor в зависимости

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Camera | SVGItem) => {
    console.log('Drag start:', item);
    e.dataTransfer.setData('droppedCameras', JSON.stringify(item));
  };

  const displayMenu = useCallback((e: React.MouseEvent<HTMLDivElement>, cameraId: string, svgKey?: string) => {
    e.preventDefault();
    setZIndex('1');
    show({ event: e, props: { cameraId, svgKey } });
  }, [show]);

  const handleMenuClose = useCallback(() => {
    setZIndex('auto'); // Возвращаем z-index в auto при закрытии меню
  }, []);

  const handleItemClick = useCallback(({ id, event, props, }: ItemParams<any, any>) => {
    const cameraId = props.cameraId;
    const svgKey = props.svgKey;

    if (id === "rotateLeft" || id === "rotateRight") {
      setRotationAngles((prevAngles) => {
        const newAngle = id === "rotateLeft" ? (prevAngles[cameraId] || 0) - 45 : (prevAngles[cameraId] || 0) + 45;
        const cameraKey = Object.keys(droppedCameras).find(key => `Камера ${droppedCameras[key].name.split(/[^a-zA-Z0-9]/)[0]}` === cameraId);
        if (cameraKey) {
          const updatedCamera = {
            ...droppedCameras[cameraKey],
            rotationAngle: newAngle,
          };
          const updatedDroppedCameras = {
            ...droppedCameras,
            [cameraKey]: updatedCamera,
          };
          localStorage.setItem('droppedCameras', JSON.stringify(updatedDroppedCameras));
        }
        return {
          ...prevAngles,
          [cameraId]: newAngle,
        };
      });
    }
    if (id === "deleteSVG") {
      if (cameraId === "") {
        const newDroppedSVGs = { ...droppedSVGs };
        delete newDroppedSVGs[svgKey];
        setDroppedSVGs(newDroppedSVGs);
        localStorage.setItem('droppedSVGs', JSON.stringify(newDroppedSVGs));
      } else {
        const newDroppedCameras = { ...droppedCameras };
        delete newDroppedCameras[svgKey];
        setDroppedCameras(newDroppedCameras);
        localStorage.setItem('droppedCameras', JSON.stringify(newDroppedCameras));
      }
    }
  }, [setRotationAngles, droppedCameras, droppedSVGs, setDroppedSVGs]);

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
  }, [activeFloor, droppedCameras, droppedSVGs, onCameraDrop, onSVGDrop, rotationAngles]);

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
    <div className={GStyles.gridContainer}>
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
            const roomName = roomNames[cellKey];

            return (
              <div
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
                    onContextMenu={(e) => displayMenu(e, cameraId, cellKey)}
                  >
                    <BsFillCameraVideoFill style={{ transform: `rotate(${rotationAngle}deg)` }} />
                    <div
                      className={GStyles.cameraViewSector}
                      style={{
                        transform: `rotate(${rotationAngle}deg)`,
                        clipPath: `polygon(50% 50%, 100% 0%, 100% 100%)`,
                      }}
                    />
                  </div>
                )}
                {svg && (
                  <div
                    className={GStyles.svgIcon}
                    draggable
                    onDragStart={(e) => handleDragStart(e, svg)}
                    title={svg.name}
                    onContextMenu={(e) => displayMenu(e, '', cellKey)}
                  >
                    {renderSVG(svg.name)}
                  </div>
                )}
                {isSaved && roomName && (
                  <Tippy content={roomName}>
                    <div style={{ width: '100%', height: '100%' }} />
                  </Tippy>
                )}
              </div>
            );
          })
        )}
      </div>

      <Menu className={GStyles.menuContainer} id={menuClick} //@ts-ignore 
        onClose={handleMenuClose} >
        <Item className={GStyles.menuItem} id='rotateRight' onClick={handleItemClick}>Поворот вправо</Item>
        <Item className={GStyles.menuItem} id='rotateLeft' onClick={handleItemClick}>Поворот влево</Item>
        <Separator />
        <Item id="deleteSVG" onClick={handleItemClick}>Удалить элемент</Item>
      </Menu>
    </div>
  );
};

export default Grid;