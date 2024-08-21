import React, { FC, useState } from 'react';
import { BsLayoutTextWindow } from "react-icons/bs";
import FStyles from './Feeding.module.css';
import ListCamera from '../../components/ListCamera';
import Room from '../../components/Room';

const Feeding: FC = () => {
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [FlagLocal, setFlagLocal] = useState(true);

  const handleListCameraToggle = () => {
    setIsListCameraOpen(!isListCameraOpen);
  };

  return (
    <div>
      <div className={FStyles.listContainer}>
        <BsLayoutTextWindow
          className={FStyles.listIcon}
          onClick={handleListCameraToggle}
        />
      </div>
      {isListCameraOpen && (
        <ListCamera
          open={isListCameraOpen}
          onClose={() => setIsListCameraOpen(false)}
          onSelectCameras={handleListCameraToggle}
          FlagLocal={() => setFlagLocal(prev => !prev)}
        />
      )}
      <Room children={null} svgProps={{}} onCameraDropped={() => {}}/>
    </div>
  );
};

export default Feeding;
