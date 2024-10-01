import React, { FC, useState, lazy, Suspense, memo } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BiX, BiSolidLayerPlus } from "react-icons/bi";
import { FaCheck } from 'react-icons/fa';
import LSCGStyle from '../styles/ListSVG.module.css';
import { motion } from 'framer-motion';
import { FormControl, Input, InputLabel } from '@mui/material';
import { toast } from 'react-toastify';
import Collapsible from 'react-collapsible';

interface SVGItem {
  id: number;
  name: string;
}

interface ListSVGProps {
  navigate: (path: string) => Promise<boolean>;
  open: boolean;
  onClose: () => void;
  activeFloor: number;
  onSVGDrop: (svg: SVGItem) => void;
  isSelecting: boolean;
  selectedCells: number[][];
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCells: React.Dispatch<React.SetStateAction<number[][]>>;
}

const svgItems: SVGItem[] = [
  { id: 1, name: 'doorD' },
  { id: 2, name: 'doorL' },
  { id: 3, name: 'doorR' },
  { id: 4, name: 'doorV' },
  { id: 5, name: 'ugolLD' },
  { id: 6, name: 'ugolLV' },
  { id: 7, name: 'ugolRD' },
  { id: 8, name: 'ugolRV' },
  { id: 9, name: 'wallG' },
  { id: 10, name: 'wallGD' },
  { id: 11, name: 'wallV' },
  { id: 12, name: 'wallVR' },
  { id: 13, name: 'windowD' },
  { id: 14, name: 'windowL' },
  { id: 15, name: 'windowR' },
  { id: 16, name: 'windowU' },
];

const svgGroups = {
  doors: { name: 'Дверь', items: ['doorD', 'doorL', 'doorR', 'doorV'] },
  windows: { name: 'Окно', items: ['windowD', 'windowL', 'windowR', 'windowU'] },
  corners: { name: 'Угол', items: ['ugolLD', 'ugolLV', 'ugolRD', 'ugolRV'] },
  walls: { name: 'Стена', items: ['wallG', 'wallGD', 'wallV', 'wallVR'] },
};

const ListSVG: FC<ListSVGProps> = memo(({
  navigate,
  open,
  onClose,
  onSVGDrop,
  isSelecting,
  setIsSelecting,
  selectedCells,
  setSelectedCells,
  activeFloor,
}) => {
  const [isAddingSVG, setIsAddingSVG] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState('35%');

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const groupSVGItems = (items: SVGItem[]) => {
    const groupedItems: { [key: string]: SVGItem[] } = {};

    items.forEach(item => {
      for (const groupKey in svgGroups) {
        if (svgGroups[groupKey].items.includes(item.name)) {
          if (!groupedItems[groupKey]) {
            groupedItems[groupKey] = [];
          }
          groupedItems[groupKey].push(item);
          break;
        }
      }
    });

    return groupedItems;
  };

  const groupedSVGItems = groupSVGItems(svgItems);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, svg: SVGItem) => {
    console.log('Drag start:', svg);
    e.dataTransfer.setData('svgItem', JSON.stringify(svg));
  };

  const handleAddSVGClick = () => {
    setIsAddingSVG(!isAddingSVG);
  };

  const renderSVG = (svgName: string) => {
    const SVGComponent = lazy(() => import(`../assets/${svgName}.svg`));
    return (
      <Suspense>
        <SVGComponent />
      </Suspense>
    );
  };

  const handleSelectClick = () => {
    toast.info('Пожалуйста, выберете ячейки для комнаты и дайте ей название.');
    setIsSelecting(!isSelecting);
    setSidebarHeight(isSelecting ? '35%' : '39%'); // Изменяем высоту sidebar
  };

  const handleSaveRoom = () => {
    if (selectedCells.length === 0) {
      toast.error('Ошибка: Нужно выбрать хотя бы одну ячейку.');
      return;
    }

    const storedRooms = JSON.parse(localStorage.getItem('selectedRooms') || '[]');
    const allPositions = storedRooms.flatMap((room: { positions: number[][], activeFloor: number }) =>
      room.activeFloor === activeFloor ? room.positions : []
    );

    const hasIntersection = selectedCells.some(selectedPos =>
      allPositions.some(storedPos => storedPos[0] === selectedPos[0] && storedPos[1] === selectedPos[1])
    );

    if (hasIntersection) {
      toast.error('Ошибка: Выбранные ячейки уже заняты другой комнатой на этом этаже.');
      setRoomName('');
      setIsSelecting(false);
      setSelectedCells([]);
      return;
    }

    const newRoom = { activeFloor, roomName, positions: selectedCells };
    const updatedRooms = [...storedRooms, newRoom];
    localStorage.setItem('selectedRooms', JSON.stringify(updatedRooms));
    setRoomName('');
    setIsSelecting(false);
    setSelectedCells([]);
    setErrorMessage('');
    setSidebarHeight('35%'); // Возвращаем высоту sidebar к исходной
  };

  const closeSelecting = () => {
    setIsSelecting(false);
    setSidebarHeight('35%'); // Возвращаем высоту sidebar к исходной
  }

  if (!open) return null;

  return (
    <motion.div
      style={{ height: sidebarHeight }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className={LSCGStyle.sidebar}>
      <div className={LCStyles.buttonContainer}>
        <button onClick={onClose} className={LCStyles.closeButton} title="Закрыть"><BiX /></button>
        <div style={{ display: 'flex' }}>
        </div>
      </div>
      {<div className={LSCGStyle.tableContainer}>
        {Object.keys(groupedSVGItems).map((groupKey) => (
          <Collapsible key={groupKey} open={true} trigger={svgGroups[groupKey].name} className={LSCGStyle.collapsible}>
            {groupedSVGItems[groupKey].map((svg) => (
              <div key={svg.id} className={LSCGStyle.tableRow}>
                <td>
                  <div
                    draggable
                    className={LCStyles.cccccc}
                    onDragStart={(e) => handleDragStart(e, svg)}
                    title={svg.name}
                  >
                    {renderSVG(svg.name)}
                  </div>
                </td>
              </div>
            ))}
          </Collapsible>
        ))}
      </div>}

      <div className={LSCGStyle.roomSelectionContainer}>
        <div className={LSCGStyle.Buttons}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isSelecting ? handleSaveRoom : handleSelectClick} // Изменяем действие в зависимости от состояния
            className={isSelecting ? LSCGStyle.saveButton : LSCGStyle.selectButton} // Динамически меняем стили
          >
            {isSelecting ? "Сохранить комнату" : "Назначить комнату"} 
          </motion.button>
          {isSelecting && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeSelecting} // Изменяем действие в зависимости от состояния
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={LCStyles.closeButton}
            >
              <BiX />
            </motion.button>
          )} 
          {errorMessage && <div className={LCStyles.errorMessage}>{errorMessage}</div>}
        </div>
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <FormControl
              sx={{
                m: 1,
                width: 'auto',
                '& .MuiInput-underline:after': {
                  borderBottomColor: isFocused ? '#006c2a' : 'inherit',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isFocused ? '#006c2a' : 'inherit',
                },
                '& .MuiInputBase-input': {
                  color: isFocused ? 'black' : 'inherit',
                },
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              variant="standard"
              style={{
                alignItems: 'center',
                justifyContent: ' center',
                textAlign: 'center',
                width: '25vh'
              }}
            >
              <Input
                style={{ width: '25vh', textAlign: 'center' }}
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className={LCStyles.roomNameInput}
                placeholder='Введите название комнаты'
              />
            </FormControl>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default ListSVG;