import { useState, useEffect, FC } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BiX, BiRevision, BiSolidLayerPlus } from "react-icons/bi";
import { FaCheck } from 'react-icons/fa';
import { fetchWithRetry } from '../refreshToken';

interface ListCameraProps {
  open: boolean;
  onClose: () => void;
  FlagLocal: () => void;
  onGridOpen: () => void;
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

const ListCamera: FC<ListCameraProps> = ({
  open,
  onClose,
  FlagLocal,
  onGridOpen,
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
      const response = await fetchWithRetry('https://192.168.0.147:4200/stream/cameras', 'GET', null, '/list-cameras');
      console.log('Cameras discovered:', response);
      if (response.length > 0) {

        setCameras(response);
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
    onGridOpen();
  };

  if (!open) return null;

  return (
    <div className={LCStyles.sidebar}>
      <div className={LCStyles.buttonContainer}>
        <button onClick={onClose} className={LCStyles.closeButton} title="Закрыть"><BiX /></button>
        <div style={{ display: 'flex' }}>
          <button onClick={handleDiscoverCameras} className={LCStyles.refreshButton} title="Обновить"><BiRevision /></button>
          <button onClick={handleAddCameraClick} className={LCStyles.plusButton} >
            {isAddingCamera ? <FaCheck title="Сохранить камеру" /> : <BiSolidLayerPlus title="Добавить камеру" />}
          </button>
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
                const isDisabled = movedCameras.has(camera.id) || (camera.initialPosition && (camera.initialPosition.rowIndex !== -1 || camera.initialPosition.colIndex !== -1));
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
    </div>
  );
};

export default ListCamera;
