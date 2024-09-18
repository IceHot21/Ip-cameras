import { FC, useEffect, useState } from 'react';
import RPStyles from './Registration.module.css';
import { IconButton, InputAdornment, MenuItem, Select, TextField, Tabs, Tab } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { fetchWithRetry } from '../../refreshToken';


interface RegistrationProps {
    navigate: (path: string) => Promise<boolean>;
    users: User[];
    fetchUsers: () => void;
}

interface User {
    name: string;
    roles: string[];
}

interface TokenPayload {
    sub: string;
    name: string;
    roles: string[];
    iat: number;
}

const Registration: FC<RegistrationProps> = ({ navigate, users, fetchUsers }) => {
    const levelMock = ['Админ', 'Пользователь'];
    const levelMapping = {
        'Админ': 'ADMIN',
        'Пользователь': 'USER'
    };
    console.log("users", users);

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

        if (users.some((user) => user.name === userName)) {
            toast.error('Пользователь с таким именем уже существует');
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
                fetchUsers();
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
                <button type="submit" className={RPStyles.submitButton}>Зарегистрировать</button>
            </form>
        </div>
    );
};

const DeleteUser: FC<RegistrationProps> = ({ navigate, users, fetchUsers }) => {
    const [selectedUser, setSelectedUser] = useState<string>('Выберете пользователя');



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (selectedUser === null) {
            toast.dismiss();
            toast.error('Пожалуйста, выберете пользователя для удаления', {
                toastId: 'userDeleteErrorToast', 
            });
            return;
        }
        let currentUser = localStorage.getItem('username')
        let userLevel = users.find((user) => user.name === currentUser)?.roles[0];
        let selectedUserLevel = users.find((user) => user.name === selectedUser)?.roles[0];

        if (userLevel !== 'ADMIN' || selectedUserLevel === 'ADMIN') {
            toast.dismiss();
            toast.error("У вас мало прав!", {
                toastId: 'userLevelErrorToast', // Уникальный ID для toast-а
            });
            return;
        }

        if (selectedUser === currentUser) {
            toast.dismiss();
            toast.error('Вы пытаетесь удалить себя!', {
                toastId: 'userDeleteErrorToast', 
            });
            return;
        }


        fetchWithRetry('https://192.168.0.144:4200/users/delete', 'DELETE', {
            name: selectedUser
        }, navigate)
            .then(() => {
                setSelectedUser('Выберете пользователя');
                toast.success('Пользователь удален');
                fetchUsers();
            })
            .catch((error) => {
                toast.error('Ошибка при удалении пользователя');
                console.error(error);
            });
    };



    return (
        <div className={RPStyles.mainContainer}>
            <form onSubmit={handleSubmit} className={RPStyles.regContainer}>
                <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} color="success">
                    <MenuItem value='Выберете пользователя'>Выберете пользователя</MenuItem>
                    {users.map((user, index) => (
                        <MenuItem key={index} value={user.name}>
                            {user.name}
                        </MenuItem>
                    ))}
                </Select>
                <button type="submit" className={RPStyles.submitButton}>Удалить пользователя</button>
            </form>
        </div>
    );
};

const UserManagement: FC<RegistrationProps> = ({ navigate }) => {
    const [value, setValue] = useState(0);
    const [users, setUsers] = useState<User[]>([]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const fetchUsers = async () => {
        await fetchWithRetry('https://192.168.0.144:4200/users', 'GET', {}, navigate)
            .then((response: User[]) => {
                const filteredUsers = response.map(({ name, roles }) => ({ name, roles }));
                setUsers(filteredUsers);
            })
            .catch((error) => {
                console.error('Ошибка при получении списка пользователей:', error);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div className={RPStyles.mainContainer}>
            <Tabs value={value} onChange={handleChange} aria-label="user management tabs"
                sx={{
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'rgb(0, 108, 42)',
                    },
                    '& .Mui-selected': {
                        color: 'rgb(0, 108, 42) !important',
                    }
                }}>
                <Tab label="Регистрация" />
                <Tab label="Удаление пользователей" />
            </Tabs>
            {value === 0 && <Registration navigate={navigate} users={users} fetchUsers={fetchUsers} />}
            {value === 1 && <DeleteUser navigate={navigate} users={users} fetchUsers={fetchUsers} />}
        </div>
    );
};

export default UserManagement;