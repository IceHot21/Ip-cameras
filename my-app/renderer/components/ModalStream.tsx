import { FC } from 'react';
import MSStyles from '../styles/ModalStream.module.css' // Создайте стили для модального окна

interface ModalStreamProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalStream:FC<ModalStreamProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={MSStyles.modalOverlay} onClick={onClose}>
      <div className={MSStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={MSStyles.closeButton} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default ModalStream;
