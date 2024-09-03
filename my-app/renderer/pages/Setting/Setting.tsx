import { Button, Input, InputProps } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import SStyles from "./Setting.module.css";

interface SettingProps {
  numberHome: number;
  setNumberHome: (value: number) => void;
}

const Setting: FC<SettingProps> = ({ numberHome, setNumberHome }) => {
  // Временное состояние для хранения значения input
  const [inputValue, setInputValue] = useState<number>(numberHome);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
  
    if (newValue >= 1 && newValue <= 10) {
      setInputValue(newValue); // Обновляем временное состояние
    } else if (newValue > 10) {
      alert("Больше 10 не может быть");
    } else if (newValue < 1) {
      alert("Меньше 1 не может быть");
    }
  };

  const handleSave = () => {
    setNumberHome(inputValue); // Обновляем состояние
    localStorage.setItem("numberHome", inputValue.toString()); // Сохраняем в localStorage
    console.log("Сохраненное значение:", inputValue);
  };

  return (
    <div className={SStyles.homeNumber}>
      <Input
        className={SStyles.input}
        type="number"
        value={inputValue}
        onChange={handleChange}
        inputProps={{ min: 1, max: 10 }}
        sx={{ width: '25% !important' }}
      />
      <Button
        onClick={handleSave}
        sx={{ width: '25% !important' }}
      >
        Сохранить
      </Button>
    </div>
  );
};

export default Setting;
