import { FC, useState } from 'react';
import Svg1 from '../assets/Svg1.svg';
import Svg2 from '../assets/Svg2.svg';
import Svg3 from '../assets/Svg3.svg';
import RStyles from '../styles/RStyles.module.css';

type RoomProps = {
  children: React.ReactNode;
  svgProps: any;
};

const Room: FC<RoomProps> = ({ children, svgProps }) => {
  const [activeSvg, setActiveSvg] = useState(0);

  const svgs = [Svg1, Svg2, Svg3];

  const handleSvgClick = (index: number) => {
    setActiveSvg(index);
  };

  return (
    <div className={RStyles.body}>
      <div className={RStyles.container}>
        <div className={RStyles.cards}>
          <div className={RStyles.inactiveContainer}>
            {svgs.map((SvgComponent, index) => (
              index !== activeSvg && (
                <div
                  key={index}
                  className={`${RStyles.card} ${RStyles.inactive}`}
                  onClick={() => handleSvgClick(index)}
                >
                  <div className={RStyles.indexText}>{index + 1}</div>
                  <SvgComponent {...svgProps} />
                </div>
              )
            ))}
          </div>
          {svgs.map((SvgComponent, index) => (
            index === activeSvg && (
              <div
                key={index}
                className={`${RStyles.card} ${RStyles.active}`}
                onClick={() => handleSvgClick(index)}
              >
                <div className={RStyles.indexText}>{index + 1}</div>
                <SvgComponent {...svgProps} />
                <div className={RStyles.gridOverlay}>
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className={RStyles.gridCell}></div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Room;