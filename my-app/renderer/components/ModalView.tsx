import { FC } from "react";
import { BiX, BiGrid } from "react-icons/bi";
import { BsListTask } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import MStyles from "../styles/Modal.module.css";

interface ModalViewProps {
  open: boolean;
  onClose: () => void;
}

const ModalView: FC<ModalViewProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={MStyles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }} // Плавное исчезновение фона
          onClick={onClose}
        >
          <motion.div
            className={MStyles.modalContentView}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 1.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={MStyles.headerView}>
              <BiX onClick={onClose} className={MStyles.closeIcon} />
            </div>
            <div className={MStyles.viewButton}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
              <button>
                <BsListTask />
                <span>Список</span>
              </button>
              <button>
                <BiGrid />
                <span>Плитка</span>
              </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalView;
