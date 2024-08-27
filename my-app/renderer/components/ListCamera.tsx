import { FC, useEffect, useState } from 'react';
import LCStyles from '../styles/ListCamera.module.css';

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

const ListCamera: FC<ListCameraProps> = ({ open, onClose, onSelectCameras, FlagLocal }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);

  useEffect(() => {
    if (open) {
      handleDiscoverCameras();
    }
  }, [open]);

  const handleDiscoverCameras = async () => {
    try {
      const response = await fetch('http://localhost:4200/ip/cameras-list');
      if (response.ok) {
        const discoveredCameras = await response.json();
        setCameras(discoveredCameras);
      } else {
        console.error('Failed to discover cameras');
      }
    } catch (error) {
      console.error('Error discovering cameras:', error);
    }
  };

  const handleCheckboxChange = (camera: Camera) => {
    setSelectedCameras((prevSelectedCameras) =>
      prevSelectedCameras.some((c) => c.id === camera.id)
        ? prevSelectedCameras.filter((c) => c.id !== camera.id)
        : [...prevSelectedCameras, camera]
    );console.log(selectedCameras)
  };

  const handleStartStreams = () => {
    onSelectCameras(selectedCameras);
    const savedCameras = localStorage.getItem('cameras');
    let camerasArray = [];

    if (savedCameras && savedCameras.length !== 0) {
      camerasArray = JSON.parse(savedCameras);
    }

    selectedCameras.forEach((SerchedCamera, index) => {
      const cameraName = SerchedCamera.name.split(/[^a-zA-Z0-9]/)[0];
      const ipAddress = SerchedCamera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)[1];
      const rtspUrl = `rtsp://admin:Dd7560848@${ipAddress}`;
      const newCamera = { id: camerasArray.length + 1, rtspUrl, name: cameraName };
      camerasArray.push(newCamera);
    });

    localStorage.setItem('cameras', JSON.stringify(camerasArray));
    console.log(selectedCameras);
    FlagLocal();
  };

  if (!open) return null;

  return (
    <div className={LCStyles.modalOverlay} onClick={onClose}>
      <div className={LCStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={LCStyles.closeButton} onClick={onClose}>X</button>
        <table className={LCStyles.tableContainer}>
          <thead>
            <tr>
              <th>Название камеры</th>
              <th>IP</th>
              <th>Название комнаты</th>
              <th>Выбрать</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((camera) => (
              <tr key={camera.id}>
                <td>{camera.name.split(/[^a-zA-Z0-9]/)[0]}</td>
                <td>{camera.address ? camera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)?.[1] : 'N/A'}</td>
                <td>
                  <input type="text" placeholder="Введите название комнаты" />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(camera)}
                    checked={selectedCameras.some((c) => c.id === camera.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={LCStyles.startStreamButton} onClick={handleStartStreams}>
          Запустить стримы
        </button>
      </div>
    </div>
  );
};

export default ListCamera;