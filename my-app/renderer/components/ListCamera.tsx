import { useState, useEffect, FC, memo, Dispatch, SetStateAction } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BiX, BiRevision } from "react-icons/bi";
import { fetchWithRetry } from '../refreshToken';
import { motion } from 'framer-motion';

interface ListCameraProps {
  navigate: (path: string) => Promise<boolean>;
  open: boolean;
  onClose: () => void;
  FlagLocal: () => void;
  onDoubleClickCamera: (camera: Camera) => void;
  movedCameras: Set<number>;
  droppedCameras: { [key: string]: Camera };
  handleParametrEditing: string;
  setHandleParametrEditing: Dispatch<SetStateAction<string>>;
}

interface Camera {
  id: number;
  port: number;
  name: string;
  address: string;
  floor?: number;
  cell?: string;
  initialPosition?: { rowIndex: number; colIndex: number };
  rtspUrl: string;
  isDisabled: boolean;
}

const ListCamera: FC<ListCameraProps> = memo(({
  navigate,
  open,
  onClose,
  FlagLocal,
  onDoubleClickCamera,
  movedCameras,
  droppedCameras,
}) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [isAddingCamera, setIsAddingCamera] = useState(false);

  useEffect(() => {
    if (open) {
      handleDiscoverCameras();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCameras) {
      FlagLocal();
    }
  }, [selectedCameras]);

  useEffect(() => {
    handleDiscoverCameras();
  }, [droppedCameras]);

  const handleDiscoverCameras = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithRetry('https://192.168.0.136:4200/stream/cameras', 'GET', null, '/list-cameras');
      if (response.length > 0) {
        const droppedCamerasArray = Object.values(droppedCameras);
        const updatedCameras = response.map((camera) => {
          const isStored = droppedCamerasArray.some(storedCamera => storedCamera.port === camera.port);
          return { ...camera, isDisabled: isStored };
        });
        setCameras(updatedCameras);
      } else {
        console.error('Не удалось обнаружить камеры');
      }
    } catch (error) {
      console.error('Ошибка при обнаружении камер:', error);
    } finally {
      setLoading(false);
    }
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('droppedCameras', JSON.stringify(camera));
  };

  const handleAddCameraClick = () => {
    setIsAddingCamera(!isAddingCamera);
  };

  const getCameraFromLocalStorage = (port: number) => {
    const storedCameras = localStorage.getItem('droppedCameras');
    if (storedCameras) {
      const cameras = JSON.parse(storedCameras);
      const camerasArray = Array.isArray(cameras) ? cameras : Object.values(cameras);
      return camerasArray.find((cam: Camera) => cam.port === port);
    }
    return null;
  };

  if (!open) return null;

  // Получение данных из localStorage
  const selectedRooms = JSON.parse(localStorage.getItem('selectedRooms') || '[]');
  const selectedRoom = selectedRooms.length > 0 ? selectedRooms[0] : {}; // Извлекаем первый элемент массива
  const activeFloor = selectedRoom.activeFloor || -1; // Установите значение по умолчанию
  const positions = selectedRoom.positions ? selectedRoom.positions.map(pos => `${activeFloor}-${pos.join('-')}`) : []; // Проверка на существование

  return (
    <motion.div className={LCStyles.sidebar}
      style={{ height: '100% !important' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}>
      <div className={LCStyles.buttonContainer}>
        <button onClick={onClose} className={LCStyles.closeButton} title="Закрыть"><BiX /></button>
        <div style={{ display: 'flex' }}>
          <button onClick={handleDiscoverCameras} className={LCStyles.refreshButton} title="Обновить"><BiRevision /></button>
        </div>
      </div>
      {loading ? (
        <div className={LCStyles.loadingTable}>
          <p>Загрузка...</p>
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className={LCStyles.tableContainer}>
          <table>
            <thead className={LCStyles.tableHeader}>
              <tr>
                <th>ID</th>
                <th>Здание/Улица</th>
                <th>Этаж</th>
                <th>Имя комнаты</th>
                <th>Название камеры</th>
                <th></th>
              </tr>
            </thead>
            <tbody className={LCStyles.tableBody}>
              {cameras.map((camera) => {
                const cameraId = `${camera.port}`;
                const isDisabled = movedCameras.has(camera.id) || camera.isDisabled || (camera.initialPosition && (camera.initialPosition.rowIndex !== -1 || camera.initialPosition.colIndex !== -1));
                let nameRoom = ''; // Значение по умолчанию

                // Для каждой камеры находим соответствующую комнату
                selectedRooms.forEach((room) => {
                  const activeFloor = room.activeFloor || 0; // Этаж для комнаты
                  const positions = room.positions ? room.positions.map(pos => `${activeFloor}-${pos.join('-')}`) : []; // Преобразование позиций

                  const cell = `${camera.cell}`; // Формат ячейки для камеры
                  if (positions.includes(cell)) {
                    nameRoom = room.roomName; // Устанавливаем имя комнаты для текущей камеры
                  }
                });

                if (camera.isDisabled === false) {
                  return (
                    <tr
                      key={camera.id}
                      onDoubleClick={() => handleDoubleClick(camera)}
                      id={cameraId}
                      className={isDisabled ? `${LCStyles.tableRow} ${LCStyles.disabledRow}` : LCStyles.tableRow}
                    >
                      <td>{cameraId[4]}</td>
                      <td>Установите камеру</td>
                      <td>{ }</td>
                      <td>{nameRoom}</td> {/* Имя комнаты для активной камеры */}
                      <td>{camera.name}</td>
                      <td>
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, camera)}
                          id={cameraId}
                          title={cameraId}
                        >
                          <BsFillCameraVideoFill className={LCStyles.cameraId} />
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  const storedCamera = getCameraFromLocalStorage(camera.port);
                  let storedNameRoom = '';

                  // Проверка для отключенных камер
                  selectedRooms.forEach((room) => {
                    const activeFloor = room.activeFloor || 0; // Этаж
                    const positions = room.positions ? room.positions.map(pos => `${activeFloor}-${pos.join('-')}`) : []; // Преобразование позиций

                    const cell = `${storedCamera?.cell}`; // Формат ячейки для камеры
                    if (positions.includes(cell) && activeFloor !== -1) {
                      storedNameRoom = room.roomName; // Устанавливаем имя комнаты для отключенной камеры
                    }
                  });

                  return (
                    <tr
                      key={camera.id}
                      onDoubleClick={() => handleDoubleClick(camera)}
                      id={cameraId}
                      className={isDisabled ? `${LCStyles.tableRow} ${LCStyles.disabledRow}` : LCStyles.tableRow}
                    >
                      <td>{storedCamera ? storedCamera.id : camera.id}</td>
                      <td>{storedCamera ? (storedCamera.cell?.startsWith(-1) ? 'Улица' : `Здание`) : 'Неизвестно'}</td>
                      <td>
                        {storedCamera
                          ? (storedCamera.cell?.startsWith(-1)
                            ? ' '
                            : `${parseInt(storedCamera.cell.split('-')[0], 10) + 1}`)
                          : 'Неизвестно'}
                      </td>
                      <td>{storedNameRoom}</td> {/* Имя комнаты для отключенной камеры */}
                      <td>{storedCamera ? storedCamera.name : camera.name}</td>
                      <td>
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, camera)}
                          id={cameraId}
                          title={cameraId}
                        >
                          <BsFillCameraVideoFill className={LCStyles.cameraId} />
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
});

export default ListCamera;