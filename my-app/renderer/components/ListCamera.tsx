import React, { useState, useEffect } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BiX, BiRevision, BiSolidLayerPlus } from "react-icons/bi";
import StartStream from './StartStream';
import ModalStream from './ModalStream';

interface ListCameraProps {
  open: boolean;
  onClose: () => void;
  onSelectCameras: (cameras: any[]) => void;
  FlagLocal: () => void;
  onGridOpen: () => void;
}

interface Camera {
  id: number;
  name: string;
  address: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}

const ListCamera: React.FC<ListCameraProps> = ({
  open,
  onClose,
  onSelectCameras,
  FlagLocal,
  onGridOpen,
}) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      fetchCameras();
    }
  }, [open]);

  const fetchCameras = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4200/ip/cameras-list');
      if (response.ok) {
        const discoveredCameras = await response.json();
        setCameras(discoveredCameras);
      } else {
        setError('Не удалось обнаружить камеры');
      }
    } catch (err) {
      setError('Ошибка обнаружения камер: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = (camera: Camera) => {
    setSelectedCamera(camera);
    setShowModal(true);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('camera', JSON.stringify(camera));
  };

  if (!open) return null;

  return (
    <div className={LCStyles.sidebar}>
      <div className={LCStyles.buttonContainer}>
        <button onClick={onClose} className={LCStyles.closeButton}><BiX /></button>
        <div style={{ display: 'flex' }}>
          <button onClick={fetchCameras} className={LCStyles.refreshButton}><BiRevision /></button>
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
                <tr key={camera.id} onDoubleClick={() => handleDoubleClick(camera)}>
                  <td>{camera.name.split(/[^a-zA-Z0-9]/)[0]}</td>
                  <td>{camera.address ? camera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)?.[1] : 'N/A'}</td>
                  <td>
                    <div
                      className={LCStyles.iconContainer}
                      draggable
                      onDragStart={(e) => handleDragStart(e, camera)}
                    >
                      <BsFillCameraVideoFill className={LCStyles.icon} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ModalStream isOpen={showModal} onClose={() => setShowModal(false)}>
        {selectedCamera && (
          <StartStream
            rtspUrl={selectedCamera.rtspUrl}
            id={selectedCamera.id}
            cameraName={selectedCamera.name}
            setCam={() => setShowModal(false)}  // Добавляем закрытие стрима
          />
        )}
      </ModalStream>
    </div>
  );
};

export default ListCamera;
