import React, { FC, useEffect, useRef } from 'react';
import HStyles from '../pages/Home/Home.module.css'; // Подключите ваши стили
import LCStyles from '../styles/ListCamera.module.css';
import { BiX } from 'react-icons/bi';

interface ModalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  predictionsData: any[];
}

const ModalWindow: FC<ModalWindowProps> = ({ isOpen, onClose, imageUrl, predictionsData }) => {
  if (!isOpen) return null;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const translations = {
      "person": "человек",
      "tv": "экран",
      "suitcase": "чемодан",
      'chair': 'стул',
      'dining table': 'рабочее место',
    };

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ожидаем загрузки изображения
    img.onload = () => {
      // Устанавливаем размеры canvas равными размерам изображения
      canvas.width = img.width;
      canvas.height = img.height;

      // Рисуем bounding box и текст
      const bboxArray = predictionsData[2].split(',').map(Number);
      const [x, y, width, height] = bboxArray;

      // Масштабируем координаты bounding box
      const scaleX = img.width / 1920;
      const scaleY = img.height / 1080;

      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

      ctx.fillStyle = 'red';
      ctx.font = '16px Arial';
      ctx.fillText(`${translations[predictionsData[0]]}(${predictionsData[1].slice(0, 4)})`, scaledX, scaledY - 5);
    };

    // Загружаем изображение
    img.src = imageUrl;
  }, [predictionsData, imageUrl]);

  return (
    <div className={HStyles.modalOverlay} onClick={onClose}>
      <div className={HStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={LCStyles.closeButton} title="Закрыть"><BiX /></button>
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Screenshot"
          className={HStyles.modalImage}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        <canvas
          ref={canvasRef}
          className={HStyles.modalCanvas}
          style={{ position: 'absolute', top: '52.7vh', left: '1.2vh', pointerEvents: 'none', backgroundColor: 'transparent' }}
        />
        
      </div>
    </div>
  );
};

export default ModalWindow;