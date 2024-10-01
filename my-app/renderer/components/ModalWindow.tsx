import React, { FC } from 'react';
import HStyles from '../pages/Home/Home.module.css'; // Подключите ваши стили

interface ModalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ModalWindow: FC<ModalWindowProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className={HStyles.modalOverlay} onClick={onClose}>
      <div className={HStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Screenshot" className={HStyles.modalImage} />
        <button onClick={onClose} className={HStyles.modalCloseButton}>Закрыть</button>
      </div>
    </div>
  );
};

export default ModalWindow;