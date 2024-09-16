import React, { FC, useState, useEffect, lazy, Suspense } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";

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
  onCameraDrop: (camera: Camera, rowIndex: number, colIndex: number) => void;
  onSVGDrop: (svg: SVGItem, rowIndex: number, colIndex: number) => void;
  droppedCameras: { [key: string]: Camera };
  droppedSVGs: { [key: string]: SVGItem };
  activeFloor: number;
  onDoubleClickCamera: (camera: Camera) => void;
  FlagLocal: () => void;
  rotationAngles: { [key: string]: number };
  setRotationAngles: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const Grid: FC<GridProps> = ({ onCameraDrop, onSVGDrop, droppedCameras, droppedSVGs, activeFloor, onDoubleClickCamera, FlagLocal, rotationAngles, setRotationAngles}) => {
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Camera | SVGItem) => {
    console.log('Drag start:', item);
    e.dataTransfer.setData('droppedItem', JSON.stringify(item));
  };

  const displayMenu = (e: React.MouseEvent<HTMLDivElement>, cameraId: string) => {
    e.preventDefault();
    show({ event: e, props: { cameraId } });
  };

  const handleItemClick = ({ id, event, props }: ItemParams<any, any>) => {
    const cameraId = props.cameraId;
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
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDoubleClick = (camera: Camera) => {
    if (!selectedCameras.some(c => c.id === camera.id)) {
      setSelectedCameras([camera]);
      onDoubleClickCamera(camera);
      FlagLocal();
    } else {
      setSelectedCameras([]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const itemDataCamera = e.dataTransfer.getData('droppedItem');
    const itemDataSVG = e.dataTransfer.getData('svgItem');
    console.log('Dropped item data:', itemDataSVG);
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

            return (
              <div
                key={cellKey}
                id={cellKey}
                className={GStyles.gridCell}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
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
                    <div
                      className={GStyles.cameraViewSector}
                      style={{
                        transform: `rotate(${rotationAngle}deg)`,
                        clipPath: `polygon(50% 50%, 100% 0%, 100% 100%)`,
                      }}
                    />
                    <Menu className={GStyles.menuContainer} id={menuClick} >
                      <Item className={GStyles.menuItem} id='rotateRigth' title={cameraId} onClick={handleItemClick}>Поворот вправо</Item>
                      <Item className={GStyles.menuItem} id='rotateLeft' onClick={handleItemClick}>Поворот влево</Item>
                    </Menu>
                  </div>
                )}
                {svg && (
                  <div
                    className={GStyles.svgIcon}
                    draggable
                    onDragStart={(e) => handleDragStart(e, svg)}
                    title={svg.name}
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
  );
};

export default Grid;