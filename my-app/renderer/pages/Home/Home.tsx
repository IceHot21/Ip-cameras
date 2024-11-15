import React, { FC, useMemo, useState, useEffect, memo, useCallback } from "react";
import HStyles from "./Home.module.css";
import Svg1 from "../../assets/Svg1.svg";
import Svg2 from '../../assets/Svg2.svg';
import Svg3 from '../../assets/Svg3.svg';
import { useRouter } from "next/router";
import Build123 from '../../assets/Build123.svg'
import { FaBell, FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Floor from '../../components/Floor';
import { fetchWithRetry } from "../../refreshToken";
import ModalWindow from "../../components/ModalWindow";
import axios from "axios";
import Outside from "../../components/Outside";
import ModalStream from "../../components/ModalStream";
import { GiClick } from "react-icons/gi";

interface HomeProps {
  numberHome: number;
  navigate: (path: string) => Promise<boolean>;
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

interface Room {
  activeFloor: number;
  roomName: string;
  positions: Array<number[]>;
}

interface Prediction {
  id: number;
  camera_port: number;
  item_predict: string;
  score_predict: string;
  bbox: string;
  date: string;
}

interface RoomInfo {
  activeFloor: number;
  roomName: string;
}

interface SVGItem {
  id: number;
  name: string;
}

const MemoizedModalStream = memo(ModalStream);
const MemoizedFloor = memo(Floor);

const Home: FC<HomeProps> = ({ numberHome, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSvgIndex, setCurrentSvgIndex] = useState(0);
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera }>({});
  const [rotationAngles, setRotationAngles] = useState<{ [key: string]: number }>({});
  const [onCameraDropped, setOnCameraDropped] = useState<{ [key: string]: Camera }>({});
  const [droppedSVGs, setDroppedSVGs] = useState<{ [key: string]: SVGItem }>({});
  const [roomInfoMap, setRoomInfoMap] = useState<{ [port: number]: RoomInfo }>({});
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'inside' | 'outside'>('inside');
  const [width, setWidth] = useState("676px");
  const [height, setHeight] = useState("494px");
  const [coordinates, setCoordinates] = useState("59.850491,30.305657");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [predictionsData, setPredictionsData] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [FlagLocal, setFlagLocal] = useState(false);
  const router = useRouter();
  const { floor } = router.query;
  const [activeFloor, setActiveFloor] = useState<number>(0);
  const [isModalStreamOpen, setIsModalStreamOpen] = useState(true);
  const [cameraForModalStream, setCameraForModalStream] = useState<any>(null);
  const [aboba, setAboba] = useState(false);
  const [isPredictions, setIsPredictions] = useState<Prediction | null>(null);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);

  const [roomNames, setRoomNames] = useState<{ [key: string]: string }>({});
  const [roomCenters, setRoomCenters] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [savedCells, setSavedCells] = useState<number[][]>([]);
  const memoizedFlagLocalToggle = useCallback(() => setFlagLocal(prev => !prev), []);

  const floorProps = useMemo(() => ({
    navigate,
    children: null,
    onCameraDropped: () => { },
    droppedCameras,
    activeFloor: currentSvgIndex,
    onFloorChange: setCurrentSvgIndex,
    onDoubleClickCamera: () => { },
    FlagLocal: () => { },
    rotationAngles: {},
    setRotationAngles: () => { },
    droppedSVGs,
    onSVGDrop: () => { },
    floorIndex: currentSvgIndex,
    isActive: true,
    setDroppedSVGs,
    setIsModalStreamOpen,
    setCameraForModalStream,
    setAboba,
  }), [
    navigate,
    droppedCameras,
    currentSvgIndex,
    setCurrentSvgIndex,
    droppedSVGs,
    setDroppedSVGs,
  ]);

  const findCellByPort = (port: number): RoomInfo | null => {
    const savedDroppedCameras = localStorage.getItem('droppedCameras');
    if (!savedDroppedCameras) {
      return null;
    }
    const parsedDroppedCameras: { [key: string]: Camera } = JSON.parse(savedDroppedCameras);
    const camera = Object.values(parsedDroppedCameras).find(camera => Number(camera.port) === port);
    if (!camera) {
      return null;
    }
    const selectedRoom = localStorage.getItem('selectedRooms');
    const parsedSelectedRoom = JSON.parse(selectedRoom);
    const roomName = findRoomName(parsedSelectedRoom, camera.cell);
    return roomName;
  }

  const findRoomName = (rooms: Room[], data: string): RoomInfo | null => {
    const [floor, row, col] = data.split('-').map(Number);
    const filteredRooms = rooms.filter(room => room.activeFloor === floor);
    for (const room of filteredRooms) {
      const positionExists = room.positions.some(position => position[0] === row && position[1] === col);
      if (positionExists) {
        return { activeFloor: room.activeFloor, roomName: room.roomName };
      }
    }
    return null;
  }

  function replaceEnglishWords(initialPredictions) {
    const translations = {
      "person": "человек",
      "tv": "экран",
      "suitcase": "чемодан"
    };

    return initialPredictions.map(item => {
      if (item.item_predict && translations[item.item_predict]) {
        item.item_predict = translations[item.item_predict];
      }
      return item;
    });
  }

  useEffect(() => {
    if (floor) {
      setActiveFloor(Number(floor));
    }
  }, [floor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithRetry('https://192.168.0.152:4200/prediction/eventlist', 'GET', null, '/Home/Home');
        const initialPredictions = response.slice(0, 100);

        replaceEnglishWords(initialPredictions)
        setPredictions(initialPredictions);

        const uniquePorts = [...new Set(initialPredictions.map(event => event.camera_port))];

        const roomInfoMap: { [port: number]: RoomInfo } = {};
        uniquePorts.forEach(port => {
          //@ts-ignore
          const roomInfo = findCellByPort(port);
          if (roomInfo) {
            //@ts-ignore
            roomInfoMap[port] = roomInfo;
          }
        });
        setRoomInfoMap(roomInfoMap);
      } catch (e) {
        console.error('Error show eventlist:', e);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.0.152:9999');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onmessage = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newPrediction = JSON.parse(reader.result as string);
        setPredictions(prevPredictions => {
          const updatedPredictions = [newPrediction, ...prevPredictions];
          if (updatedPredictions.length > 100) {
            updatedPredictions.pop();
          }
          return updatedPredictions;
        });
        setIsPredictions(newPrediction)

        const roomInfo = findCellByPort(newPrediction.camera_port);
        if (roomInfo) {
          setRoomInfoMap(prevRoomInfoMap => ({
            ...prevRoomInfoMap,
            [newPrediction.camera_port]: roomInfo,
          }));
        }
      };
      reader.readAsText(event.data);
    };

    setWs(socket);

    return () => {
      socket.close();
    };

  }, []);

  useEffect(() => {
    console.log(FlagLocal)
  }, [FlagLocal]);

  const svgImages = [Svg1, Svg2, Svg3];
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numberHome);
  };

  useEffect(() => {
    const storedCameras = localStorage.getItem('droppedCameras');
    const storedSVGs = localStorage.getItem('droppedSVGs');
    if (storedCameras) {
      setDroppedCameras(JSON.parse(storedCameras));
    }
    if (storedSVGs) {
      setDroppedSVGs(JSON.parse(storedSVGs));
    }
  }, []);

  useEffect(() => {
    if (FlagLocal) {
      setIsModalStreamOpen(true);
    }
  }, [FlagLocal]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numberHome) % numberHome);
  };

  const nextFloor = () => {
    setCurrentSvgIndex((prevSvgIndex) => (prevSvgIndex + 1) % svgImages.length);
    setActiveFloor((prevFloor) => (prevFloor + 1) % svgImages.length);
  };

  const prevFloor = () => {
    setCurrentSvgIndex((prevSvgIndex) => (prevSvgIndex - 1 + svgImages.length) % svgImages.length);
    setActiveFloor((prevFloor) => (prevFloor - 1 + svgImages.length) % svgImages.length);
  };

  const getSlideClass = (index: number) => {
    if (index === currentIndex) {
      return HStyles.active;
    }
    if (index === (currentIndex - 1 + numberHome) % numberHome) {
      return `${HStyles.nearby} ${HStyles.prev}`;
    }
    if (index === (currentIndex + 1) % numberHome) {
      return `${HStyles.nearby} ${HStyles.next}`;
    }
    return HStyles.hidden;
  };

  const formatTime = (timeInMilliseconds: number) => {
    const date = new Date(Number(timeInMilliseconds));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  const openModal = (imageUrl: string, predictions: any[]) => {
    setModalImageUrl(imageUrl);
    setPredictionsData(predictions);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPredictionsData([]);
    setModalImageUrl('');
  };

  const renderTableRows = useMemo(() => {
    return predictions
      .filter(event => selectedFloor === null || roomInfoMap[event.camera_port]?.activeFloor === selectedFloor)
      .map((event, index) => {
        const roomInfo = roomInfoMap[event.camera_port] || { activeFloor: 'Неизвестно', roomName: 'Неизвестно' };
        //@ts-ignore
        const eventDate = formatTime(event.date);

        const handleDoubleClick = async () => {
          try {
            // const response = await fetchWithRetry(`https://192.168.0.152:4200/prediction/screens/${event.date}`, 'GET', null, '/Home/Home');
            const response = await axios.get(`https://192.168.0.152:4200/prediction/screens/${event.camera_port}-${event.date}`, {
              responseType: 'blob',
              withCredentials: true,
            });
            const blob = new Blob([response.data]);
            const imageUrl = URL.createObjectURL(blob);
            // saveAs(blob, `frame-${event.date}.png`);
            // openModal(response); // Передаем URL в модальное окно
            console.log('File downloaded successfully', response);
            openModal(imageUrl, [event.item_predict, event.score_predict, event.bbox]);

          } catch (error) {
            console.error('Error downloading file:', error);
          }
        };

        const translations = {
          "person": "человек",
          "tv": "экран",
          "suitcase": "чемодан",
          'chair': 'стул',
          'dining table': 'рабочее место',
        };
        function getTranslatedEventString(event) {
          if ((Number(event.score_predict?.slice(0, 6)) * 100) > 80) {
            const translatedItem = translations[event.item_predict] || event.item_predict;
            const probability = (Number(event.score_predict.slice(0, 6)) * 100).toFixed(2);
            return (
              <tr key={index}>
                <td>{eventDate}</td>
                <td>Здание №1</td>
                <td>Этаж {Number(roomInfo.activeFloor) + 1}</td>
                <td>{roomInfo.roomName}</td>
                <td onClick={handleDoubleClick} style={{ cursor: 'pointer' }}>{`Обнаружен ${translatedItem} с вероятностью ${probability}%`}</td>
              </tr>
            )
          }
          else {
            return;
          }
        }

        return (
          getTranslatedEventString(event)
        );
      });
  }, [predictions, roomInfoMap, selectedFloor]);

  const floorOptions = useMemo(() => {
    return Array.from({ length: svgImages.length }, (_, index) => (
      <option key={index} value={index}>{index + 1}</option>
    ));
  }, [svgImages.length]);

  const handleFloorChange1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedFloor(selectedValue === '' ? null : Number(selectedValue));
  };

  const handleFloorChange = useCallback((floor: number) => {
    setActiveFloor(floor);
    setCurrentSvgIndex(floor);
  }, []);

  const handleSVGDrop = useCallback((svg: SVGItem, rowIndex: number, colIndex: number) => {
    const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
    setDroppedSVGs((prev) => ({ ...prev, [cellKey]: svg }));
  }, [activeFloor]);

  const handleLeftClick = useCallback(() => {
    setActiveFloor((prevFloor) => (prevFloor - 1 + svgImages.length) % svgImages.length);
    setCurrentSvgIndex((prevSvgIndex) => (prevSvgIndex - 1 + svgImages.length) % svgImages.length);
  }, [svgImages.length]);

  const handleRightClick = useCallback(() => {
    setActiveFloor((prevFloor) => (prevFloor + 1) % svgImages.length);
    setCurrentSvgIndex((prevSvgIndex) => (prevSvgIndex + 1) % svgImages.length);
  }, [svgImages.length]);

  const handleDoubleClickCamera = useCallback((camera: Camera) => {
    setSelectedCameras([camera]);
    setIsModalStreamOpen(true);
  }, []);

  const handleCameraDrop = useCallback((camera: Camera, rowIndex: number, colIndex: number) => {
    const cellKey = `${activeFloor}-${rowIndex}-${colIndex}`;
    const updatedCamera: Camera = {
      ...camera,
      floor: activeFloor,
      cell: cellKey,
      initialPosition: { rowIndex, colIndex },
    };
    setDroppedCameras((prev) => ({ ...prev, [cellKey]: updatedCamera }));
  }, [activeFloor]);

  const memoizedDroppedCameras = useMemo(() => droppedCameras, [droppedCameras]);
  const memoizedDroppedSVGs = useMemo(() => droppedSVGs, [droppedSVGs]);
  const memoizedRotationAngles = useMemo(() => rotationAngles, [rotationAngles]);
  const memoizedSelectedCells = useMemo(() => selectedCells, [selectedCells]);

  const planContainer = useMemo(() => (
    <div className={HStyles.planContainer}>
      {activeTab === 'inside' && (
        <div className={HStyles.planInside}>
          <div className={HStyles.plan}>
            <MemoizedFloor
              navigate={navigate}
              children={null}
              onCameraDropped={handleCameraDrop}
              droppedCameras={memoizedDroppedCameras}
              activeFloor={activeFloor}
              onFloorChange={handleFloorChange}
              onDoubleClickCamera={handleDoubleClickCamera}
              FlagLocal={memoizedFlagLocalToggle}
              rotationAngles={memoizedRotationAngles}
              setRotationAngles={setRotationAngles}
              droppedSVGs={memoizedDroppedSVGs}
              onSVGDrop={handleSVGDrop}
              floorIndex={activeFloor}
              isActive={true}
              setDroppedSVGs={setDroppedSVGs}
              setDroppedCameras={setDroppedCameras}
              savedCells={savedCells}
            />
          </div>
          <span className={HStyles.cameraLabel}>
          <button className={HStyles.nextFloor} onClick={nextFloor}>
              <FaChevronLeft onClick={handleRightClick} />
            </button>
            Этаж {currentSvgIndex + 1}
            <button className={HStyles.prevFloor} onClick={prevFloor}>
              <FaChevronRight onClick={handleLeftClick} />
            </button>
          </span>
        </div>
      )}
      {activeTab === 'outside' && (
        <div className={HStyles.planOutside}>
          <div className={HStyles.plan}>
            <Outside
              activeFloor={-1}
              droppedCameras={droppedCameras}
              rotationAngles={rotationAngles}
              setRotationAngles={setRotationAngles}
              onCameraDropped={handleCameraDrop}
              onDoubleClickCamera={handleDoubleClickCamera}
              FlagLocal={memoizedFlagLocalToggle}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
              handleParametrEditing={''}
              isActive={true}
              width={width}
              height={height} navigate={function (path: string): Promise<boolean> {
                throw new Error("Function not implemented.");
              }} children={""} />
          </div>
          <span className={HStyles.cameraLabel}>Уличные камеры</span>
        </div>
      )}
    </div>
  ), [activeTab, currentSvgIndex, droppedCameras, rotationAngles, coordinates, width, height, handleCameraDrop, handleDoubleClickCamera, memoizedFlagLocalToggle, floorProps]);

  return (
    <div className={HStyles.homeContainer}>
      <div className={HStyles.leftContainer}>
        <div className={HStyles.carouselContainer}>
          <div className={HStyles.carouselHeader}>
            <div className={HStyles.carouselTitle}>Выбор здания</div>
          </div>
          <div className={HStyles.carousel}>
            {numberHome > 1 && (
              <button className={HStyles.prevButton} onClick={prevSlide}>
                <FaChevronLeft />
              </button>
            )}
            <div className={HStyles.carouselInner}>
              {Array.from({ length: numberHome }, (_, index) => (
                <div
                  key={index}
                  className={`${HStyles.buildingIcon} ${getSlideClass(index)}`}
                  onClick={() => setCurrentIndex(index)}
                >

                  <Build123 />
                  {index === currentIndex && (
                    <span style={{ fontSize: "50px" }}>Здание №{index + 1}</span>
                  )}
                </div>
              ))}
            </div>
            {numberHome > 2 && (
              <button className={HStyles.nextButton} onClick={nextSlide}>
                <FaChevronRight />
              </button>
            )}
          </div>
        </div>
        <div className={HStyles.statisticsContainer}>
          {!isModalOpen ? (
            <label style={{ width: '100%', fontSize: '2vh' }}>Выберите событие для того, чтобы вывести снимок <GiClick /></label>
          ) : (
            <ModalWindow
              isOpen={isModalOpen}
              onClose={closeModal}
              imageUrl={modalImageUrl}
              predictionsData={predictionsData}
            />
          )}
        </div>
      </div>
      <div className={HStyles.rightContainer}>
        <div className={HStyles.containerH}>
          {<div className={HStyles.tabs}>
            <button
              className={`${HStyles.tabButton} ${activeTab === 'inside' ? HStyles.activeTab : ''}`}
              onClick={() => setActiveTab('inside')}
            >
              Внутренние камеры
            </button>
            <button
              className={`${HStyles.tabButton} ${activeTab === 'outside' ? HStyles.activeTab : ''}`}
              onClick={() => setActiveTab('outside')}
            >
              Уличные камеры
            </button>

          </div>}
          {planContainer}
        </div>

        <div className={HStyles.containerT}>
          <div className={HStyles.panelContainer}>
            <div className={HStyles.panelHeading} style={{ borderBottom: '1px solid #006c2a' }}>
              <div className={HStyles.panelTitle}>
                <div className={HStyles.selectContainer}>
                  <label className={HStyles.labelSelect1}>Журнал событий</label>
                  <div className={HStyles.selectObject}>
                    <label className={HStyles.labelSelect}>Выбрать этаж:</label>
                    <select value={selectedFloor || ''} onChange={handleFloorChange1}>
                      <option value="">Все этажи</option>
                      {floorOptions}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className={HStyles.tableContainer}>
              <table>
                <thead className={HStyles.tableHeader}>
                  <tr>
                    <th>Дата и время</th>
                    <th>Здание</th>
                    <th>Номер этажа</th>
                    <th>Помещение</th>
                    <th>Событие</th>
                  </tr>
                </thead>
                <tbody className={HStyles.tableBody}>
                  {renderTableRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {isModalStreamOpen && (
          <MemoizedModalStream
            navigate={navigate}
            selectedCameras={selectedCameras}
            setCam={setSelectedCameras}
            //@ts-ignore
            isPredictions={isPredictions}
            onClose={() => setIsModalStreamOpen(false)}
            FlagLocal={memoizedFlagLocalToggle}
          />
        )}
      </div>
    </div >
  );
};

export default Home;