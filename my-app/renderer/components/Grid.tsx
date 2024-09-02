import React, { FC, useEffect, useState } from 'react';
import GStyles from '../styles/Grid.module.css';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import StartStream from './StartStream';

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
}

const Grid: FC<GridProps> = ({ onCameraDrop, droppedCameras, activeFloor, onDoubleClickCamera, FlagLocal }) => {
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);

  useEffect(() => {
    if (selectedCameras) {
      handleStartStreams([]);
    }
  }, [selectedCameras]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('droppedCameras', JSON.stringify(camera));
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
    let camerasArray = [];

    if (savedCameras && savedCameras.length !== 0) {
      camerasArray = JSON.parse(savedCameras);
    }

    selectedCameras.forEach((searchedCamera) => {
      const cameraName = searchedCamera.name.split(/[^a-zA-Z0-9]/)[0];
      const ipAddress = searchedCamera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)[1];
      const rtspUrl = `rtsp://admin:Dd7560848@${ipAddress}`;
      const newCamera = { id: camerasArray.length + 1, rtspUrl, name: cameraName };
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
      
      const newCamera = {
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
                  >
                    <BsFillCameraVideoFill />
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
