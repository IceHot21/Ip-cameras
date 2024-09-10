import React, { FC, useEffect, useState } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import StartStream from './StartStream';
import { Menu, Item, Separator, Submenu, useContextMenu, ItemParams } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";

interface Camera {
  id: number;
  name: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
  rtspUrl: string;
  isDisabled: boolean;
  address: string;
}

interface GridProps {
  onCameraDrop: (camera: Camera, rowIndex: number, colIndex: number) => void;
  droppedCameras: { [key: string]: Camera };
  activeFloor: number;
  onDoubleClickCamera: (camera: Camera) => void;
  FlagLocal: () => void;
  rotationAngles: { [key: string]: number };
  setRotationAngles: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const Grid: FC<GridProps> = ({ onCameraDrop, droppedCameras, activeFloor, onDoubleClickCamera, FlagLocal, rotationAngles, setRotationAngles}) => {
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const menuClick = "Меню";
  const { show } = useContextMenu({ id: menuClick });

  useEffect(() => {
    if (selectedCameras) {
      handleStartStreams([]);
    }
  }, [selectedCameras]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('droppedCameras', JSON.stringify(camera));
  };

  const displayMenu = (e: React.MouseEvent<HTMLDivElement>, cameraId: string) => {
    e.preventDefault();
    show({ event: e, props: { cameraId } });
  };

  const handleItemClick = ({ id, event, props }: ItemParams<any, any>) => {
    const cameraId = props.cameraId;
    setRotationAngles((prevAngles) => ({
      ...prevAngles,
      [cameraId]: id === "rotateLeft" ? (prevAngles[cameraId] || 0) - 45 : (prevAngles[cameraId] || 0) + 45,
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDoubleClick = (camera: Camera) => {
    if (!selectedCameras.some(c => c.id === camera.id)) {
      setSelectedCameras([camera]);
      onDoubleClickCamera(camera);
      handleStartStreams([camera]);
    } else {
      setSelectedCameras([]);
    }
  };

  const handleStartStreams = (selectedCameras: Camera[]) => {
    const savedCameras = localStorage.getItem('cameras');
    let camerasArray: Camera[] = [];

    if (savedCameras && savedCameras.length !== 0) {
      camerasArray = JSON.parse(savedCameras);
    }

    selectedCameras.forEach((searchedCamera) => {
      const cameraName = searchedCamera.name.split(/[^a-zA-Z0-9]/)[0];
      const ipAddress = searchedCamera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)[1];
      const rtspUrl = `rtsp://admin:Dd7560848@${ipAddress}`;
      const newCamera: Camera = { id: camerasArray.length + 1, rtspUrl, name: cameraName, floor: 0, cell: '', initialPosition: { rowIndex: 0, colIndex: 0 }, isDisabled: false, address: '' };
      camerasArray.push(newCamera);
    });

    localStorage.setItem('cameras', JSON.stringify(camerasArray));
    if (localStorage.getItem('cameras')) {
      FlagLocal();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const cameraData = e.dataTransfer.getData('droppedCameras');

    if (cameraData) {
      const camera: Camera = JSON.parse(cameraData);
      const cameraName = camera.name.split(/[^a-zA-Z0-9]/)[0];
      const ipAddress = camera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)[1];
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
        rtspUrl,
        name: cameraName,
        floor: activeFloor,
        cell: newCellKey,
        initialPosition: { rowIndex, colIndex },
        isDisabled: false,
        address: camera.address
      };
      droppedCameras[newCellKey] = newCamera;

      console.log(newCamera);

      camera.initialPosition = { rowIndex, colIndex };
      onCameraDrop(newCamera, rowIndex, colIndex);
    }
  };

  return (
    <div className={GStyles.gridContainer}>
      <div className={GStyles.grid}>
        {Array.from({ length: 15 }).map((_, rowIndex) =>
          Array.from({ length: 20 }).map((_, colIndex) => {
            const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
            const camera = droppedCameras[cellKey];

            const cameraId = camera ? `Камера ${camera.name.split(/[^a-zA-Z0-9]/)[0]}` : '';
            const rotationAngle = rotationAngles[cameraId] || 0;

            return (
              <div
                key={cellKey}
                id={cellKey}
                className={GStyles.gridCell}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              >
                {droppedCameras[cellKey] && (
                  <div
                    className={GStyles.cameraIcon}
                    draggable
                    onDragStart={(e) => handleDragStart(e, droppedCameras[cellKey])}
                    onDoubleClick={() => handleDoubleClick(droppedCameras[cellKey])}
                    id={cameraId}
                    title={cameraId}
                    onContextMenu={(e) => displayMenu(e, cameraId)}
                  >
                    <BsFillCameraVideoFill  style={{ transform: `rotate(${rotationAngle}deg)`, display: 'none'}} />
                    <Menu id={menuClick} >
                      <Item id='rotateRigth' title={cameraId} onClick={handleItemClick}>Повернуть вправо</Item>
                      <Item id='rotateLeft' onClick={handleItemClick}>Повернуть влево</Item>
                    </Menu>
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