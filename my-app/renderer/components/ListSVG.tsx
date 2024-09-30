import React, { FC, useState, lazy, Suspense } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BiX, BiSolidLayerPlus } from "react-icons/bi";
import { FaCheck } from 'react-icons/fa';

interface SVGItem {
  id: number;
  name: string;
}

interface ListSVGProps {
  navigate: (path: string) => Promise<boolean>;
  open: boolean;
  onClose: () => void;
  onGridOpen: () => void;
  activeFloor: number;
  onSVGDrop: (svg: SVGItem) => void;
  isSelecting: boolean; // Добавляем пропс isSelecting
  selectedCells: number[][];
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>; // Добавляем пропс setIsSelecting
  setSelectedCells: React.Dispatch<React.SetStateAction<number[][]>>;
}

const svgItems: SVGItem[] = [
  { id: 1, name: 'doorD'},
  { id: 2, name: 'doorL'},
  { id: 3, name: 'doorR'},
  { id: 4, name: 'doorV'},
  { id: 5, name: 'ugolLD'},
  { id: 6, name: 'ugolLV'},
  { id: 7, name: 'ugolRD'},
  { id: 8, name: 'ugolRV'},
  { id: 9, name: 'wallG'},
  { id: 10, name: 'wallGD'},
  { id: 11, name: 'wallV'},
  { id: 12, name: 'wallVR'},
  { id: 13, name: 'windowD'},
  { id: 14, name: 'windowL'},
  { id: 15, name: 'windowR'},
  { id: 16, name: 'windowU'},
];

const ListSVG: FC<ListSVGProps> = ({
  navigate,
  open,
  onClose,
  onGridOpen,
  onSVGDrop,
  isSelecting, // Добавляем пропс isSelecting
  setIsSelecting, // Добавляем пропс setIsSelecting
  selectedCells,
  setSelectedCells,
  activeFloor
}) => {
  const [isAddingSVG, setIsAddingSVG] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, svg: SVGItem) => {
    console.log('Drag start1:', svg);
    e.dataTransfer.setData('svgItem', JSON.stringify(svg));
  };

  const handleAddSVGClick = () => {
    setIsAddingSVG(!isAddingSVG);
    onGridOpen();
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
  
    // Проверка на пересечение ячеек на текущем этаже
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
    setSelectedCells([]); // Очищаем selectedCells после сохранения
    setErrorMessage(''); // Очищаем сообщение об ошибке
  };

  if (!open) return null;

  return (
    <div className={LCStyles.sidebar}>
      <div className={LCStyles.buttonContainer}>
        <button onClick={onClose} className={LCStyles.closeButton} title="Закрыть"><BiX /></button>
        <div style={{ display: 'flex' }}>
          <button onClick={handleAddSVGClick} className={LCStyles.plusButton}>
            {isAddingSVG ? <FaCheck title="Сохранить SVG" /> : <BiSolidLayerPlus title="Добавить SVG" />}
          </button>
        </div>
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
            {svgItems.map((svg) => (
              <tr
                key={svg.id}
                className={LCStyles.tableRow}
              >
                <td>{svg.name}</td>
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
          </tbody>
        </table>
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
      </div>
    </div>
  );
};

export default ListSVG;