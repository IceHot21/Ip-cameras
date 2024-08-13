import { FC, useState } from 'react';

interface CameraItemProps {
  camera: any;
  onAdd: (rtspUrl: string, cameraName: string, cameraId: number) => void;
  startRtspStream: any;
}

const CameraItem:FC<CameraItemProps> = ({ camera, onAdd }) => {
  const [roomName, setRoomName] = useState('');

  const handleAddCamera = () => {
    if (roomName) {
      const rtspUrl = `rtsp://admin:Dd7560848@${camera.address.match(/(?:http:\/\/)?(\d+\.\d+\.\d+\.\d+)/)[1]}`;
      console.log(camera.address.match());
      onAdd(rtspUrl, roomName, camera.id);
    }
  };

  return (
    <div>
      <span>{camera.name}</span>
      <span>{camera.address}</span>
      <input
        type="text"
        placeholder="Введите название комнаты"
        value={roomName}
        onChange={e => setRoomName(e.target.value)}
      />
      <button onClick={handleAddCamera}>Добавить камеру</button>
    </div>
  );
};

export default CameraItem;