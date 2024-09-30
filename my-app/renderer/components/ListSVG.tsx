import React, { FC, useState, lazy, Suspense, memo } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BiX, BiSolidLayerPlus } from "react-icons/bi";
import { FaCheck } from 'react-icons/fa';
import LSCGStyle from '../styles/ListSVG.module.css';
import { motion } from 'framer-motion';

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
  activeFloor
}) => {
  const [isAddingSVG, setIsAddingSVG] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');
    setIsSelecting(!isSelecting);
  };

  const handleSaveRoom = () => {
    const storedRooms = JSON.parse(localStorage.getItem('selectedRooms') || '[]');
    const allPositions = storedRooms.flatMap((room: { positions: number[][], activeFloor: number }) =>
      room.activeFloor === activeFloor ? room.positions : []
    );

    const hasIntersection = selectedCells.some(selectedPos =>
      allPositions.some(storedPos => storedPos[0] === selectedPos[0] && storedPos[1] === selectedPos[1])
    );

    if (hasIntersection) {
      setErrorMessage('Ошибка: Выбранные ячейки уже заняты другой комнатой на этом этаже.');
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
  };

  if (!open) return null;

  return (
    <motion.div 
    style={{height: '100% !important'}}
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

<div className={LCStyles.roomSelectionContainer}>
          <input
            type="text"
            placeholder="Название комнаты"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className={LCStyles.roomNameInput}
          />
          <button onClick={handleSelectClick} className={LCStyles.selectButton}>
            {isSelecting ? <FaCheck title="Сохранить комнату" /> : "Выбрать"}
          </button>
          {isSelecting && (
            <button onClick={handleSaveRoom} className={LCStyles.saveButton}>
              Сохранить комнату
            </button>
          )}
          {errorMessage && <div className={LCStyles.errorMessage}>{errorMessage}</div>}
        </div>
      <div className={LCStyles.tableContainer}>
        <table>
          <thead className={LCStyles.tableHeader}>
            <tr>
              <th>Название</th>
              <th>SVG</th>
            </tr>
          </thead>
          <tbody className={LCStyles.tableBody}>
            {Object.keys(groupedSVGItems).map((groupKey) => (
              <React.Fragment key={groupKey}>
                {groupedSVGItems[groupKey].map((svg, index) => (
                  <tr key={svg.id} className={LCStyles.tableRow}>
                    <td>{index === 0 ? svgGroups[groupKey].name : ''}</td> {/* Отображаем категорию только для первого элемента */}
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
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        
      </div>
    </motion.div>
  );
});

export default ListSVG;
