import { FC, useState } from 'react';
import RPStyles from './Registration.module.css';
import { IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { fetchWithRetry } from '../../refreshToken';

interface RegistrationProps {
    navigate: (path: string) => Promise<boolean>;
}

const Registration: FC<RegistrationProps> = ({ navigate }) => {
    const levelMock = ['Админ', 'Пользователь'];
    const levelMapping = {
        'Админ': 'ADMIN',
        'Пользователь': 'USER'
    };

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [level, setLevel] = useState('Выберете уровень');

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    const handleClickShowPassword = () => setShowPassword((showPassword) => !showPassword);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (userName === '' || password === '' || level === 'Выберете уровень') {
            toast.error('Заполните все поля');
            return;
        }

        const serverLevel = levelMapping[level as keyof typeof levelMapping];
        console.log({ userName, password, level: serverLevel });

        fetchWithRetry('https://192.168.0.144:4200/users/register', 'POST', {
            name: userName,
            password: password,
            roles: [serverLevel]
        }, navigate)
        .then(() => {
            setUserName('');
            setPassword('');
            setLevel('Выберете уровень');
            toast.success('Пользователь зарегистрирован');
        })
        .catch((error) => {
            toast.error('Ошибка при регистрации');
            console.error(error);
        });
    };

    return (
        <div className={RPStyles.mainContainer}>
            <form onSubmit={handleSubmit} className={RPStyles.regContainer}>
                <TextField 
                    value={userName} 
                    onChange={handleUserNameChange} 
                    label="Имя пользователя" 
                    color="success" 
                />
                <TextField
                    color="success"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    label="Пароль"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Select 
                    value={level} 
                    onChange={(e) => setLevel(e.target.value)} 
                    color="success"
                >
                    <MenuItem value='Выберете уровень'>Выберете уровень доступа</MenuItem>
                    {levelMock.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
                <button type="submit" className={RPStyles.submitButton}>Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Registration;