import { useRouter } from 'next/router';
import LPStyles from './LoginPage.module.css';
import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Box, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AtisLogo from '../../components/AtisLogo';
import { login } from '../api/auth';

const LoginPage: FC = () => {
  const router = useRouter();
  const [stage, setStage] = useState(0); // Управляет стадиями анимации
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validateFrom = () => {
    // Логика валидации
  };

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      // Перенаправление на защищенную страницу
      router.push('/Home/Home');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const guestButt = () => {
    router.push('/Home/Home');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    if (stage === 0) {
      setStage(1);
    }
  }, [stage]);

  const handleLogoAnimationComplete = () => {
    if (stage === 1) {
      setStage(2); // Переход на стадию исчезновения
    }
  };

  const handleLogoFadeOutComplete = () => {
    setStage(3); // Переход к стадии показа формы
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className={LPStyles.Container}>
      <motion.div className={LPStyles.LoginPageBox}>
        <AnimatePresence>
          {stage === 1 && (
            <motion.div
              key="logo"
              className={LPStyles.logoContainer1}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
              onAnimationComplete={handleLogoAnimationComplete}
            >
              <AtisLogo />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === 2 && (
            <motion.div
              key="logoFadeOut"
              className={LPStyles.logoContainer1}
              initial={false} // Начинаем анимацию с текущего состояния
              animate={{ opacity: 0, scale: 0.8 }} // Исчезновение
              transition={{ duration: 1.5, ease: "easeOut" }}
              onAnimationComplete={handleLogoFadeOutComplete}
            >
              <AtisLogo />
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 3 && (
          <motion.div
            className={LPStyles.formContainer}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <motion.div
              className={LPStyles.logoContainer2}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <AtisLogo />
            </motion.div>
            <div className={LPStyles.loginPageBody}>
              <form>
                <div className={LPStyles.users}>
                <FormControl sx={{ m: 1, width: 'auto ',
                        '& .MuiInput-underline:after': {
                          borderBottomColor: isFocused ? 'green' : 'inherit',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: isFocused ? 'green' : 'inherit',
                        },
                        '& .MuiInputBase-input': {
                          color: isFocused ? 'black' : 'inherit',
                        },
                      }} 
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Введите пароль</InputLabel>
                    <Input
                      id="standard-adornment-password"
                      type= 'text'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 'auto ',
                        '& .MuiInput-underline:after': {
                          borderBottomColor: isFocused ? 'green' : 'inherit',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: isFocused ? 'green' : 'inherit',
                        },
                        '& .MuiInputBase-input': {
                          color: isFocused ? 'black' : 'inherit',
                        },
                      }} 
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Введите пароль</InputLabel>
                    <Input
                      id="standard-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </div>
              </form>
              <div className={LPStyles.Buttons}>
                <motion.button
                  className={LPStyles.button1}
                  type="button"
                  onClick={handleLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Вход
                </motion.button>
                <motion.button
                  className={LPStyles.button2}
                  type="button"
                  onClick={guestButt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Войти как гость
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
