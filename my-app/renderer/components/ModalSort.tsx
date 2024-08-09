import { FC, useState } from "react";
import { BiX } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import MStyles from "../styles/Modal.module.css";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface ModalSortProps {
  open: boolean;
  onClose: () => void;
}

const ModalSort: FC<ModalSortProps> = ({ open, onClose }) => {
  if (!open) return null;

  const [sortCriteria, setSortCriteria] = useState("date");
  const [sortOrder, setSortOrder] = useState("down");
  const [isFocused, setIsFocused] = useState(false);

  const criteriaChange = (event: SelectChangeEvent<string>) => {
    setSortCriteria(event.target.value);
  };

  const orderChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
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
            className={MStyles.modalContentSort}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 1.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={MStyles.headerSort}>
              <BiX onClick={onClose} className={MStyles.closeIcon} />
            </div>
            <div className={MStyles.sortSelect}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <FormControl variant="standard" sx={{ m: 0, width: "100%", marginBottom: "15px" }}>
                  <Select
                    labelId="criteria-select-label"
                    id="criteria-select"
                    value={sortCriteria}
                    onChange={criteriaChange}
                    sx={{
                      '&.MuiInput-underline:after': {
                        borderBottom: '2px solid #006c2a',
                      },
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="date">Дата и время</MenuItem>
                    <MenuItem value="name">Наименование</MenuItem>
                  </Select>
                </FormControl>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <FormControl variant="standard" sx={{ m: 0, width: "100%" }}>
                  <Select
                    labelId="order-select-label"
                    id="order-select"
                    value={sortOrder}
                    onChange={orderChange}
                    sx={{
                      '&.MuiInput-underline:after': {
                        borderBottom: '2px solid #006c2a',
                      },
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="down">По убыванию</MenuItem>
                    <MenuItem value="up">По возрастанию</MenuItem>
                  </Select>
                </FormControl>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
              >
                <button id="sortOkButton" className={MStyles.sortOkButton}>Применить</button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalSort;
