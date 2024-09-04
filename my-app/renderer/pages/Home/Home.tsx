import { FC, useState } from "react";
import HStyles from "./Home.module.css";
import { BsBuildingFill } from "react-icons/bs";
import Svg1 from "../../assets/Svg1.svg"
import SVG from "../../assets/SVG.svg"


interface HomeProps {
  numberHome: number;
}

const Home: FC<HomeProps> = ({ numberHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numberHome);
  };

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

  return (
    <div>
      <div className={HStyles.homeContainer}>
        <div className={HStyles.planContainer}>
          <div className={HStyles.planOutside}>
            <SVG className={HStyles.outSide} />
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1%" }}>Уличные камеры</span>
          </div>
          <div className={HStyles.tableContainer}>
              <table>
                <thead className={HStyles.tableHeader}>
                  <tr>
                    <th >№</th>
                    <th>Индикатор</th>
                    <th>Наименование ошибок</th>
                  </tr>
                </thead>
                <tbody className={HStyles.tableBody} >
                  <tr>
                    <td>1</td>
                    <td>Ошибка</td>
                    <td>Лишний человек</td>
                  </tr>
                </tbody>
              </table>
            </div>
          <div className={HStyles.planInside}>
            <Svg1 className={HStyles.plan} />
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1%" }}>Этаж 1</span>
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
                <span>Здание №{index + 1}</span>
                <BsBuildingFill />
              </div>
            ))}
          </div>
          {numberHome > 2 && (
            <button className={HStyles.nextButton} onClick={nextSlide}>
              {">"}
            </button>
          )}
        </div>
      </div>



    </div>
  );
};

export default Home;