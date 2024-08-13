import { FC, useEffect, useState } from 'react';
import TStyles from './Transletion.module.css';
import CameraList from '../../components/CameraList';
import JSMpeg from '@cycjimmy/jsmpeg-player';

const Translation: FC = () => {
  const [cameras, setCameras] = useState<any[]>([]);

  useEffect(() => {
    const savedCameras = localStorage.getItem('cameras');
    if (savedCameras) {
      const cameras = JSON.parse(savedCameras);
      setCameras(cameras);
      cameras.forEach((camera: any, index: number) => {
        startRtspStream(camera.rtspUrl, index, camera.name);
      });
    }
  }, []);

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
        const canvas = document.createElement('canvas');
        canvas.id = `canvas${id}`;
        document.getElementById('canvases')?.appendChild(canvas);
  
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
        console.error(`Failed to start stream for camera ${cameraName}`);
      }
    } catch (error) {
      console.error(`Error starting stream for camera ${cameraName}:`, error);
    }
  };

  const handleDeleteCamera = async (id: number) => {
    const port = 9999 + id;
    const response = await fetch('http://localhost:4200/ip/stop-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ port })
    });

    if (response.ok) {
      const savedCameras = localStorage.getItem('cameras');
      if (savedCameras) {
        const cameras = JSON.parse(savedCameras).filter((camera: any) => camera.id !== id);
        localStorage.setItem('cameras', JSON.stringify(cameras));
        setCameras(cameras);
      }
    }
  };

  return (
    <div>
      <CameraList />
      <div className={TStyles.canvasesContainer} id="canvases">
        {cameras.map((camera, index) => (
          <div key={`${camera.id}-${index}`} className="canvas-container">
            <canvas id={`canvas${camera.id}`}></canvas>
            <button onClick={() => handleDeleteCamera(camera.id)}>Удалить камеру</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Translation;
