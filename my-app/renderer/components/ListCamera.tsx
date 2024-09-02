import { useState, useEffect, FC } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BiX, BiRevision, BiSolidLayerPlus } from "react-icons/bi";
import { FaCheck } from 'react-icons/fa';

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
      handleStartStreams();
    }
  }, [selectedCameras]);

  useEffect(() => {
    handleDiscoverCameras();
  }, [droppedCameras]);

  const handleDiscoverCameras = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4200/ip/cameras-list');
      if (response.ok) {
        const discoveredCameras: Camera[] = await response.json();
        const storedCameras = localStorage.getItem('droppedCameras');
        let droppedCameras = storedCameras ? JSON.parse(storedCameras) : {};

        const camerasInGrid = Object.values(droppedCameras).reduce((acc: { [key: string]: boolean }, camera: Camera) => {
          const ipAddress = camera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)?.[1];
          if (ipAddress && camera.initialPosition && camera.initialPosition.rowIndex !== -1 && camera.initialPosition.colIndex !== -1) {
            acc[ipAddress] = true;
          }
          return acc;
        }, {});

        const filteredCameras = discoveredCameras.filter((camera) => {
          const ipAddress = camera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)?.[1];
          return ipAddress && !camerasInGrid[ipAddress];
        });

        setCameras(filteredCameras);
        localStorage.setItem('droppedCameras', JSON.stringify(droppedCameras));
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
      handleStartStreams();
    } else {
      setSelectedCameras([]);
    }
  };

  const handleStartStreams = () => {
    const savedCameras = localStorage.getItem('cameras');
    let camerasArray = [];

    if (savedCameras && savedCameras.length !== 0) {
      camerasArray = JSON.parse(savedCameras);
    }

    selectedCameras.forEach((searchedCamera, index) => {
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
                const cameraId = `Камера ${camera.name.split(/[^a-zA-Z0-9]/)[0]}`;
                const isDisabled = movedCameras.has(camera.id) || (camera.initialPosition && (camera.initialPosition.rowIndex !== -1 || camera.initialPosition.colIndex !== -1));
                return (
                  <tr
                    key={camera.id}
                    onDoubleClick={() => handleDoubleClick(camera)}
                    id={cameraId}
                    className={isDisabled ? `${LCStyles.tableRow} ${LCStyles.disabledRow}` : LCStyles.tableRow}
                  >
                    <td>{camera.name.split(/[^a-zA-Z0-9]/)[0]}</td>
                    <td>{camera.address ? camera.address.match(/(?:http:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/)?.[1] : "N/A"}</td>
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
