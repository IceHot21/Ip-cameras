import { FC, useState } from "react";
import HStyles from "./Home.module.css";
import { BsBuildingFill } from "react-icons/bs";
import Svg1 from "../../assets/Svg1.svg";
import Svg2 from '../../assets/Svg2.svg';
import Svg3 from '../../assets/Svg3.svg';
import SVG from "../../assets/SVG.svg";
import { useRouter } from "next/router";
import Build123 from '../../assets/Build123.svg'

interface HomeProps {
  numberHome: number;
}

const Home: FC<HomeProps> = ({ numberHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numberHome);
  };

  const roomClick = () => {
    router.push('/Feeding/Feeding');
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numberHome) % numberHome);
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

  const svgImages = [Svg1, Svg2, Svg3];

  return (
    <div>
      <div className={HStyles.homeContainer}>
        <div className={HStyles.planContainer}>
          <div className={HStyles.planOutside}>
            <SVG className={HStyles.outSide} />
            <span className={HStyles.cameraLabel}>Уличные камеры</span>
          </div>
          
          <div className={HStyles.planInside}>
            {svgImages[currentIndex] && <svgImages[currentIndex] className={HStyles.plan} onClick={roomClick} />}
            <span className={HStyles.cameraLabel}>Этаж 1</span>
          </div>
        </div>
        <div className={HStyles.carousel}>
          {numberHome > 1 && (
            <button className={HStyles.prevButton} onClick={prevSlide}>
              {"<"}
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
              {">"}
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
                    <td style={{ width: '60%' }}>Описание ошибки для здания №{index + 1}</td>
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
