import React, { useState, useEffect } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BiX } from "react-icons/bi";
import { BiRevision } from "react-icons/bi";

interface ListCameraProps {
  open: boolean;
  onClose: () => void;
  onSelectCameras: (cameras: any[]) => void;
  FlagLocal: () => void;
}

interface Camera {
  id: number;
  name: string;
  address: string;
}

const ListCamera: React.FC<ListCameraProps> = ({
  open,
  onClose,
  onSelectCameras,
  FlagLocal,
}) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoaded(true);
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

  const handleSelectCamera = (camera: Camera) => {
    const isSelected = selectedCameras.includes(camera);
    if (isSelected) {
      setSelectedCameras(selectedCameras.filter((c) => c.id !== camera.id));
    } else {
      setSelectedCameras([...selectedCameras, camera]);
    }
  };

  const handleSelectAllCameras = () => {
    if (selectedCameras.length === cameras.length) {
      setSelectedCameras([]);
    } else {
      setSelectedCameras(cameras);
    }
  };

  const handleRefresh = () => {
    fetchCameras();
  };

  if (!open) return null;

  return (
    <div className={LCStyles.sidebar}>
      <div className={LCStyles.buttonContainer}>
        <button onClick={onClose} className={LCStyles.closeButton}><BiX/></button>
        <button onClick={handleRefresh} className={LCStyles.refreshButton}><BiRevision /></button>
      </div>
      {isLoaded && loading && (
        <div className={LCStyles.loadingTable}>
          <p>Загрузка...</p>
        </div>
      )}
      {!loading && !error && (
        <div className={LCStyles.tableContainer}>
          <table>
            <thead className={LCStyles.tableHeader}>
              <tr>
                <th>Название камеры</th>
                <th>IP</th>
                <th>Добавить</th>
              </tr>
            </thead>
            <tbody>
              {cameras.map((camera) => (
                <tr key={camera.id}>
                  <td>{camera.name.split(/[^a-zA-Z0-9]/)[0]}</td>
                  <td>{camera.address ? camera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)?.[1] : 'N/A'}</td>
                  <td>
                    <BsFillCameraVideoFill />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ListCamera;