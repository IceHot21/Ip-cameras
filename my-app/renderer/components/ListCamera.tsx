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
        console.error('Failed to discover cameras');
      }
    } catch (error) {
      console.error('Error discovering cameras:', error);
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
      // Приводим объект к массиву, если это объект
      const camerasArray = Array.isArray(cameras) ? cameras : Object.values(cameras);
      return camerasArray.find((cam: Camera) => cam.port === port);
    }
    return null;
  };

  if (!open) return null;

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
                      <td>NameRoom</td>
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
                  // Камера отключена — берем значения из localStorage
                  const storedCamera = getCameraFromLocalStorage(camera.port);

                  return (
                    <tr
                      key={camera.id}
                      onDoubleClick={() => handleDoubleClick(camera)}
                      id={cameraId}
                      className={isDisabled ? `${LCStyles.tableRow} ${LCStyles.disabledRow}` : LCStyles.tableRow}
                    >
                      <td>{storedCamera ? storedCamera.id : camera.id}</td>
                      <td>{storedCamera ? (storedCamera.cell?.startsWith("null") ? 'Улица' : `Здание`) : 'Неизвестно'}</td>
                      <td>
                        {storedCamera
                          ? (storedCamera.cell?.startsWith("null")
                            ? ' '
                            : `${parseInt(storedCamera.cell.split('-')[0], 10) + 1}`)
                          : 'Неизвестно'}
                      </td>                      
                      <td>NameRoom</td>
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
