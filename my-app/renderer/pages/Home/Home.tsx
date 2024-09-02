import { FC, useState } from "react";
import HStyles from "./Home.module.css";
import { BsBuildingFill } from "react-icons/bs";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Home: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const icons = [
    { id: 1, name: "Объект 1", icon: <BsBuildingFill /> },
    { id: 2, name: "Объект 2", icon: <BsBuildingFill /> },
    { id: 3, name: "Объект 3", icon: <BsBuildingFill /> },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div>
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        keyBoardControl={true}
        customTransition="transform 300ms ease-in-out"
        transitionDuration={300}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        activeIndex={activeIndex}
        afterChange={(index) => setActiveIndex(index)}
      >
        {icons.map((icon, index) => (
          <div key={icon.id} className={HStyles.homeContainer}>
            {icon.icon}
            <div className={HStyles.homeName}>{icon.name}</div>
            <div className={HStyles.homeNumber}>{icon.id}</div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Home;