import React, { useState, useEffect } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError('Failed to discover cameras');
      }
    } catch (err) {
      setError('Error discovering cameras: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (camera: Camera) => {
    const isSelected = selectedCameras.includes(camera);
    if (isSelected) {
      setSelectedCameras(selectedCameras.filter((c) => c !== camera));
    } else {
      setSelectedCameras([...selectedCameras, camera]);
    }
  };

  const handleStartStreams = () => {
    onSelectCameras(selectedCameras);
    const savedCameras = localStorage.getItem('cameras');
    let camerasArray = [];

    if (savedCameras.length !== 0) {
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
    <div className={LCStyles.container}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
                  <td><BsFillCameraVideoFill /></td>
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