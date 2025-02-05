import { Button, Input, InputProps, Select, MenuItem } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import SStyles from "./Setting.module.css";
import { fetchWithRetry } from "../../refreshToken";

interface SettingProps {
  navigate: (path: string) => Promise<boolean>;
  numberHome: number;
  setNumberHome: (value: number) => void;
}

const Setting: FC<SettingProps> = ({ numberHome, setNumberHome, navigate }) => {
  // Временное состояние для хранения значения input
  const [inputValue, setInputValue] = useState<number>(numberHome);
  // Временное состояние для хранения выбранного файла
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Состояние для управления отображением формы создания объекта
  const [showObjectForm, setShowObjectForm] = useState<boolean>(false);
  // Состояние для хранения названия объекта
  const [objectName, setObjectName] = useState<string>("");
  // Состояние для хранения количества зданий
  const [numberOfBuildings, setNumberOfBuildings] = useState<number | null>(null);
  // Состояние для хранения названий зданий
  const [buildingNames, setBuildingNames] = useState<string[]>([]);
  // Состояние для хранения количества этажей в каждом здании
  const [numberOfFloors, setNumberOfFloors] = useState<number[]>([]);
  // Состояние для хранения выбранных файлов для каждого этажа каждого здания
  const [floorFiles, setFloorFiles] = useState<File[][]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
  
    if (newValue >= 1 && newValue <= 12) {
      setInputValue(newValue); // Обновляем временное состояние
    } else if (newValue > 10) {
      alert("Больше 10 не может быть");
    } else if (newValue < 1) {
      alert("Меньше 1 не может быть");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "image/svg+xml") {
      setSelectedFile(file);
    } else {
      alert("Пожалуйста, выберите файл формата SVG.");
    }
  };

  const handleSave = () => {
    setNumberHome(inputValue); // Обновляем состояние
    localStorage.setItem("numberHome", inputValue.toString()); // Сохраняем в localStorage
    console.log("Сохраненное значение:", inputValue);

    if (selectedFile) {
      sendFileToServer(selectedFile);
    }
  };

  const sendFileToServer = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    console.log("Файл отправлен на сервер:", formData);
    try {
      const response = await fetchWithRetry('https://192.168.0.150:4200/api/save-file', 'POST', formData, '/Setting/Setting');
  
      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCreateObject = () => {
    setShowObjectForm(true);
  };

  const handleObjectNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setObjectName(event.target.value);
  };

  const handleNumberOfBuildingsChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as number;
    setNumberOfBuildings(value);
    setBuildingNames(Array(value).fill("")); // Инициализация названий зданий
    setNumberOfFloors(Array(value).fill(1)); // Инициализация количества этажей для каждого здания
    setFloorFiles(Array(value).fill(Array(1).fill(null))); // Инициализация файлов для каждого этажа
  };

  const handleBuildingNameChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const newBuildingNames = [...buildingNames];
    newBuildingNames[index] = event.target.value;
    setBuildingNames(newBuildingNames);
  };

  const handleNumberOfFloorsChange = (index: number) => (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as number;
    const newNumberOfFloors = [...numberOfFloors];
    newNumberOfFloors[index] = value;
    setNumberOfFloors(newNumberOfFloors);

    const newFloorFiles = [...floorFiles];
    newFloorFiles[index] = Array(value).fill(null);
    setFloorFiles(newFloorFiles);
  };

  const handleFloorFileChange = (buildingIndex: number, floorIndex: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "image/svg+xml") {
      const newFloorFiles = [...floorFiles];
      newFloorFiles[buildingIndex][floorIndex] = file;
      setFloorFiles(newFloorFiles);
    } else {
      alert("Пожалуйста, выберите файл формата SVG.");
    }
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
      <div>
        <input
          type="file"
          accept="image/svg+xml"
          onChange={handleFileChange}
        />
        {selectedFile && <p>Выбран файл: {selectedFile.name}</p>}
        {selectedFile && (
          <Button
            onClick={() => sendFileToServer(selectedFile)}
            sx={{ width: '25% !important', marginTop: '10px' }}
          >
            Сохранить файл
          </Button>
        )}
      </div>
      <Button
        onClick={handleCreateObject}
        sx={{ width: '25% !important', marginTop: '10px' }}
      >
        Создать объект
      </Button>
      {showObjectForm && (
        <div>
          <Input
            className={SStyles.input}
            type="text"
            value={objectName}
            onChange={handleObjectNameChange}
            placeholder="Название объекта"
            sx={{ width: '25% !important', marginTop: '10px' }}
          />
          <p>Выберите количество зданий:</p>
          <Select
            value={numberOfBuildings || ""}
            // @ts-ignore
            onChange={handleNumberOfBuildingsChange}
            sx={{ width: '25% !important', marginTop: '10px' }}
          >
            {[...Array(10)].map((_, index) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
          {numberOfBuildings && (
            <div>
              {Array.from({ length: numberOfBuildings }, (_, index) => (
                <div key={index}>
                  <Input
                    className={SStyles.input}
                    type="text"
                    value={buildingNames[index]}
                    onChange={handleBuildingNameChange(index)}
                    placeholder={`Название здания ${index + 1}`}
                    sx={{ width: '25% !important', marginTop: '10px' }}
                  />
                  <p>Выберите количество этажей:</p>
                  <Select
                    value={numberOfFloors[index] || ""}
                    // @ts-ignore
                    onChange={handleNumberOfFloorsChange(index)}
                    sx={{ width: '25% !important', marginTop: '10px' }}
                  >
                    {[...Array(10)].map((_, floorIndex) => (
                      <MenuItem key={floorIndex} value={floorIndex + 1}>
                        {floorIndex + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  {Array.from({ length: numberOfFloors[index] }, (_, floorIndex) => (
                    <div key={floorIndex}>
                      <p>Выберите файл для этажа {floorIndex + 1}:</p>
                      <input
                        type="file"
                        accept="image/svg+xml"
                        onChange={handleFloorFileChange(index, floorIndex)}
                      />
                      {floorFiles[index][floorIndex] && (
                        <p>Выбран файл: {floorFiles[index][floorIndex].name}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Setting;
