import React, { FC, useState } from 'react';
import Svg1 from '../assets/Svg1.svg';
import Svg2 from '../assets/Svg2.svg';
import Svg3 from '../assets/Svg3.svg';
import RStyles from '../styles/RStyles.module.css';
import { BsFillCameraVideoFill } from "react-icons/bs";

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
                <div className={RStyles.tableOverlay}>
                  <table>
                    <tbody>
                      {Array.from({ length: 15 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {Array.from({ length: 20 }).map((_, colIndex) => (
                            <td
                              key={`${rowIndex}-${colIndex}`}
                              className={RStyles.tableCell}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                              onDragOver={handleDragOver}
                            >
                              {droppedCameras[`${rowIndex}-${colIndex}`] && (
                                <BsFillCameraVideoFill />
                              )}
                              {selectedCell === `${rowIndex}-${colIndex}` && (
                                <div className={RStyles.selectedCell} />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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