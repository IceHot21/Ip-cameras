import { useState, useEffect, FC } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BiX, BiRevision, BiSolidLayerPlus } from "react-icons/bi";

interface ListCameraProps {
  open: boolean;
  onClose: () => void;
  onSelectCameras: (cameras: any[]) => void; // Обновляем типизацию
  FlagLocal: () => void;
  onGridOpen: () => void;
}

interface Camera {
  id: number;
  name: string;
  address: string;
  floor?: number;
  cell?: string;
  initialPosition?: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}

const ListCamera: FC<ListCameraProps> = ({
  open,
  onClose,
  onSelectCameras,
  FlagLocal,
  onGridOpen,
}) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);

  useEffect(() => {
    if (open) {
      handleDiscoverCameras();
    }
  }, [open]);

  useEffect(() => {
    if(selectedCameras){
      handleStartStreams();
    }
  }, [selectedCameras]);

  const handleDiscoverCameras = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4200/ip/cameras-list');
      if (response.ok) {
        const discoveredCameras = await response.json();
        setCameras(discoveredCameras);
      } else {
        console.error('Failed to discover cameras');
        setError('Не удалось обнаружить камеры');
      }
    } catch (error) {
      console.error('Error discovering cameras:', error);
      setError('Ошибка обнаружения камер');
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = (camera: Camera) => {
    if (!selectedCameras.some(c => c.id === camera.id)) {
      const newSelectedCameras = [...selectedCameras, camera];
      setSelectedCameras(newSelectedCameras);
      onSelectCameras(newSelectedCameras); 
    }
  };

  const handleStartStreams = () => {
    const savedCameras = localStorage.getItem('cameras');
    let camerasArray = [];

    if (savedCameras && savedCameras.length !== 0) {
      camerasArray = JSON.parse(savedCameras);
    }

    selectedCameras.forEach((SerchedCamera, index) => {
      console.log(SerchedCamera);

      const cameraName = SerchedCamera.name.split(/[^a-zA-Z0-9]/)[0];
      const ipAddress = SerchedCamera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)[1];
      const rtspUrl = `rtsp://admin:Dd7560848@${ipAddress}`;
      const newCamera = { id: camerasArray.length + 1, rtspUrl, name: cameraName };
      console.log(newCamera);
      camerasArray.push(newCamera);
    });

    localStorage.setItem('cameras', JSON.stringify(camerasArray));
    console.log(selectedCameras);
    FlagLocal();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('droppedCameras', JSON.stringify(camera));
  };

  if (!open) return null;

  return (
    <div className={LCStyles.sidebar}>
      <div className={LCStyles.buttonContainer}>
        <button onClick={onClose} className={LCStyles.closeButton}><BiX /></button>
        <div style={{ display: 'flex' }}>
          <button onClick={handleDiscoverCameras} className={LCStyles.refreshButton}><BiRevision /></button>
          <button onClick={onGridOpen} className={LCStyles.plusButton}><BiSolidLayerPlus /></button>
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
            <tbody>
              {cameras.map((camera) => (
                <tr
                  key={camera.id}
                  onDoubleClick={() => handleDoubleClick(camera)}
                >
                  <td>{camera.name.split(/[^a-zA-Z0-9]/)[0]}</td>
                  <td>{camera.address ? camera.address.match(/(?:http:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/)?.[1] : "N/A"}</td>
                  <td>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, camera)}
                    >
                      <BsFillCameraVideoFill />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListCamera;
