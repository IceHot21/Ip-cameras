import { FC, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, IconButton, Button } from "@mui/material";
import MStyles from "../styles/Modal.module.css"
import { motion, AnimatePresence } from "framer-motion";
import { BiX } from "react-icons/bi";
import styled from 'styled-components';


interface ModalFiltProps {
  navigate: (path: string) => Promise<boolean>;
  open: boolean;
  onClose: () => void;
}
// Регистрируем локализацию
//@ts-ignore
registerLocale("ru", ru);

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-ccursor: "pointer" }}4CAF50; /* Цвет границы при фокусе */
  }cursor: "pointer" }}

  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #4CAF50; /* Цвет границы при наведении */
  }

  & .MuiOutlinedInput-root.Mui-focused {
    background-color: #F0F0F0; /* Фоновый цвет при фокусе */
  }
`;

const CustomInput = ({ value, onClick }: any) => (
  <IconButton onClick={onClick} style={{ padding: 0 }}>
    <StyledTextField
      variant="outlined"
      value={value}
      placeholder="Выберите дату и время"
      InputProps={{
        endAdornment: (
          <BiCalendar style={{ cursor: "pointer", color: "#4CAF50", fontSize:"20px" }} />
        ),
        style: {
          backgroundColor: "#F0F0F0",
          borderRadius: "4px",
        },
      }}
      fullWidth
      style={{
        width: "100%",
      }}
      disabled={false}
      error={false}
    />
  </IconButton>
);

const ModalFilt: FC<ModalFiltProps> = ({ open, onClose, navigate }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleApply = () => {
    console.log("Start Date:", startDate, "End Date:", endDate);
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <span className={MStyles.filtText}>Выберите период:</span>
                <div className={MStyles.dateRange}>
                  <DatePicker
                    locale="ru"
                    selected={startDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="dd.MM.yyyy HH:mm"
                    customInput={<CustomInput />}
                    calendarClassName="custom-calendar"
                    popperClassName="custom-popper"
                  />
                  <DatePicker
                    locale="ru"
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="dd.MM.yyyy HH:mm"
                    customInput={<CustomInput />}
                    calendarClassName="custom-calendar"
                    popperClassName="custom-popper"
                  />
                </div>
                <span className={MStyles.filtText}>Выберите тип помещений:</span>
                <div className={MStyles.placeTab}></div>
                <div className={MStyles.filtButtons}>
                  <Button className={MStyles.okClick} onClick={handleApply}>
                    Применить
                  </Button>
                  <Button className={MStyles.resetClick} onClick={handleReset}>
                    Сброс фильтра
                  </Button>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalFilt;
