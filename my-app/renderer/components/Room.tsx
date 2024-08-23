import React, { FC } from 'react';
import RStyles from '../styles/Room.module.css';
import GStyles from '../styles/Grid.module.css'; // Импортируем стили для сетки, чтобы использовать их в компоненте Room
import Svg1 from '../assets/Svg1.svg';
import Svg2 from '../assets/Svg2.svg';
import Svg3 from '../assets/Svg3.svg';
import { BsFillCameraVideoFill } from 'react-icons/bs';

interface Camera {
  id: number;
  name: string;
  address: string;
  floor: number;
  cell: string;
  initialPosition: { rowIndex: number; colIndex: number };
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

  const handleSvgClick = (index: number) => {
    onFloorChange(index);
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
          {/* Отображение активного этажа */}
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
                              <div className={GStyles.cameraIcon} id="cameraIcon">
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
    </div>
  );
};

export default Room;
