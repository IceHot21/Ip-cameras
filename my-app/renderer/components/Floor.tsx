import React, { FC, lazy, Suspense, useEffect, useState, useCallback, memo } from 'react';
import RStyles from '../styles/Floor.module.css';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { Menu, Item, Separator, Submenu, useContextMenu, ItemParams } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";
import Svg from '../assets/Svg1.svg';

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

type FloorProps = {
  navigate: (path: string) => Promise<boolean>;
  children: React.ReactNode;
  onCameraDropped: (camera: Camera, rowIndex: number, colIndex: number) => void;
  droppedCameras: { [key: string]: Camera };
  activeFloor: number;
  onFloorChange: (floor: number) => void;
  onDoubleClickCamera: (camera: Camera) => void;
  FlagLocal: () => void;
  rotationAngles: { [key: string]: number };
  setRotationAngles: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  droppedSVGs: { [key: string]: SVGItem };
  onSVGDrop: (svg: SVGItem, rowIndex: number, colIndex: number) => void;
  floorIndex: number;
  isActive: boolean;
  setDroppedSVGs: any;
  setDroppedCameras: React.Dispatch<React.SetStateAction<{ [key: string]: Camera }>>;
  savedCells: number[][];
};

const Floor: FC<FloorProps> = memo(({ children, droppedCameras, activeFloor, navigate, onFloorChange, onDoubleClickCamera, FlagLocal, rotationAngles, setRotationAngles, droppedSVGs, onSVGDrop, floorIndex, isActive, setDroppedSVGs, setDroppedCameras, savedCells }) => {
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const menuClick = "Меню";
  const { show } = useContextMenu({ id: menuClick });

/*   useEffect(() => {
    if (selectedCameras) {
      FlagLocal();
    }
  }, [selectedCameras]); */

  useEffect(() => {
    const savedCells = localStorage.getItem('centerNameRooms');
    console.log(savedCells)
  },[savedCells]);

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

      // Устанавливаем начальные углы поворота в состояние
      setRotationAngles(initialRotationAngles);
    }
  }, []);

  const handleSvgClick = useCallback((index: number) => {
    onFloorChange(index);
  }, [onFloorChange]);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, item: Camera | SVGItem) => {
    console.log('Drag start:', item);
    e.dataTransfer.setData('droppedItem', JSON.stringify(item));
  }, []);

  const renderSVG = useCallback((svgName: string) => {
    const SVGComponent = lazy(() => import(`../assets/${svgName}.svg`));
    return (
      <Suspense>
        <SVGComponent />
      </Suspense>
    );
  }, []);

  const displayMenu = useCallback((e: React.MouseEvent<HTMLDivElement>, cameraId: string, svgKey?: string) => {
    e.preventDefault();
    show({ event: e, props: { cameraId, svgKey } });
  }, [show]);

  const handleDoubleClick = useCallback((camera: Camera) => {
    if (!selectedCameras.some(c => c.id === camera.id)) {
      setSelectedCameras([camera]);
      onDoubleClickCamera(camera);
      FlagLocal();
    } else {
      setSelectedCameras([]);
    }
  }, [selectedCameras, onDoubleClickCamera, FlagLocal]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const itemDataCamera = e.dataTransfer.getData('droppedItem');
    const itemDataSVG = e.dataTransfer.getData('svgItem');
  
    if (itemDataCamera) {
      const item: Camera = JSON.parse(itemDataCamera);
      if ('port' in item) {
        const camera = item as Camera;
        const newCellKey = `${floorIndex}-${rowIndex}-${colIndex}`;
        const existingCameraKey = Object.keys(droppedCameras).find(key => droppedCameras[key].name === camera.name);
  
        if (existingCameraKey && existingCameraKey !== newCellKey) {
          delete droppedCameras[existingCameraKey];
        }
  
        const newCamera: Camera = {
          ...camera,
          cell: newCellKey,
          initialPosition: { rowIndex, colIndex },
          rotationAngle: rotationAngles[camera.name] || 0
        };
  
        setDroppedCameras({ ...droppedCameras, [newCellKey]: newCamera });
        localStorage.setItem('droppedCameras', JSON.stringify({ ...droppedCameras, [newCellKey]: newCamera }));
      }
    }
  
    if (itemDataSVG) {
      const item: SVGItem = JSON.parse(itemDataSVG);
      const newCellKey = `${floorIndex}-${rowIndex}-${colIndex}`;
      setDroppedSVGs({ ...droppedSVGs, [newCellKey]: item });
      localStorage.setItem('droppedSVGs', JSON.stringify({ ...droppedSVGs, [newCellKey]: item }));
    }
  }, [floorIndex, droppedCameras, droppedSVGs, rotationAngles, setDroppedCameras, setDroppedSVGs]);


  return (
    <div className={RStyles.body}>
      <div className={RStyles.container}>
        <div
          key={floorIndex}
          className={RStyles.card}
          onClick={() => handleSvgClick(floorIndex)}
        >
          <Svg className={RStyles.fonContainer} />
          { savedCells && (
                        <div className={RStyles.roomNameLabel}>
                          {savedCells}
                        </div>
                      )}
          <div className={RStyles.gridContainer} style={{ height: '100% !important' }}>
            <div className={GStyles.grid}>
              {Array.from({ length: 15 }).map((_, rowIndex) =>
                Array.from({ length: 20 }).map((_, colIndex) => {
                  const cellKey = `${floorIndex}-${rowIndex}-${colIndex}`;
                  const camera = droppedCameras[cellKey];
                  const svg = droppedSVGs[cellKey];
                  const cameraId = camera ? `Камера ${camera.name}` : '';
                  const rotationAngle = rotationAngles[cameraId] || 0;

                  return (
                    <div
                      key={cellKey}
                      id={cellKey}
                      className={`${GStyles.gridCell} ${RStyles.transparentCell}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                    >
                      {camera && (
                        <div
                          className={GStyles.cameraIcon}
                          onDragStart={(e) => handleDragStart(e, camera)}
                          onClick={() => handleDoubleClick(camera)}
                          id={cameraId}
                          title={cameraId}
                        >
                          <BsFillCameraVideoFill style={{ transform: `rotate(${rotationAngle}deg)` }} />
                          <div
                            className={RStyles.cameraViewSector}
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
                          onDragStart={(e) => handleDragStart(e, svg)}
                          title={svg.name}
                          onContextMenu={(e) => displayMenu(e, '', cellKey)}
                        >
                          {renderSVG(svg.name)}
                        </div>
                      )}
                    
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
});

export default Floor;