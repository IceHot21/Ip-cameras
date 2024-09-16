/* import React, { FC, useState, useEffect } from 'react';
import LOStyles from '../styles/ListObject.module.css';
import MySVG1 from '../assets/wall-goriz.svg';
import MySVG2 from '../assets/wall-vert.svg';

interface SVGElement {
  id: number;
  name: string;
  svgComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

const svgElements: SVGElement[] = [
  { id: 1, name: 'SVG 1', svgComponent: MySVG1 },
  { id: 2, name: 'SVG 2', svgComponent: MySVG2 },
];

interface ListObjectProps {
  onObjectDrop: (object: SVGElement, rowIndex: number, colIndex: number) => void;
  droppedObjects: { [key: string]: SVGElement };
  activeFloor: number;
  FlagLocal: () => void;
}

const ListObject: FC<ListObjectProps> = ({
  onObjectDrop,
  droppedObjects,
  activeFloor,
  FlagLocal,
}) => {
  const [selectedObjects, setSelectedObjects] = useState<SVGElement[]>([]);

  useEffect(() => {
    if (selectedObjects) {
      FlagLocal();
    }
  }, [selectedObjects]);

  const handleDoubleClick = (object: SVGElement) => {
    if (!selectedObjects.some(o => o.id === object.id)) {
      setSelectedObjects([object]);
      FlagLocal();
    } else {
      setSelectedObjects([]);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, object: SVGElement) => {
    e.dataTransfer.setData('droppedObject', JSON.stringify(object));
  };

  return (
    <div className={LOStyles.sidebar}>
      <div className={LOStyles.tableContainer}>
        <table>
          <thead className={LOStyles.tableHeader}>
            <tr>
              <th>Название SVG</th>
              <th>SVG</th>
              <th></th>
            </tr>
          </thead>
          <tbody className={LOStyles.tableBody}>
            {svgElements.map((object) => {
              const isDisabled = Object.values(droppedObjects).some(droppedObject => droppedObject.id === object.id);

              return (
                <tr
                  key={object.id}
                  onDoubleClick={() => handleDoubleClick(object)}
                  className={isDisabled ? `${LOStyles.tableRow} ${LOStyles.disabledRow}` : LOStyles.tableRow}
                >
                  <td>{object.name}</td>
                  <td>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, object)} // Add drag functionality
                    >
                      <object.svgComponent className={LOStyles.svgIcon} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListObject;
 */