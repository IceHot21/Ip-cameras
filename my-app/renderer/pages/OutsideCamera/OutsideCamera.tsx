import React, { FC, useState, useEffect, useCallback } from 'react';
import { BsLayoutTextWindow, BsWrenchAdjustable } from "react-icons/bs";
import OStyles from './OutsideCamera.module.css';
import Grid from '../../components/Grid';
import Outside from '../../components/Outside';
import ListCamera from '../../components/ListCamera';
import ModalStream from '../../components/ModalStream';
import { useRouter } from 'next/router';

interface Prediction {
    id: number;
    camera_port: number;
    item_predict: string;
    score_predict: string;
    date: string;
    bbox: number[];
}

interface Camera {
    id: number;
    port: number;
    name: string;
    address: string;
    floor: number;
    cell: string;
    initialPosition: { rowIndex: number; colIndex: number };
    rtspUrl: string;
    isDisabled: boolean;
    rotationAngle: number;
}

interface SVGItem {
    id: number;
    name: string;
}

interface OutsideProps {
    navigate: (path: string) => Promise<boolean>;
}

const OutsideCamera: FC<OutsideProps> = ({ navigate }) => {
    const [isListCameraOpen, setIsListCameraOpen] = useState(false);
    const [isListSVGOpen, setIsListSVGOpen] = useState(false);
    const [isGridOpen, setIsGridOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera }>({});
    const [droppedSVGs, setDroppedSVGs] = useState<{ [key: string]: SVGItem }>({});
    const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
    const [isModalStreamOpen, setIsModalStreamOpen] = useState(false);
    const [FlagLocal, setFlagLocal] = useState(true);
    const [movedCameras, setMovedCameras] = useState<Set<number>>(new Set());
    const [rotationAngles, setRotationAngles] = useState<{ [key: string]: number }>({});
    const router = useRouter();
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedCells, setSelectedCells] = useState<number[][]>([]);
    const [isPredictions, setIsPredictions] = useState<Prediction | null>(null)
    const [width, setWidth] = useState("928px");
    const [height, setHeight] = useState("690px");
    const [coordinates, setCoordinates] = useState("59.850491,30.305657");


    const [handleParametrEditing, setHandleParametrEditing] = useState("grid");


    useEffect(() => {
        const storedCameras = localStorage.getItem('droppedCameras');
        const storedSVGs = localStorage.getItem('droppedSVGs');
        if (storedCameras) {
            setDroppedCameras(JSON.parse(storedCameras));
        }
        if (storedSVGs) {
            setDroppedSVGs(JSON.parse(storedSVGs));
        }
        const storedCoordinates = localStorage.getItem('Coordinates');
        setCoordinates(storedCoordinates || "59.850491,30.305657");
    }, []);

    useEffect(() => {
        if (Object.keys(droppedCameras).length > 0) {
            localStorage.setItem('droppedCameras', JSON.stringify(droppedCameras));
        }
    }, [droppedCameras]);

    useEffect(() => {
        if (Object.keys(droppedSVGs).length > 0) {
            localStorage.setItem('droppedSVGs', JSON.stringify(droppedSVGs));
        }
    }, [droppedSVGs]);

    useEffect(() => {
        setIsEditing(isListCameraOpen || isListSVGOpen);
    }, [isListCameraOpen, isListSVGOpen]);

    useEffect(() => {
        if (FlagLocal) {
            setIsModalStreamOpen(true);
        }
    }, [FlagLocal]);

    const handleListCameraToggle = useCallback(() => {
        setIsListCameraOpen(!isListCameraOpen);
    }, [isListCameraOpen]);

    const handleListSVGToggle = useCallback(() => {
        setIsListSVGOpen(!isListSVGOpen);
    }, [isListSVGOpen]);

    const handleGridOpen = useCallback(() => {
        setIsGridOpen((prev) => !prev);
        setIsEditing(!isGridOpen);
    }, [isGridOpen]);

    const handleCameraDrop = useCallback((camera: Camera, rowIndex: number, colIndex: number) => {
        const cellKey = `$${rowIndex}-${colIndex}`;
        const updatedCamera: Camera = {
            ...camera,
            cell: cellKey,
            initialPosition: { rowIndex, colIndex },
        };
        setDroppedCameras((prev) => ({ ...prev, [cellKey]: updatedCamera }));
        setMovedCameras((prev) => new Set(prev).add(camera.id));
    }, [setDroppedCameras, setMovedCameras]);

    const handleSVGDrop = useCallback((svg: SVGItem, rowIndex: number, colIndex: number) => {
        const cellKey = `$${rowIndex}-${colIndex}`;
        setDroppedSVGs((prev) => ({ ...prev, [cellKey]: svg }));
    }, [setDroppedSVGs]);

    const handleDoubleClickCamera = useCallback((camera: Camera) => {
        setSelectedCameras([camera]);
        setIsModalStreamOpen(true);
    }, []);

    let gridContainerStyles = handleParametrEditing === 'grid'
    ? { height: '100% !important' }
    : { zIndex: '-1' };

    return (
        <div>
            <div className={OStyles.listContainer}>
                <div className={OStyles.listButton}>
                    <h1 className={OStyles.listLabel}>Улица </h1>
                </div>
                <BsLayoutTextWindow
                    className={`${OStyles.listIcon} ${OStyles.topRightIcon}`}
                    onClick={handleListCameraToggle}
                    title="Открыть список камер"
                />

            </div>
            {isListCameraOpen && (
                <ListCamera
                    navigate={navigate}
                    open={isListCameraOpen}
                    onClose={() => setIsListCameraOpen(false)}
                    FlagLocal={() => setFlagLocal(prev => !prev)}
                    onDoubleClickCamera={handleDoubleClickCamera}
                    movedCameras={movedCameras}
                    droppedCameras={droppedCameras}
                    handleParametrEditing={handleParametrEditing}
                    setHandleParametrEditing={setHandleParametrEditing}
                />
            )}
            <div className={OStyles.OutsideContainer}>
                <div className={OStyles.inactiveOutside}>
                    <div>
                        <Outside
                            navigate={navigate}
                            children={null}
                            onCameraDropped={handleCameraDrop}
                            droppedCameras={droppedCameras}
                            onDoubleClickCamera={handleDoubleClickCamera}
                            FlagLocal={() => setFlagLocal(prev => !prev)}
                            rotationAngles={rotationAngles}
                            activeFloor={-1}
                            setRotationAngles={setRotationAngles}
                            isActive={true}
                            width={width}
                            height={height}
                            coordinates={coordinates}
                            handleParametrEditing={handleParametrEditing}
                            setCoordinates={setCoordinates}
                        />
                    </div>

                </div>
                {isEditing && (
                    <div className={OStyles.gridContainer} style={gridContainerStyles}>
                        <Grid
                            navigate={navigate}
                            isSelecting={isSelecting}
                            onCameraDrop={handleCameraDrop}
                            onSVGDrop={handleSVGDrop}
                            droppedCameras={droppedCameras}
                            droppedSVGs={droppedSVGs}
                            activeFloor={-1}
                            onDoubleClickCamera={handleDoubleClickCamera}
                            FlagLocal={() => setFlagLocal(prev => !prev)}
                            rotationAngles={rotationAngles}
                            setRotationAngles={setRotationAngles}
                            selectedCells={selectedCells}
                            setSelectedCells={setSelectedCells}
                            setDroppedSVGs={setDroppedSVGs}
                            setDroppedCameras={setDroppedCameras} setRoomCenters={function (value: React.SetStateAction<{ [key: string]: { x: number; y: number; }; }>): void {
                                throw new Error('Function not implemented.');
                            } } setRoomNames={undefined}                        />
                    </div>
                )}
            </div>
            {
                isModalStreamOpen && (
                    <ModalStream
                        navigate={navigate}
                        selectedCameras={selectedCameras}
                        setCam={setSelectedCameras}
                        onClose={() => setIsModalStreamOpen(false)}
                        isPredictions={isPredictions}
                    />
                )
            }
        </div >
    );
};

export default OutsideCamera;