import React, { FC, lazy, Suspense, useEffect, useState, useCallback } from 'react';
import RStyles from '../styles/Floor.module.css';
import GStyles from '../styles/Grid.module.css';
import { useContextMenu, ItemParams, Menu, Item } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";
import { BsFillCameraVideoFill } from 'react-icons/bs';
import SVGOUT from '../assets/SVGOUT.svg';
import YandexMap from './YandexMap';
import zIndex from '@mui/material/styles/zIndex';

interface Camera {
    id: number;
    port: number;
    name: string;
    address: string;
    cell?: string;
    initialPosition?: { rowIndex: number; colIndex: number };
    rtspUrl: string;
}

interface SVGItem {
    id: number;
    name: string;
}

type OutsideProps = {
    navigate: (path: string) => Promise<boolean>;
    children: React.ReactNode;
    onCameraDropped: (camera: Camera, rowIndex: number, colIndex: number) => void;
    droppedCameras: { [key: string]: Camera };
    onDoubleClickCamera: (camera: Camera) => void;
    FlagLocal: () => void;
    rotationAngles: { [key: string]: number };
    setRotationAngles: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    isActive: boolean;
    activeFloor: number;
    width: string;
    height: string;
    coordinates: string;
    handleParametrEditing: string;
    setCoordinates: React.Dispatch<React.SetStateAction<string>>;
};

const Outside: FC<OutsideProps> = ({ children, droppedCameras, navigate, onDoubleClickCamera, activeFloor, FlagLocal, rotationAngles, setRotationAngles, isActive, width, height, coordinates, handleParametrEditing, setCoordinates }) => {
    const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
    const menuClick = "Меню";
    const { show } = useContextMenu({ id: menuClick });

    useEffect(() => {
        if (selectedCameras) {
            FlagLocal();
        }
    }, [selectedCameras]);

    useEffect(() => {
        const savedDroppedCameras = localStorage.getItem('droppedCameras');

        if (savedDroppedCameras) {
            const parsedDroppedCameras = JSON.parse(savedDroppedCameras);
            const initialRotationAngles: { [key: string]: number } = {};

            Object.keys(parsedDroppedCameras).forEach((cameraKey) => {
                const camera = parsedDroppedCameras[cameraKey];
                if (camera.rotationAngle !== undefined) {
                    const cameraId = `Камера ${camera.name.split(/[^a-zA-Z0-9]/)[0]}`;
                    initialRotationAngles[cameraId] = camera.rotationAngle;
                }
            });

            // Устанавливаем начальные углы поворота в состояние
            setRotationAngles(initialRotationAngles);
        }
    }, []);

    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, item: Camera) => {
        e.dataTransfer.setData('droppedItem', JSON.stringify(item));
    }, []);

    const renderSVG = useCallback((svgName: string) => {
        const SVGComponent = lazy(() => import(`../assets/${svgName}.svg`));
        return (
            <Suspense>
                <SVGComponent />
            </Suspense>
        );
    }, []);

    const displayMenu = useCallback((e: React.MouseEvent<HTMLDivElement>, cameraId: string, svgKey?: string) => {
        e.preventDefault();
        show({ event: e, props: { cameraId, svgKey } });
    }, [show]);

    const handleItemClick = useCallback(({ id, event, props }: ItemParams<any, any>) => {
        const cameraId = props.cameraId;
        if (id === "rotateLeft" || id === "rotateRight") {
            setRotationAngles((prevAngles) => ({
                ...prevAngles,
                [cameraId]: id === "rotateLeft" ? (prevAngles[cameraId] || 0) + 45 : (prevAngles[cameraId] || 0) - 45,
            }));
        }
    }, [setRotationAngles]);

    const handleDoubleClick = useCallback((camera: Camera) => {
        if (!selectedCameras.some(c => c.id === camera.id)) {
            setSelectedCameras([camera]);
            onDoubleClickCamera(camera);
            FlagLocal();
        } else {
            setSelectedCameras([]);
        }
    }, [selectedCameras, onDoubleClickCamera, FlagLocal]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, rowIndex: number, colIndex: number) => {
        e.preventDefault();
        const itemDataCamera = e.dataTransfer.getData('droppedItem');

        if (itemDataCamera) {
            const item: Camera = JSON.parse(itemDataCamera);

            if ('port' in item) {
                // Это камера
                const camera = item as Camera;
                const port = camera.port;
                const cameraName = camera.name;
                const ipAddress = camera.rtspUrl;
                const rtspUrl = `rtsp://admin:Dd7560848@${ipAddress}`;
                const newCellKey = `${rowIndex}-${colIndex}`;

                const existingCameraKey = Object.keys(droppedCameras).find(key => droppedCameras[key].name === cameraName);
                if (existingCameraKey) {
                    if (existingCameraKey !== newCellKey) {
                        delete droppedCameras[existingCameraKey];
                    }
                }

                const newCamera: Camera = {
                    id: Object.keys(droppedCameras).length + 1,
                    port,
                    rtspUrl,
                    name: cameraName,
                    cell: newCellKey,
                    initialPosition: { rowIndex, colIndex },
                    address: camera.address,
                };

                droppedCameras[newCellKey] = newCamera;
                camera.initialPosition = { rowIndex, colIndex };
            }
        }
    }, [droppedCameras]);

    const handleWidthChange = (e) => {
        const newWidth = e.target.value;
        const [lat, lng] = coordinates.split(',');
        const newCoordinates = `${newWidth},${lng}`;
        setCoordinates(newCoordinates);
        localStorage.setItem('Coordinates', newCoordinates);
    };

    const handleHeightChange = (e) => {
        const newHeight = e.target.value;
        const [lat, lng] = coordinates.split(',');
        const newCoordinates = `${lat},${newHeight}`;
        setCoordinates(newCoordinates);
        localStorage.setItem('Coordinates', newCoordinates);
    };

    return (
        <div className={RStyles.body}>
            <div className={RStyles.container}>
                <div>
                    {/* <SVGOUT className={RStyles.fonContainer} /> */}
                    <YandexMap width={width} height={height} coordinates={coordinates} handleParametrEditing={handleParametrEditing} />
                    {handleParametrEditing === 'map' && (
                        <div className={RStyles.inputCoordinatesContainer}>
                            <h4>Координаты высоты:</h4>
                            <input type='number' value={coordinates.split(',')[0]} onChange={handleWidthChange} />
                            <h4>Координаты ширины:</h4>
                            <input type='number' value={coordinates.split(',')[1]} onChange={handleHeightChange}/>
                        </div>
                    )}

                    <div className={RStyles.gridContainer}>
                        <div className={GStyles.grid}>
                            {Array.from({ length: 15 }).map((_, rowIndex) =>
                                Array.from({ length: 20 }).map((_, colIndex) => {
                                    const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
                                    const camera = droppedCameras[cellKey];
                                    const cameraId = camera ? `Камера ${camera.name}` : '';
                                    const rotationAngle = rotationAngles[cameraId] || 0;
                                    return (
                                        <div
                                            key={cellKey}
                                            id={cellKey}
                                            className={`${GStyles.gridCell} ${RStyles.transparentCell}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                                        >
                                            {camera && (
                                                <div
                                                    className={GStyles.cameraIcon}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, camera)}
                                                    onDoubleClick={() => handleDoubleClick(camera)}
                                                    id={cameraId}
                                                    title={cameraId}
                                                    onContextMenu={(e) => displayMenu(e, cameraId)}
                                                >
                                                    <BsFillCameraVideoFill style={{ transform: `rotate(${rotationAngle}deg)`, height: '50%', width: '100%', zIndex: 999999 }} />
                                                    <div
                                                        className={RStyles.cameraViewSector}
                                                        style={{
                                                            transform: `rotate(${rotationAngle}deg)`,
                                                            clipPath: `polygon(50% 50%, 100% 0%, 100% 100%)`,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                {children}
            </div>
            <Menu id={menuClick}>
                <Item id="rotateLeft" onClick={handleItemClick}>Повернуть влево</Item>
                <Item id="rotateRight" onClick={handleItemClick}>Повернуть вправо</Item>
            </Menu>
        </div>
    );
};
export default Outside;