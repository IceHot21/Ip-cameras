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
  isPredictions: Prediction | null;
  FlagLocal: () => void;
}

interface Prediction {
  id: number;
  camera_port: number;
  item_predict: string;
  score_predict: string;
  date: string;
  bbox: string;
}

const StartStream: FC<StartStreamProps> = ({ port, rtspUrl, id, cameraName, setCam, onClose, isPredictions, navigate, FlagLocal }) => {
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
      const url = `ws://192.168.0.136:${port}`;
      const player = new JSMpeg.Player(url, {
        canvas: document.getElementById(`canvas${id}`),
        autoplay: true,
        onVideoDecode: async (decoder, time) => {
          //новый канвас для АИ
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
  }, [port, id]);

  useEffect(() => {
    const videoCanvas = document.getElementById(`canvas${id}`) as HTMLCanvasElement;
    const overlayCanvas = document.getElementById(`overlayCanvas${id}`) as HTMLCanvasElement;
    const ctx = overlayCanvas.getContext('2d');

    if (!ctx) return;

    const resizeCanvas = () => {
      overlayCanvas.width = videoCanvas.width;
      overlayCanvas.height = videoCanvas.height;
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [id]);

  useEffect(() => {
    const canvas = document.getElementById(`overlayCanvas${id}`) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(isPredictions == null) return
    if (Number(isPredictions.camera_port) == port) {
      console.log(isPredictions);
      const bboxArray = isPredictions.bbox.split(',').map(Number);
      const [x, y, width, height] = bboxArray;
    
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    
      ctx.fillStyle = 'red';
      ctx.font = '16px Arial';
      ctx.fillText(`${isPredictions.item_predict} (${isPredictions.score_predict.slice(0, 4)})`, x, y - 5);
    }
  }, [isPredictions, port, id]);


  const handleDelete = async () => {
    players.destroy()
    onClose();
    FlagLocal();
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
        <canvas id={`canvas${id}`} width="1920" height="1080" />
        <canvas id={`overlayCanvas${id}`} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', marginTop:'35px', backgroundColor: 'transparent' }} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default StartStream;
