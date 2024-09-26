import { createElement, FC, useState, useEffect } from "react";
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

interface SVGItem {
  id: number;
  name: string;
}


const Home: FC<HomeProps> = ({ numberHome, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSvgIndex, setCurrentSvgIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [droppedCameras, setDroppedCameras] = useState<{ [key: string]: Camera }>({});
  const [droppedSVGs, setDroppedSVGs] = useState<{ [key: string]: SVGItem }>({});
  const itemsPerPage = 5;

  const totalPages = Math.ceil(numberHome / itemsPerPage);

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

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return Array.from({ length: numberHome }, (_, index) => ({
      date,
      building: index + 1,
      floor: index + 1,
      description: `Описание события для здания №${index + 1}`
    }))
      .slice(startIndex, endIndex)
      .map((event, index) => (
        <tr key={index}>
          <td>{event.date}</td>
          <td>Здание №{event.building}</td>
          <td>Этаж {event.floor}</td>
          <td>{event.description}</td>
        </tr>
      ));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              <Floor
                navigate={navigate}
                children={null}
                onCameraDropped={() => { }}
                droppedCameras={droppedCameras}
                activeFloor={currentSvgIndex}
                onFloorChange={setCurrentSvgIndex}
                onDoubleClickCamera={() => { }}
                FlagLocal={() => { }}
                rotationAngles={{}}
                setRotationAngles={() => { }}
                droppedSVGs={droppedSVGs}
                onSVGDrop={() => { }}
                floorIndex={currentSvgIndex}
                isActive={true}
                setDroppedSVGs={setDroppedSVGs}
              />
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
                  <Button><BsArrowDownUp /></Button>
                  <div className={HStyles.selectObject}>
                    <select>
                      <option>1</option>
                      <option>2</option>
                    </select>
                    <select>
                      <option >1</option>
                      <option >2</option>
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
                      <th >Дата и время</th>
                      <th >Здание</th>
                      <th >Номер этажа</th>
                      <th >Событие</th>
                    </tr>
                  </thead>
                  <tbody className={HStyles.tableBody}>
                    {renderTableRows()}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={HStyles.panelDown}>
              <div className={HStyles.rowContainer}>
                <label>Показано событий {Math.min(numberHome, itemsPerPage)} из {numberHome}</label>
                <ul>
                  <li>
                    <a href="#" onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}>
                      <FaChevronLeft />
                    </a>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index} className={currentPage === index + 1 ? HStyles.activePage : ''}>
                      <a href="#" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#" onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}>
                      <FaChevronRight />
                    </a>
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