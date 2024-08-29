import React, { FC, useState } from 'react';
import RStyles from '../styles/Room.module.css';
import GStyles from '../styles/Grid.module.css'; 
import Svg1 from '../assets/Svg1.svg';
import Svg2 from '../assets/Svg2.svg';
import Svg3 from '../assets/Svg3.svg';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import ModalStream from './ModalStream'; 
import StartStream from './StartStream';

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
};

const Room: FC<RoomProps> = ({ children, svgProps, droppedCameras, activeFloor, onFloorChange, onDoubleClickCamera }) => {
  const svgs = [Svg1, Svg2, Svg3];
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);


  const handleSvgClick = (index: number) => {
    onFloorChange(index);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, camera: Camera) => {
    e.dataTransfer.setData('droppedCameras', JSON.stringify(camera));
  };

  const handleDoubleClick = (camera: Camera) => {
    if (!selectedCameras.some(c => c.id === camera.id)) {
      setSelectedCameras([camera]);
      onDoubleClickCamera(camera);
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
            index === activeFloor && (
              <div
                key={index}
                className={`${RStyles.card} ${RStyles.active}`}
                onClick={() => handleSvgClick(index)}
              >
                <SvgComponent {...svgProps} />
                <div className={GStyles.gridContainer}>
                  <div className={GStyles.grid}>
                    {Array.from({ length: 15 }).map((_, rowIndex) => (
                      Array.from({ length: 20 }).map((_, colIndex) => {
                        const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
                        const camera = droppedCameras[cellKey];

                        const cameraId = camera ? `Камера ${camera.name.split(/[^a-zA-Z0-9]/)[0]}` : '';

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
                              >
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
{/*       {selectedCamera && (
        <StartStream
          rtspUrl={selectedCamera.rtspUrl}
          id={selectedCamera.id}
          cameraName={selectedCamera.name}
          setCam={() => setShowModal(false)} 
        />
      )} */}
    </div>
  );
};

export default Room;