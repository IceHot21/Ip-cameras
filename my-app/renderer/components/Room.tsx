import React, { FC,useState } from 'react';
import Svg1 from '../assets/Svg1.svg';
import Svg2 from '../assets/Svg2.svg';
import Svg3 from '../assets/Svg3.svg';
import RStyles from '../styles/Room.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";

interface Camera {
  id: number;
  name: string;
  address: string;
  position: { row: number, col: number } | null;
}

type RoomProps = {
  cameras: Camera[];
  onCameraDropped: (camera: Camera, position: { row: number; col: number }) => void;
};

const Room: FC<RoomProps> = ({ cameras, onCameraDropped }) => {
  const [activeSvg, setActiveSvg] = useState(0);
  const svgs = [Svg1, Svg2, Svg3];

  const handleSvgClick = (index: number) => {
    setActiveSvg(index);
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
                  <SvgComponent />
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
                <SvgComponent />
              </div>
            )
          ))}
        </div>
        {/* отображаем камеры на активном плане */}
        {cameras.map((camera) => 
          camera.position && (
            <div 
              key={camera.id}
              style={{
                position: 'absolute', 
                top: `${camera.position.row * 10}px`, 
                left: `${camera.position.col * 10}px`
              }}
            >
              <BsFillCameraVideoFill />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Room;
