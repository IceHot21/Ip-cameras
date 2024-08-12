import { FC, useState } from "react";
import { BiCaretLeft, BiCaretRight, BiDownload, BiZoomIn, BiZoomOut, BiX } from "react-icons/bi";
import { BsAspectRatio, BsArrowDownUp, BsFunnelFill, BsListTask, BsGrid3X3GapFill } from "react-icons/bs";
import { motion } from "framer-motion";
import ModalView from "../../components/ModalView";
import ModalSort from "../../components/ModalSort";
import ModalFilt from "../../components/ModalFilt";
import VStyles from "./Videoarchive.module.css"

const Videoarchive: FC = () => {
    const [isModalViewOpen, setIsModalViewOpen] = useState(false);
    const [isModalSortOpen, setIsModalSortOpen] = useState(false);
    const [isModalFiltOpen, setIsModalFiltOpen] = useState(false);


    const prevNavigation = () => {
        //логика для кнопки назад
    }

    const nextNavigation = () => {
        //логика для кнопки вперед
    }

    return (
        <div>
            <motion.div
                className={VStyles.Archive}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <label>
                    Архив за 22.05.2023, 10:50:22 - 23.05.2023, 10:50:22
                </label>

                <div className={VStyles.iconSort}>
                    <BsArrowDownUp onClick={() => setIsModalSortOpen(true)} />
                    <BsGrid3X3GapFill onClick={() => setIsModalViewOpen(true)} />
                    <BsFunnelFill onClick={() => setIsModalFiltOpen(true)} />
                </div>
            </motion.div>

            <ModalView open={isModalViewOpen} onClose={() => setIsModalViewOpen(false)} />
            <ModalSort open={isModalSortOpen} onClose={() => setIsModalSortOpen(false)} />
            <ModalFilt open={isModalFiltOpen} onClose={() => setIsModalFiltOpen(false)} />
        </div>
    )
}

export default Videoarchive