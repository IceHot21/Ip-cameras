// AtisLogo.tsx
import { FC } from "react";
import { motion } from 'framer-motion';

const AtisLogo: FC = () => {
  const pathVariants = {
    hidden: { 
      pathLength: 0, 
      fill: "rgba(0, 0, 0, 0)" 
    },
    visible: { 
      pathLength: 1, 
      fill: "#000000",
      transition: {
        duration: 2,
        ease: "easeInOut",
        fill: { delay: 2 } // Задержка заливки цвета до окончания анимации обводки
      }
    }
  };

  const greenPathVariants = {
    hidden: { 
      pathLength: 0, 
      fill: "rgba(0, 0, 0, 0)" 
    },
    visible: { 
      pathLength: 1, 
      fill: "#01572d",
      transition: {
        duration: 2,
        ease: "easeInOut",
        fill: { delay: 2 }
      }
    }
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      width="13.6806in" height="2.51389in" viewBox="0 0 985 181" xmlSpace="preserve">
      <style type="text/css">
        {`
          .st1 {fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;}
          .st2 {fill:none;stroke:#01572d;stroke-width:2;stroke-linecap:round;}
        `}
      </style>
      <g transform="translate(-9,1.5)">
        <g id="group1-1" transform="translate(-9,1.5)">
          <g id="shape6-2" transform="translate(678.9,213.9) scale(1,-1)">
            <motion.path 
              d="M109.3 180.7 L92.1 180.4 L81.4 166.1 C75.4 158.3 67 147.2 62.6 141.4 C55 131.4 38.8 109.9 32 100.7 C30.2
              98.2 28.1 96.4 27 96.4 C25.1 96.4 25 97.5 24.8 138.2 L24.5 179.9 L12.5 179.9 L0.5 179.9 L0.2 133.4 C0
              107.8 0.2 84.5 0.5 81.6 L1.1 76.4 L22.3 76.6 L43.5 76.9 L74.6 118.4 C96.3 147.4 106.4 160 107.9 160.2
              L110 160.5 L110 118.5 L110 76.4 L122 76.4 C133.6 76.4 134 76.5 134.5 78.6 C134.8 79.9 134.9 103.4 134.8
              130.9 L134.5 180.9 L130.5 180.9 C128.3 181 118.8 180.9 109.3 180.7 Z" 
              className="st1"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
          </g>
          <g id="shape7-4" transform="translate(852,213.8) scale(1,-1)">
            <motion.path 
              d="M29.9 180.3 C9.6 177.8 3 171.1 1 151.2 C0 142.1 0.3 108.8 1.4 99.1 C2.7 88 8.4 80.9 18.9 77.2 C25.2 75 26.6
              74.9 61.9 74.9 C102.4 74.8 105.3 75.2 113.8 81.3 C119.5 85.5 122 91.3 122.7 102 L123.2 110.4 L110.8
              110.1 C98.4 109.8 98.4 109.8 98.1 107.3 C97.5 102.6 95.6 99.2 92.6 97.7 C85.3 93.9 40.5 93.6 32.6 97.3
              C31.1 98.1 28.8 100.3 27.6 102.2 C25.5 105.6 25.4 106.8 25.4 128.3 C25.4 161.2 24.7 160.4 58.8 161.1
              C77.2 161.4 81.1 161.3 86 159.8 C92.9 157.7 96.5 154.2 97.7 148.8 L98.5 144.8 L110.7 144.5 L122.9 144.2
              L122.9 147.8 C122.9 149.7 122 154.6 120.9 158.5 C117.9 169.4 112.1 175.6 101.5 179 C97.3 180.3 90.9
              180.6 66.4 180.9 C49.9 181 33.5 180.8 29.9 180.3 Z" 
              className="st1"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
          </g>
          <g id="shape8-6" transform="translate(378.3,215.5) scale(1,-1)">
            <motion.path 
              d="M51.3 174.8 C46.8 166.6 40.5 154.7 31.8 138 C28 130.6 23.3 121.6 21.4 118 C19.4 114.4 14.8 105.7 11.1 98.5
               C7.4 91.4 3.3 83.6 2 81.3 C0.8 79.1 0 76.9 0.3 76.6 C0.7 76.3 6.8 76 14 76 L27.1 76 L28.4 79.3 C29.9
              82.9 29.8 82.6 35.6 93.5 C37.9 97.9 40.4 101.8 41 102.2 C41.6 102.7 56.2 102.9 73.4 102.7 L104.7 102.5
              L111.4 89.5 L118.1 76.5 L131.9 76.2 C141.8 76 145.6 76.3 145.6 77.1 C145.6 78.4 143 83.6 128.6 111 C123
              121.7 112.7 141.3 105.8 154.5 C99 167.7 92.9 179.1 92.3 179.8 C91.6 180.7 86.5 181 73.1 181 L54.8 181
              L51.3 174.8 ZM83.1 144.8 C87.9 135.3 92.2 127.1 92.7 126.6 C93.2 126 93.6 124.8 93.6 123.8 C93.6 122.1
              92.2 122 73.2 122 C61.9 122 52.5 122.4 52.2 122.9 C51.6 123.9 69.4 160 71.1 161.2 C71.7 161.6 72.6 162
              73.2 162 C73.9 162 78.3 154.2 83.1 144.8 Z" 
              className="st1"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
          </g>
          <g id="shape9-8" transform="translate(531.5,215.5) scale(1,-1)">
            <motion.path 
              d="M1.1 180.3 C0 179.3 0.3 166.5 1.4 163.6 L2.4 161 L23.4 161 L44.4 161 L44.4 128.3 C44.4 110.2 44.7 91.1 45.1
              85.8 L45.7 76 L56.9 76 C66.3 76 68.3 76.3 68.8 77.6 C69.1 78.5 69.4 97.6 69.4 120.1 L69.4 161 L91.4
              161 L113.4 161 L113.4 171 L113.4 181 L57.6 181 C26.9 181 1.4 180.7 1.1 180.3 Z" 
              className="st1"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
          </g>
        </g>
        <g id="group10-10" transform="translate(-9,1.5)">
          <g id="shape2-11" transform="translate(90.1,180.5) scale(1,-1)">
            <motion.path 
              d="M0.6 180.5 C0 179.8 136 43 143.6 36.6 C148.6 32.5 152.8 31.9 158.1 34.6 C165.1 38.2 170.8 46.3 170.8 52.8
              C170.8 58.3 171.5 57.6 98.3 131.5 L49.8 180.5 L25.5 180.8 C12.2 181 1 180.8 0.6 180.5 Z" 
              className="st2"
              variants={greenPathVariants}
              initial="hidden"
              animate="visible"
            />
          </g>
          <g id="shape3-13" transform="translate(147.9,180.5) scale(1,-1)">
            <motion.path 
              d="M0.6 180.2 C0 179.2 104.4 75.1 114.3 66.9 C122.1 60.3 126 60.2 132.3 66.3 C138.5 72.2 140.6 79.2 137.8 84.3
              C137.1 85.5 115.4 107.6 89.5 133.5 L42.5 180.5 L21.8 180.8 C10 181 0.9 180.7 0.6 180.2 Z" 
              className="st2"
              variants={greenPathVariants}
              initial="hidden"
              animate="visible"
            />
          </g>
          <g id="shape4-15" transform="translate(198.9,180.5) scale(1,-1)">
            <motion.path 
              d="M0 180.1 C0 179.6 14.7 164.4 32.8 146.3 C91.4 87.5 92.8 86.2 98.4 88.8 C106.1 92.3 110.6 101 107.7 106.6
              C106.3 109.2 56.1 159.8 40.2 174.6 L33.8 180.5 L16.9 180.8 C6.1 181 0 180.8 0 180.1 Z" 
              className="st2"
              variants={greenPathVariants}
              initial="hidden"
              animate="visible"
            />
          </g>
          <g id="shape5-17" transform="translate(0,181.6) scale(1,-1)">
            <motion.path 
              d="M79.2 178.8 C78.1 177.6 59.8 159.5 38.6 138.6 C17.3 117.7 0 100.1 0.1 99.4 C0.5 98 18.8 79 61.2 36.4 L94.3
              3.1 L116.8 2.9 C157.6 2.4 156.5 2.3 161 6.3 C164.5 9.4 167.9 17.3 167.9 22.1 C167.9 28.5 163.8 36.5
              158.8 39.8 L154.6 42.6 L130.7 42.9 L106.9 43.2 L80.4 69.6 L53.9 96 L53.9 100.8 C53.9 104.6 54.6 106.9
              57 110.7 C62.3 119 68.5 123.1 77.2 123.9 C81.4 124.3 82.6 123.9 86.9 121 C91.5 117.9 124.3 85.3 175
              33.5 C197 11.1 204.4 4.4 208.6 3.2 C217.6 0.6 230.9 13.7 230.9 25 C230.9 28.4 230 29.9 223.2 37.7 C218.9
              42.6 207 55.2 196.6 65.6 C186.3 76.1 158.1 104.6 134.1 129 C110.1 153.4 88.3 175 85.8 177.2 L81.2 181
              L79.2 178.8 Z" 
              className="st2"
              variants={greenPathVariants}
              initial="hidden"
              animate="visible"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default AtisLogo;