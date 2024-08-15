import React, { useState, useEffect } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import SSStyles from '../styles/SSStyles.module.css';

interface Camera {
  id: number;
  name: string;
  address: string;
  rtspUrl: string;
}

const StreamPlayer = ({ rtspUrl, id, cameraName/* , onDelete, onStartRecording, onTakeScreenshot */ }) => {
  const [port, setPort] = useState(9999 + id);
  const [streamStarted, setStreamStarted] = useState(false);
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  useEffect(() => {
    const startStream = async () => {
      try {
        const response = await fetch(`http://localhost:4200/ip/start-stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rtspUrl, port })
        });

        if (response.ok) {
          setStreamStarted(true);
        } else {
          setError(`Failed to start stream for camera ${cameraName}`);
        }
      } catch (error) {
        setError(`Error starting stream for camera ${cameraName}: ${error}`);
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
          // console.log(`Video decode: ${time}`);
        },
        onSourceEstablished: () => console.log(`Источник установлен для порта ${port}`),
        onSourceCompleted: () => console.log(`Источник завершен для порта ${port}`),
        onError: (error) => console.error(`Error in JSMpeg player: ${error}`)
      });

      console.log(`Stream started for camera ${cameraName} on canvas ${id}`);
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ port })
    });

    if (!response.ok) {
      console.error(`Failed to stop stream: ${response.statusText}`);
      return;
    }

    if (JSMpeg.Player && JSMpeg.Player[port]) {
      JSMpeg.Player[port].destroy();
      delete JSMpeg.Player[port];
    }

    // Удалить канвас и камеру из DOM
    const canvas = document.querySelector(`.canvas-container${port}`);
    if (canvas) {
      canvas.remove();
    }

    newCameras = newCameras.filter((camera) => camera.id !== id);
    localStorage.setItem('cameras', JSON.stringify(newCameras));
    setCameras(newCameras);
  };

  const handleStartRecording = () => {

  };

  const handleTakeScreenshot = () => {

  };

  return (
    <div>
      <div className={`canvas-container${port}`} >
        <canvas id={`canvas${id}`} style={{ width: '500px' }} />
        <div className="camera-name">{cameraName}</div>
        <button onClick={handleDelete}>Удалить камеру</button>
        <button onClick={handleStartRecording}>Старт записи</button>
        <button onClick={handleTakeScreenshot}>Сделать скриншот</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default StreamPlayer;