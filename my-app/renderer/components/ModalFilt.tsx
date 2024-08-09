import { FC, useState } from "react";
import { BiX } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import MStyles from "../styles/Modal.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, TextField } from "@mui/material";

interface ModalFiltProps {
  open: boolean;
  onClose: () => void;
}

const ModalFilt: FC<ModalFiltProps> = ({ open, onClose }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleApply = () => {
    console.log("Start Date:", startDate, "End Date:", endDate);
    alert(`Start Date: ${startDate}, End Date: ${endDate}`);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={MStyles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          onClick={onClose}
        >
          <motion.div
            className={MStyles.modalContentFilt}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 1.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={MStyles.headerFilt}>
              <BiX onClick={onClose} className={MStyles.closeIcon} />
            </div>
            <div className={MStyles.filtContent}>
              <span className={MStyles.filtText}>Выберите период:</span>
              <div className={MStyles.dateRange}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  customInput={<TextField variant="standard" fullWidth />}
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="dd/MM/yyyy"
                  customInput={<TextField variant="standard" fullWidth />}
                />
              </div>
              <span className={MStyles.filtText}>Выберите тип помещений:</span>
              <div className={MStyles.placeTab}></div>
              <div className={MStyles.filtButtons}>
                <Button variant="contained" color="primary" onClick={handleApply}>
                  Применить
                </Button>
                <Button variant="contained" color="secondary" onClick={handleReset}>
                  Сброс фильтра
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalFilt;