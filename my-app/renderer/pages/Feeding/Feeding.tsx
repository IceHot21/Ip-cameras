import React, { FC, useState } from 'react';
import { BsLayoutTextWindow } from "react-icons/bs";
import FStyles from './Feeding.module.css';
import ListCamera from '../../components/ListCamera';
import Room from '../../components/Room';
import Grid from '../../components/Grid';

interface Camera {
  id: number;
  name: string;
  address: string;
  position: { row: number, col: number } | null; // добавлено для хранения положения камеры
}

const Feeding: FC = () => {
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [cameras, setCameras] = useState<Camera[]>([]); // добавлено состояние для хранения списка камер

  const handleListCameraToggle = () => {
    setIsListCameraOpen(!isListCameraOpen);
  };

  const handleGridOpen = () => {
    setIsGridOpen((prev) => !prev);
  };

  // Изменена функция для соответствия типам
  const updateCameraPosition = (camera: Camera, position: { row: number, col: number }) => {
    setCameras((prevCameras) =>
      prevCameras.map((cam) =>
        cam.id === camera.id ? { ...cam, position } : cam
      )
    );
  };

  // Функция для добавления новой камеры
  const addCamera = (newCamera: Camera) => {
    setCameras((prevCameras) => [...prevCameras, newCamera]);
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
          onSelectCameras={addCamera} // добавляем камеру при выборе
          onGridOpen={handleGridOpen}
        />
      )}
      <div className={FStyles.roomContainer}>
        <Room cameras={cameras} onCameraDropped={updateCameraPosition} /> {/* Передаем камеры и функцию обновления */}
        <div className={FStyles.gridContainer}>
          {isGridOpen && (
            <div>
              <Grid cameras={cameras} onUpdateCameraPosition={updateCameraPosition} /> {/* Исправлено имя функции */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feeding;
