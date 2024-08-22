import React, { FC, useState } from 'react';
import { BsLayoutTextWindow } from "react-icons/bs";
import FStyles from './Feeding.module.css';
import ListCamera from '../../components/ListCamera';
import Room from '../../components/Room';
import Grid from '../../components/Grid';

const Feeding: FC = () => {
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [FlagLocal, setFlagLocal] = useState(true);
  const [isGridOpen, setIsGridOpen] = useState(false);

  const handleListCameraToggle = () => {
    setIsListCameraOpen(!isListCameraOpen);
  };

  const handleGridOpen = () => {
    setIsGridOpen((prev) => !prev);
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
          onGridOpen={handleGridOpen}
        />
      )}
      <div className={FStyles.roomContainer}>
        <Room children={null} svgProps={{}} onCameraDropped={() => {}} />
        <div className={FStyles.gridContainer}>
          {isGridOpen && (
            <div>
              <Grid />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feeding;
