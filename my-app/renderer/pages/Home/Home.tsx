import { createElement, FC, useState } from "react";
import HStyles from "./Home.module.css";
import { BsBuildingFill } from "react-icons/bs";
import Svg1 from "../../assets/Svg1.svg";
import Svg2 from '../../assets/Svg2.svg';
import Svg3 from '../../assets/Svg3.svg';
import SVG from "../../assets/SVG.svg";
import { useRouter } from "next/router";
import Build123 from '../../assets/Build123.svg'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface HomeProps {
  numberHome: number;
}

const Home: FC<HomeProps> = ({ numberHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSvgIndex, setCurrentSvgIndex] = useState(0);
  const router = useRouter();
  const svgImages = [Svg1, Svg2, Svg3];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numberHome);
  };

  const roomClick = () => {
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

  return (
    <div>
      <div className={HStyles.homeContainer}>
        <div className={HStyles.planContainer}>
          <div className={HStyles.planOutside}>
            <SVG className={HStyles.outSide} />
            <span className={HStyles.cameraLabel}>Уличные камеры</span>
          </div>

          <div className={HStyles.planInside}>
          {createElement(svgImages[currentSvgIndex], {
              className: HStyles.plan,
              onClick: roomClick
            })}
            <span className={HStyles.cameraLabel}>
              <button className={HStyles.prevFloor} onClick={prevFloor}><FaChevronLeft /></button>
                Этаж {currentSvgIndex + 1}
              <button className={HStyles.nextFloor} onClick={nextFloor}><FaChevronRight /></button>
            </span>
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
        <div className={HStyles.tableContainer1}>
          <div className={HStyles.tableHeaderWrapper}>
            <table>
              <thead className={HStyles.tableHeader}>
                <tr>
                  <th style={{ width: '20%' }}>Здание</th>
                  <th style={{ width: '20%' }}>Номер этажа</th>
                  <th style={{ width: '60%' }}>Событие</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className={HStyles.tableBodyWrapper}>
            <table>
              <tbody className={HStyles.tableBody}>
                {Array.from({ length: numberHome }, (_, index) => (
                  <tr key={index}>
                    <td style={{ width: '20%' }}>Здание №{index + 1}</td>
                    <td style={{ width: '20%' }}>Этаж {index + 1}</td>
                    <td style={{ width: '60%' }}>Описание события для здания №{index + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
