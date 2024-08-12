import { FC } from 'react';

interface AddCameraButtonProps {
  onClick: () => void;
}

const AddCameraButton:FC<AddCameraButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>+</button>
  );
};

export default AddCameraButton;