import React, { FC, useMemo, useState, useEffect, memo } from "react";
import HStyles from "./Home.module.css";
import { BsArrowDownUp } from "react-icons/bs";
import Svg1 from "../../assets/Svg1.svg";
import Svg2 from '../../assets/Svg2.svg';
import Svg3 from '../../assets/Svg3.svg';
import SVG from "../../assets/SVG.svg";
import { useRouter } from "next/router";
import Build123 from '../../assets/Build123.svg'
import { FaBell, FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { Button } from "@mui/material";
import Floor from '../../components/Floor'; // Импортируем компонент Floor
import { fetchWithRetry } from "../../refreshToken";
import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';

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

const MemoizedFloor = memo(Floor);

const Home: FC<HomeProps> = ({ numberHome, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSvgIndex, setCurrentSvgIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera }>({});
  const [droppedSVGs, setDroppedSVGs] = useState<{ [key: string]: SVGItem }>({});
  const [roomInfoMap, setRoomInfoMap] = useState<{ [port: number]: RoomInfo }>({});
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const itemsPerPage = 5;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithRetry('https://192.168.0.136:4200/prediction/eventlist', 'GET', null, '/Home/Home');
        const initialPredictions = response.slice(0, 100); // Загружаем первые 100 предиктов
        setPredictions(initialPredictions);

        // Найти все уникальные camera_port
        const uniquePorts = [...new Set(initialPredictions.map(event => event.camera_port))];

        // Сопоставить каждый уникальный camera_port с соответствующим этажом и комнатой)
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
    const socket = new WebSocket('ws://localhost:9999');

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
            updatedPredictions.pop(); // Удаляем самый старый предикт, если их больше 100
          }
          return updatedPredictions;
        });

        // Обновляем roomInfoMap для нового предикта
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

  const router = useRouter();
  const svgImages = [Svg1, Svg2, Svg3];
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}    ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

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

  const FloorClick = () => {
    router.push({
      pathname: '/Feeding/Feeding',
      query: { floor: currentSvgIndex },
    });
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numberHome) % numberHome);
  };

  const nextFloor = () => {
    setCurrentSvgIndex((prevSvgIndex) => (prevSvgIndex + 1) % svgImages.length);
  };

  const prevFloor = () => {
    setCurrentSvgIndex((prevSvgIndex) => (prevSvgIndex - 1 + svgImages.length) % svgImages.length);
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

  const formatTime = (timeInMilliseconds) => {
    const date = new Date(Number(timeInMilliseconds));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return predictions
      .filter(event => selectedFloor === null || roomInfoMap[event.camera_port]?.activeFloor === selectedFloor)
      .slice(startIndex, endIndex)
      .map((event, index) => {
        const roomInfo = roomInfoMap[event.camera_port] || { activeFloor: 'Неизвестно', roomName: 'Неизвестно' };
        const eventDate = formatTime(event.date); // Преобразуем миллисекунды в объект Date

        return (
          <tr key={index}>
            <td>{eventDate}</td>
            <td>Здание №1</td>
            <td>Этаж {Number(roomInfo.activeFloor) + 1}</td>
            <td>{roomInfo.roomName}</td>
            <td>Обнаружен {event.item_predict} с вероятностью {(Number(event.score_predict.slice(0, 6)) * 100).toFixed(2)}%</td>
          </tr>
        );
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(predictions.length / itemsPerPage);

  const [pageGroup, setPageGroup] = useState(1);
  const pagesPerGroup = 5;

  const handleNextPageGroup = () => {
    setPageGroup(prev => Math.min(prev + 1, Math.ceil(totalPages / pagesPerGroup)));
  };

  const handlePrevPageGroup = () => {
    setPageGroup(prev => Math.max(prev - 1, 1));
  };

  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);


  const floorOptions = Array.from({ length: svgImages.length }, (_, index) => (
    <option key={index} value={index}>{index + 1}</option>
  ));

  const handleFloorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedFloor(selectedValue === '' ? null : Number(selectedValue));
  };


  return (
    <div>
      <div className={HStyles.homeContainer}>
        <div className={HStyles.planContainer}>
          <div className={HStyles.planOutside}>
            <SVG className={HStyles.outSide} />
            <span className={HStyles.cameraLabel}>Уличные камеры</span>
            <div>
              <div className={HStyles.iconTabs}>
                <FaBell className={HStyles.tabIcon} />
                <FaInfoCircle className={HStyles.tabIcon} />
              </div>
              <div className={HStyles.tableWrapper}>
                <div className={HStyles.panelTitle1}>
                </div>
                <div className={HStyles.tableContainer1}>
                  <table>
                    <thead>
                      <tr>
                        <th>Дата и время</th>
                        <th>Событие</th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className={HStyles.planInside}>
            <div className={HStyles.plan}>
              <MemoizedFloor {...floorProps} />
            </div>
            <span className={HStyles.cameraLabel}>
              <button className={HStyles.prevFloor} onClick={prevFloor}><FaChevronLeft /></button>
              Этаж {currentSvgIndex + 1}
              <button className={HStyles.nextFloor} onClick={nextFloor}><FaChevronRight /></button>
            </span>
            <div>
              <div className={HStyles.iconTabs} style={{ justifyContent: "flex-end" }}>
                <FaBell className={HStyles.tabIcon} />
                <FaInfoCircle className={HStyles.tabIcon} />
              </div>
              <div className={HStyles.tableWrapper}>
                <div className={HStyles.panelTitle1}>
                </div>
                <div className={HStyles.tableContainer1}>
                  <table>
                    <thead>
                      <tr>
                        <th>Дата и время</th>
                        <th>Событие</th>
                      </tr>
                    </thead>
                    <tbody>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
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
                {index === currentIndex && <span style={{ fontSize: '50px' }}>Здание №{index + 1}</span>}
                <Build123 />
              </div>
            ))}
          </div>
          {numberHome > 2 && (
            <button className={HStyles.nextButton} onClick={nextSlide}>
              <FaChevronRight />
            </button>
          )}
        </div>

        <div className={HStyles.containerT}>
          <div className={HStyles.panelContainer}>
            <div className={HStyles.panelHeading}>
              <div className={HStyles.panelTitle}>
                <label className={HStyles.title}>Журнал всех событий</label>
                <div className={HStyles.selectContainer}>
                  <div className={HStyles.selectObject}>
                    <label className={HStyles.labelSelect}>Выбрать этаж:</label>
                    <select value={selectedFloor === null ? '' : selectedFloor} onChange={handleFloorChange}>
                      <option value="">Все этажи</option>
                      {floorOptions}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className={HStyles.tableContainer}>
              <div className={HStyles.tableHeaderWrapper}>
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
                </table>
              </div>
              <div className={HStyles.tableBodyWrapper}>
                <table>
                  <tbody className={HStyles.tableBody}>
                    {renderTableRows()}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={HStyles.panelDown}>
              <div className={HStyles.rowContainer}>
                <label>Страница {currentPage} из {totalPages}</label>
                <ul>
                  <li>
                    <button
                      className={HStyles.buttonPage}
                      onClick={handlePrevPageGroup}
                      disabled={pageGroup === 1}
                    >
                      <FaChevronLeft />
                    </button>
                  </li>
                  {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                    <li key={index} className={currentPage === startPage + index ? HStyles.activePage : ''}>
                      <a href="#" onClick={() => handlePageChange(startPage + index)}>
                        {startPage + index}
                      </a>
                    </li>
                  ))}
                  <li>
                    <button
                      className={HStyles.buttonPage}
                      onClick={handleNextPageGroup}
                      disabled={pageGroup === Math.ceil(totalPages / pagesPerGroup)}
                    >
                      <FaChevronRight />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;