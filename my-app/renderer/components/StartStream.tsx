import { FC, useEffect, useState } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import TStyles from '../pages/Translation/Transletion.module.css';

interface StartStreamProps {
  rtspUrl: string;
  id: number;
  cameraName: string;
}

const StartStream: FC<StartStreamProps> = ({ rtspUrl, id, cameraName }) => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    startRtspStream(rtspUrl, id, cameraName);
  }, [rtspUrl, id, cameraName]);

  const startRtspStream = async (rtspUrl: string, id: number, cameraName: string) => {
    const port = 9999 + id;
    try {
      const response = await fetch('http://localhost:4200/ip/start-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rtspUrl, port })
      });
      console.log(rtspUrl, port);
      console.log(id);
      if (response.ok) {
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        canvasContainer.dataset.index = id.toString();

        const canvas = document.createElement('canvas');
        canvas.id = `canvas${id}`;
        canvas.style.width = '500px'; // Устанавливаем ширину canvas
        canvasContainer.appendChild(canvas);

        const canvasesElement = document.getElementById('canvases');
        if (canvasesElement) {
          canvasesElement.appendChild(canvasContainer);

          // Используем jsmpeg для воспроизведения потока на canvas
          const url = `ws://localhost:${port}`;
          const player = new JSMpeg.Player(url, {
            canvas,
            autoplay: true,
            onVideoDecode: async (decoder, time) => {
            },
            onSourceEstablished: () => console.log(`Источник установлен для порта ${port}`),
            onSourceCompleted: () => console.log(`Источник завершен для порта ${port}`),
            onError: (error) => console.error(`Error in JSMpeg player: ${error}`)
          });
          console.log(`Stream started for camera ${cameraName} on canvas ${canvas.id}`);
        } else {
          console.error('Element with id "canvases" not found');
        }
      } else {
        console.error(`Failed to start stream for camera ${cameraName}`);
      }
    } catch (error) {
      console.error(`Error starting stream for camera ${cameraName}:`, error);
    }
  };

  return (
    <div id="canvases" ></div>
  );
};

export default StartStream;