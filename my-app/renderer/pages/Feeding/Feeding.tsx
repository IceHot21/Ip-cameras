import { FC, useState } from 'react';
import Room from '../../components/Room';
import { BsLayoutTextWindow } from "react-icons/bs";
import FStyles from '../Feeding/Feeding.module.css'
import ListCamera from '../../components/ListCamera'

interface RoomProps {
  children: React.ReactNode;
  svgProps: any;
}
const Feeding: FC = () => {
  const [isListCameraOpen, setIsListCameraOpen] = useState(false);
  const [FlagLocal, setFlagLocal] = useState(true);

  const handleListCameraToogle = () => {
    setIsListCameraOpen(!isListCameraOpen);
  }
  return (
    <div>
      <div className={FStyles.listContainer}>
        <BsLayoutTextWindow
          className={FStyles.listIcon}
          onClick={handleListCameraToogle}
        />
      </div>
      {isListCameraOpen && (
        <ListCamera
          open={isListCameraOpen}
          onClose={() => setIsListCameraOpen(false)}
          onSelectCameras={handleListCameraToogle}
          FlagLocal={() => setFlagLocal(prev => !prev)}
        />
      )}
      <Room children={null} svgProps={{}} />
    </div>
  );
};

export default Feeding;