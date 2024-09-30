import { useState, useEffect, FC, memo } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BiX, BiRevision, BiSolidLayerPlus } from "react-icons/bi";
import { FaCheck } from 'react-icons/fa';
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
      console.log(response)
      console.log(droppedCameras);
      if (response.length > 0) {
            // Преобразуем объект droppedCameras в массив
        const droppedCamerasArray = Object.values(droppedCameras);
        // Получаем камеры из localStorage
        // Добавляем флаг isDisabled для камер, которые есть в localStorage
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
    console.log('Drag start:', camera);
  };

  const handleAddCameraClick = () => {
    setIsAddingCamera(!isAddingCamera);
  };

  if (!open) return null;

  return (
    <motion.div className={LCStyles.sidebar}
        style={{height: '100% !important'}}
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
                <th>Название камеры</th>
                <th>IP</th>
                <th></th>
              </tr>
            </thead>
            <tbody className={LCStyles.tableBody}>
              {cameras.map((camera) => {
                const cameraId = `${camera.port}`;
                const isDisabled = movedCameras.has(camera.id) || camera.isDisabled || (camera.initialPosition && (camera.initialPosition.rowIndex !== -1 || camera.initialPosition.colIndex !== -1));

                return (
                  <tr
                    key={camera.id}
                    onDoubleClick={() => handleDoubleClick(camera)}
                    id={cameraId}
                    className={isDisabled ? `${LCStyles.tableRow} ${LCStyles.disabledRow}` : LCStyles.tableRow}
                  >
                    <td>{camera.name}</td>
                    <td>{camera.rtspUrl}</td>
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
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
});

export default ListCamera;
