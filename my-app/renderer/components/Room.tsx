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
                <input
                    type="radio"
                    name="slider"
                    id="item-1"
                    checked={activeSvg === 0}
                />
                <input
                    type="radio"
                    name="slider"
                    id="item-2"
                    checked={activeSvg === 1}
                />
                <input
                    type="radio"
                    name="slider"
                    id="item-3"
                    checked={activeSvg === 2}
                />
                <div className={RStyles.cards}>
                    {svgs.map((SvgComponent, index) => (
                        <label
                        key={index}
                        className={`${RStyles.card} ${index === activeSvg ? RStyles.cardActive : RStyles.cardInactive}`}
                        htmlFor={`item-${index + 1}`}
                        id={`song-${index + 1}`}
                        data-index={index}
                        onClick={() => handleSvgClick(index)}
                      >
                        <SvgComponent {...svgProps} />
                      </label>
                    ))}
                </div>
                {children}
            </div>
        </div>
    );
};

export default Room;