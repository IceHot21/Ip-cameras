import React, { FC, useState } from 'react';
import Svg1 from '../assets/Svg1.svg';
import Svg2 from '../assets/Svg2.svg';
import Svg3 from '../assets/Svg3.svg';
import RStyles from '../styles/Room.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";
import Grid from './Grid'; 

type RoomProps = {
  children: React.ReactNode;
  svgProps: any;
  onCameraDropped: (camera: Camera) => void;
};

interface Camera {
  id: number;
  name: string;
  address: string;
}

const Room: FC<RoomProps> = ({ children, svgProps, onCameraDropped }) => {
  const [activeSvg, setActiveSvg] = useState(0);
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera }>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const svgs = [Svg1, Svg2, Svg3];

  const handleSvgClick = (index: number) => {
    setActiveSvg(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    const cameraData = e.dataTransfer.getData('camera');
    const camera: Camera = JSON.parse(cameraData);

    setDroppedCameras((prev) => ({
      ...prev,
      [`${rowIndex}-${colIndex}`]: camera,
    }));

    onCameraDropped(camera);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell(`${rowIndex}-${colIndex}`);
  };

  return (
    <div className={RStyles.body}>
      <div className={RStyles.container}>
        <div className={RStyles.cards}>
          <div className={RStyles.inactiveContainer}>
            {svgs.map((SvgComponent, index) => (
              index !== activeSvg && (
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
            index === activeSvg && (
              <div
                key={index}
                className={`${RStyles.card} ${RStyles.active}`}
                onClick={() => handleSvgClick(index)}
              >
                <SvgComponent {...svgProps} />
              </div>
            )
          ))}
        </div>
        {children}
      </div>
      {/* Добавляем сетку во второй столбец */}
{/*       <div className={RStyles.gridContainer}>
        <Grid />
      </div> */}
    </div>
  );
};

export default Room;