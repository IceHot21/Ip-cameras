import React, { FC, useState } from 'react';
import RStyles from '../styles/Room.module.css';
import GStyles from '../styles/Grid.module.css'; // Импортируем стили для сетки, чтобы использовать их в компоненте Room
import Svg1 from '../assets/Svg1.svg';
import Svg2 from '../assets/Svg2.svg';
import Svg3 from '../assets/Svg3.svg';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import ModalStream from './ModalStream'; // Импортируйте компонент Modal
import StartStream from './StartStream';

interface Camera {
  id: number;
  name: string;
  address: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}

type RoomProps = {
  children: React.ReactNode;
  svgProps: any;
  onCameraDropped: (camera: Camera, rowIndex: number, colIndex: number) => void;
  droppedCameras: { [key: string]: Camera };
  activeFloor: number;
  onFloorChange: (floor: number) => void;
};

const Room: FC<RoomProps> = ({ children, svgProps, droppedCameras, activeFloor, onFloorChange }) => {
  const svgs = [Svg1, Svg2, Svg3];
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const handleSvgClick = (index: number) => {
    onFloorChange(index);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('camera', JSON.stringify(camera));
  };

  const handleDoubleClick = (camera: Camera) => {
    setSelectedCamera(camera);
    setShowModal(true);
  };
  return (
    <div className={RStyles.body}>
      <div className={RStyles.container}>
        <div className={RStyles.cards}>
          {/* Отображение неактивных этажей */}
          <div className={RStyles.inactiveContainer}>
            {svgs.map((SvgComponent, index) => (
              index !== activeFloor && (
                <div
                  key={index}
                  className={`${RStyles.card} ${RStyles.inactive}`}
                  onClick={() => handleSvgClick(index)}
                >
                  <div className={RStyles.indexText}>{index + 1}</div>
                  <SvgComponent {...svgProps} />
                </div>
              )
            ))}
          </div>
          {svgs.map((SvgComponent, index) => (
            index === activeFloor && (
              <div
                key={index}
                className={`${RStyles.card} ${RStyles.active}`}
                onClick={() => handleSvgClick(index)}
              >
                <SvgComponent {...svgProps} />
                {/* Полупрозрачная сетка */}
                <div className={GStyles.gridContainer}>
                  <div className={GStyles.grid}>
                    {Array.from({ length: 15 }).map((_, rowIndex) => (
                      Array.from({ length: 20 }).map((_, colIndex) => {
                        const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;

                        return (
                          <div
                            key={cellKey}
                            id={cellKey}
                            className={`${GStyles.gridCell} ${RStyles.transparentCell}`}
                          >
                            {droppedCameras[cellKey] && (
                              <div className={GStyles.cameraIcon} id="cameraIcon"
                              draggable
                              onDragStart={(e) => handleDragStart(e, droppedCameras[cellKey])}
                              onDoubleClick={() => handleDoubleClick(droppedCameras[cellKey])}>
                                <BsFillCameraVideoFill />
                              </div>
                            )}
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        {children}
      </div>
      <ModalStream isOpen={showModal} onClose={() => setShowModal(false)}>
        {selectedCamera && (
          <StartStream
            rtspUrl={selectedCamera.rtspUrl}
            id={selectedCamera.id}
            cameraName={selectedCamera.name}
            setCam={() => setShowModal(false)}  // Добавляем закрытие стрима
          />
        )}
      </ModalStream>
    </div>
  );
};

export default Room;