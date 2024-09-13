import React, { FC, useEffect, useState } from 'react';
import RStyles from '../styles/Room.module.css';
import GStyles from '../styles/Grid.module.css';
import Svg1 from '../assets/Svg1.svg';
import Svg2 from '../assets/Svg2.svg';
import Svg3 from '../assets/Svg3.svg';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { Menu, Item, Separator, Submenu, useContextMenu, ItemParams } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";

interface Camera {
  id: number;
  name: string;
  address: string;
  floor?: number;
  cell?: string;
  initialPosition?: { rowIndex: number; colIndex: number };
  rtspUrl: string;
}

type RoomProps = {
  children: React.ReactNode;
  svgProps: any;
  onCameraDropped: (camera: Camera, rowIndex: number, colIndex: number) => void;
  droppedCameras: { [key: string]: Camera };
  activeFloor: number;
  onFloorChange: (floor: number) => void;
  onDoubleClickCamera: (camera: Camera) => void;
  FlagLocal: () => void;
  rotationAngles: { [key: string]: number };
  setRotationAngles: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
};

const Room: FC<RoomProps> = ({ children, svgProps, droppedCameras, activeFloor, onFloorChange, onDoubleClickCamera, FlagLocal, rotationAngles, setRotationAngles }) => {
  const svgs = [Svg1, Svg2, Svg3];
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const menuClick = "Меню";
  const { show } = useContextMenu({ id: menuClick });

  useEffect(() => {
    if (selectedCameras) {
      FlagLocal();
    }
  }, [selectedCameras]);


  useEffect(() => {
    const savedDroppedCameras = localStorage.getItem('droppedCameras');

    if (savedDroppedCameras) {
      const parsedDroppedCameras = JSON.parse(savedDroppedCameras);

      // Создаем объект для хранения углов поворота
      const initialRotationAngles: { [key: string]: number } = {};

      Object.keys(parsedDroppedCameras).forEach((cameraKey) => {
        const camera = parsedDroppedCameras[cameraKey];
        if (camera.rotationAngle !== undefined) {
          const cameraId = `Камера ${camera.name.split(/[^a-zA-Z0-9]/)[0]}`;
          initialRotationAngles[cameraId] = camera.rotationAngle;
        }
      });

      // Устанавливаем начальные углы поворота в состояние
      setRotationAngles(initialRotationAngles);
    }
  }, []);
  const handleSvgClick = (index: number) => {
    onFloorChange(index);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('droppedCameras', JSON.stringify(camera));
  };

  const displayMenu = (e: React.MouseEvent<HTMLDivElement>, cameraId: string) => {
    e.preventDefault();
    show({ event: e, props: { cameraId } });
  };

  const handleItemClick = ({ id, event, props }: ItemParams<any, any>) => {
    const cameraId = props.cameraId;
    setRotationAngles((prevAngles) => ({
      ...prevAngles,
      [cameraId]: id === "rotateLeft" ? (prevAngles[cameraId] || 0) + 45 : (prevAngles[cameraId] || 0) - 45,
    }));
  };

  const handleDoubleClick = (camera: Camera) => {
    if (!selectedCameras.some(c => c.id === camera.id)) {
      setSelectedCameras([camera]);
      onDoubleClickCamera(camera);
      FlagLocal();
    } else {
      setSelectedCameras([]);
    }
  };

  return (
    <div className={RStyles.body}>
      <div className={RStyles.container}>
        <div className={RStyles.cards}>
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
            index === 2 && (
              <div
                key={index}
                className={`${RStyles.card} ${RStyles.active}`}
                onClick={() => handleSvgClick(index)}
              >
                <div className={GStyles.gridContainer}>
                  <div className={GStyles.grid}>
                    {Array.from({ length: 30 }).map((_, rowIndex) => (
                      Array.from({ length: 40 }).map((_, colIndex) => {
                        const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
                        const camera = droppedCameras[cellKey];
                        const cameraId = camera ? `Камера ${camera.name}` : '';
                        const rotationAngle = rotationAngles[cameraId] || 0;
                        return (
                          <div
                            key={cellKey}
                            id={cellKey}
                            className={`${GStyles.gridCell} ${RStyles.transparentCell}`}
                          >
                            {camera && (
                              <div
                                className={GStyles.cameraIcon}
                                draggable
                                onDragStart={(e) => handleDragStart(e, camera)}
                                onDoubleClick={() => handleDoubleClick(camera)}
                                id={cameraId}
                                title={cameraId}
                                onContextMenu={(e) => displayMenu(e, cameraId)}
                              >
                                <BsFillCameraVideoFill style={{ transform: `rotate(${rotationAngle}deg)` }} />
                                <div
                                  className={GStyles.cameraViewSector}
                                  style={{
                                    transform: `rotate(${rotationAngle}deg)`,
                                    clipPath: `polygon(50% 50%, 100% 0%, 100% 100%)`,
                                  }}
                                />
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