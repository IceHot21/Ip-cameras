import { useState, useEffect, FC } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import SSStyles from '../styles/StartStream.module.css';
import { BiX } from 'react-icons/bi';

interface Camera {
  id: number;
  name: string;
  address: string;
  floor?: number;
  cell?: string;
  initialPosition?: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}
interface StartStreamProps {
  navigate: (path: string) => Promise<boolean>;
  port: number;
  rtspUrl: string;
  id: number;
  cameraName: string;
  setCam: (cameras: Camera[]) => void;
  onClose: () => void;
}

const StartStream: FC<StartStreamProps> = ({ port, rtspUrl, id, cameraName, setCam, onClose, navigate }) => {
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState(null);
  const [isRecording, setIsRecording] = useState(false);


  useEffect(() => {
      const url = `ws://192.168.0.144:${port}`;
      const player = new JSMpeg.Player(url, {
        canvas: document.getElementById(`canvas${id}`),
        autoplay: true,
        onVideoDecode: async (decoder, time) => {
        },
        onSourceEstablished: () =>
          console.log(`Источник установлен для порта ${port}`),
        onSourceCompleted: () =>
          console.log(`Источник завершен для порта ${port}`),
        onError: (error) =>
          console.error(`Error in JSMpeg player: ${error}`),
      });
      setPlayers(player);

      console.log(`Stream started for camera ${cameraName} on canvas ${id}`);
      // return () => {
      //   if (player) {
      //     player.destroy();
      //   }
      // };
  }, [port, id]);

  const handleDelete = async () => {
    players.destroy()
    onClose();
  };

  const handleStartRecording = () => {
    fetch('https://localhost:4200/ip/start-recording', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rtspUrl, port, cameraName }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(
              `Запись начата на порту ${port} с именем файла ${data.fileName}`
            );
            setIsRecording(true);
          });
        } else {
          console.error('Не удалось начать запись');
        }
      })
      .catch((error) => {
        console.error('Ошибка при начале записи:', error);
      });
  };

  const handleStopRecording = () => {
    fetch('https://localhost:4200/ip/stop-recording', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ port }),
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Запись остановлена на порту ${port}`);
          setIsRecording(false);
        } else {
          console.error('Не удалось остановить запись');
        }
      })
      .catch((error) => {
        console.error('Ошибка при остановке записи:', error);
      });
  };

  const handleTakeScreenshot = () => {
  };

  return (
    <div className={SSStyles.startContainer}>
      <div
        className={`${SSStyles.canvasesContainer} canvas-container${port}`}
      >
        {<div className={`${SSStyles.cameraName} camera-name`}>{cameraName}</div>}
        <div className={SSStyles.deleteBut}>
          <button onClick={handleDelete}><BiX /></button>
        </div>
        <canvas id={`canvas${id}`} />
        <div className={SSStyles.buttonsContainer}>
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            {isRecording ? 'Стоп' : 'Запись'}
          </button>
          <button onClick={handleTakeScreenshot}>Сделать скриншот</button>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default StartStream;
