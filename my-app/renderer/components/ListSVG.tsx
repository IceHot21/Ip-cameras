import React, { FC, useState, lazy, Suspense } from 'react';
import LCStyles from '../styles/ListCamera.module.css';
import { BiX, BiRevision, BiSolidLayerPlus } from "react-icons/bi";
import { FaCheck } from 'react-icons/fa';

interface SVGItem {
  id: number;
  name: string;
}

interface ListSVGProps {
  open: boolean;
  onClose: () => void;
  onGridOpen: () => void;
  onSVGDrop: (svg: SVGItem) => void;
}

const svgItems: SVGItem[] = [
  { id: 1, name: 'doorL'},
  { id: 2, name: 'doorR'},
  { id: 3, name: 'ugolLV'},
  { id: 4, name: 'wallG'},
  { id: 5, name: 'wallV'},
  { id: 6, name: 'window'},
];

const ListSVG: FC<ListSVGProps> = ({
  open,
  onClose,
  onGridOpen,
  onSVGDrop,
}) => {
  const [isAddingSVG, setIsAddingSVG] = useState(false);

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
      <Suspense >
        <SVGComponent />
      </Suspense>
    );
  };

  if (!open) return null;

  return (
    <div className={LCStyles.sidebar}>
      <div className={LCStyles.buttonContainer}>
        <button onClick={onClose} className={LCStyles.closeButton} title="Закрыть"><BiX /></button>
        <div style={{ display: 'flex' }}>
          <button onClick={handleAddSVGClick} className={LCStyles.plusButton} >
            {isAddingSVG ? <FaCheck title="Сохранить SVG" /> : <BiSolidLayerPlus title="Добавить SVG" />}
          </button>
        </div>
      </div>
      <div className={LCStyles.tableContainer}>
        <table>
          <thead className={LCStyles.tableHeader}>
            <tr>
              <th>Название SVG</th>
              <th></th>
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
      </div>
    </div>
  );
};

export default ListSVG;