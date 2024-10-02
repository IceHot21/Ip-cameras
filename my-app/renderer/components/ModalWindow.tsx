import React, { FC, useEffect, useRef } from 'react';
import HStyles from '../pages/Home/Home.module.css'; // Подключите ваши стили

interface ModalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  predictionsData: any[];
}

const ModalWindow: FC<ModalWindowProps> = ({ isOpen, onClose, imageUrl, predictionsData }) => {
  if (!isOpen) return null;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const translations = {
      "person": "человек",
      "tv": "экран",
      "suitcase": "чемодан",
      'chair': 'стул',
      'dining table': 'рабочее место',
  }
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем bounding box и текст
    const bboxArray = predictionsData[2].split(',').map(Number);
    const [x, y, width, height] = bboxArray;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = 'red';
    ctx.font = '16px Arial';
    ctx.fillText(`${translations[predictionsData[0]]}(${predictionsData[1].slice(0, 4)})`, x, y - 5);
  }, [predictionsData]);

  return (
    <div className={HStyles.modalOverlay} onClick={onClose}>
      <div className={HStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Screenshot" className={HStyles.modalImage} />
        <canvas
          ref={canvasRef}
          className={HStyles.modalCanvas}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', marginTop:'35px', backgroundColor: 'transparent' }}
          width={1920} // Установите ширину и высоту в соответствии с вашим изображением
          height={1080}
        />
        <button onClick={onClose} className={HStyles.modalCloseButton}>Закрыть</button>
      </div>
    </div>
  );
};

export default ModalWindow;