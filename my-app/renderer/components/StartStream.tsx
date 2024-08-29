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
  rtspUrl: string;
  id: number;
  cameraName: string;
  setCam: (cameras: Camera[]) => void;
}

const StartStream: FC<StartStreamProps> = ({ rtspUrl, id, cameraName, setCam }) => {
  const [port, setPort] = useState(9999 + id);
  const [streamStarted, setStreamStarted] = useState(false);
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [players, setPlayers] = useState(null);
  const [isRecording, setIsRecording] = useState(false);


  useEffect(() => {
    const startStream = async () => {
      try {
        const response = await fetch('http://localhost:4200/ip/start-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rtspUrl, port }),
        });

        if (response.ok) {
          setStreamStarted(true);
          console.log('Stream started successfully.');
        } else {
          setError(`Failed to start stream for camera ${cameraName}`);
          console.error('Failed response:', response);
        }
      } catch (error) {
        setError(`Error starting stream for camera ${cameraName}: ${error}`);
        console.error('Error:', error);
      }
    };

    startStream();
  }, [rtspUrl, id, cameraName]);

  useEffect(() => {
    if (streamStarted) {
      const url = `ws://localhost:${port}`;
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
      return () => {
        if (player) {
          player.destroy();
        }
      };
    }
  }, [streamStarted, port, id]);

  const handleDelete = async () => {
    const savedCameras = localStorage.getItem('cameras');
    if (!savedCameras) return;

    let newCameras: Camera[] = JSON.parse(savedCameras);
    const camera = newCameras.find((camera) => camera.id === id);
    if (!camera) return;

    const port = 9999 + id;
    const response = await fetch('http://localhost:4200/ip/stop-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ port }),
    });

    if (!response.ok) {
      console.error(`Failed to stop stream: ${response.statusText}`);
      return;
    }

    newCameras = newCameras.filter((camera) => camera.id !== id);
    localStorage.setItem('cameras', JSON.stringify(newCameras));
    setCam(newCameras);
  };

  const handleStartRecording = () => {
    fetch('http://localhost:4200/ip/start-recording', {
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
    fetch('http://localhost:4200/ip/stop-recording', {
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
