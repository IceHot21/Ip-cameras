import { FC, useState } from "react";
import HStyles from "./Home.module.css";
import { BsBuildingFill } from "react-icons/bs";

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
    if (index === currentIndex) return HStyles.active;
    if (index === (currentIndex - 1 + numberHome) % numberHome) return `${HStyles.nearby} ${HStyles.prev}`;
    if (index === (currentIndex + 1) % numberHome) return `${HStyles.nearby} ${HStyles.next}`;
    return HStyles.hidden;
  };

  return (
    <div className={HStyles.carouselContainer}>
      <div className={HStyles.carousel}>
        <button className={HStyles.prevButton} onClick={prevSlide}>
          {"<"}
        </button>

        <div className={HStyles.carouselInner}>
          {Array.from({ length: numberHome }, (_, index) => (
            <div
              key={index}
              className={`${HStyles.buildingIcon} ${getSlideClass(index)}`}
            >
              <BsBuildingFill />
              <span>Здание номер {index + 1}</span>
            </div>
          ))}
        </div>

        <button className={HStyles.nextButton} onClick={nextSlide}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Home;