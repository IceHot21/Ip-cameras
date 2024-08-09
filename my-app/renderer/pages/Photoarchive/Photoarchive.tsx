import { FC, useState } from "react";
import { BiCaretLeft, BiCaretRight, BiDownload, BiZoomIn, BiZoomOut, BiX } from "react-icons/bi";
import { BsAspectRatio, BsArrowDownUp, BsFunnelFill, BsListTask, BsGrid3X3GapFill  } from "react-icons/bs";
import { motion } from "framer-motion";
import PStyles from "./Photoarchive.module.css";
import ModalView from "../../components/ModalView";
import ModalSort from "../../components/ModalSort";
import ModalFilt from "../../components/ModalFilt";

const Photoarchive: FC = () => {
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [isModalSortOpen, setIsModalSortOpen] = useState(false);
  const [isModalFiltOpen, setIsModalFiltOpen] = useState(false);

  const prevNavigation = () => {
    // логика для кнопки назад
  };

  const nextNavigation = () => {
    // логика для кнопки вперед
  };

  const savePhoto = () => {
    // логика для кнопки сохранить фото
  };

  const zoomIn = () => {
    // логика для кнопки приближения
  };

  const zoomOut = () => {
    // логика для кнопки отдаления
  };

  const beginPhoto = () => {
    // логика для кнопки масштаба фото
  };

  return (
    <div>
      <motion.div
        className={PStyles.Archive}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label>
          Архив за 22.05.2023, 10:50:22 - 23.05.2023, 10:50:22
        </label>

        <div className={PStyles.iconSort}>
          <BsArrowDownUp onClick={() => setIsModalSortOpen(true)}/>
          <BsGrid3X3GapFill  onClick={() => setIsModalViewOpen(true)} />
          <BsFunnelFill onClick={() => setIsModalFiltOpen(true)} />
        </div>

        <div className={PStyles.sortModal}>
          <div className={PStyles.headerSort}>
            <BiX />
          </div>
          <div className={PStyles.selectSort1}>
            <select>
              <option value="date">Дата и время</option>
              <option value="name">Наименование</option>
            </select>
          </div>
          <div className={PStyles.selectSort2}>
            <select>
              <option value="down">По убыванию</option>
              <option value="up">По возрастанию</option>
            </select>
          </div>
          <button>Ok</button>
        </div>

        <div className={PStyles.viewModal}>
          <div className={PStyles.headerView}>
            <BiX />
          </div>
          <div className={PStyles.viewButton}>
            <button>
              <BsListTask />
              <span>Список</span>
            </button>
            <button>
              <BsGrid3X3GapFill  />
              <span>Плитка</span>
            </button>
          </div>
        </div>

        <div className={PStyles.filtModal}>
          <div className={PStyles.headerFilt}>
            <BiX />
          </div>
          <div className={PStyles.filtContainer}>
            <span>Выберите период:</span>
            <div className={PStyles.data}>
              <input type="datetime-local" className={PStyles.datatime}></input>
              <input type="datetime-local" className={PStyles.datatime}></input>
            </div>
            <span>Выберите тип помещений:</span>
            <div className={PStyles.placeTab}></div>
            <div className={PStyles.filt}>
              <button className="btn btn-lg btn-success">Применить</button>
              <button className="btn btn-lg btn-success">Сброс фильтра</button>
            </div>
          </div>
        </div>
      </motion.div>

      <ModalView open={isModalViewOpen} onClose={() => setIsModalViewOpen(false)} />
      <ModalSort open={isModalSortOpen} onClose={() => setIsModalSortOpen(false)} />
      <ModalFilt open={isModalFiltOpen} onClose={() => setIsModalFiltOpen(false)} />
    </div>
  );
};

export default Photoarchive;