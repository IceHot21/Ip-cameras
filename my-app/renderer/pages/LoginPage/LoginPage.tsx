import { useRouter } from 'next/router';
import LPStyles from './LoginPage.module.css';
import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Box, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'
import AtisLogo from '../../components/AtisLogo';

const LoginPage: FC = () => {
  const router = useRouter();
  const [stage, setStage] = useState(0); // Управляет стадиями анимации
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validateFrom = () => {
    // Логика валидации
  };

  const guestButt = () => {
    router.push('/Translation/Translation');
  };

  useEffect(() => {
    if (stage === 0) {
      setStage(1);
    }
  }, [stage]);

  const handleLogoAnimationComplete = () => {
    if (stage === 1) {
      setStage(2); // Переход на стадию исчезновения логотипа
    }
  };

  const handleLogoFadeOutComplete = () => {
    setStage(3); // Переход к стадии показа формы
  };

  return (
    <div className={LPStyles.Container}>
      <motion.div className={LPStyles.LoginPageBox}>
        <AnimatePresence>
          {stage === 1 && (
            <motion.div
              key="logo"
              className={LPStyles.logoContainer}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.7, ease: "easeOut" }}
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
              className={LPStyles.logoContainer}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.8 }} // Анимация исчезновения с уменьшением масштаба
              transition={{ delay: 0.7, duration: 1.5, ease: "easeOut" }}
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
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              className={LPStyles.logoContainer}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <AtisLogo />
            </motion.div>
            <div className={LPStyles.loginPageBody}>
              <form>
                <div className={LPStyles.users}>
                  <Box className={LPStyles.loginText} sx={{ m: 1, width: 'auto !important' }}>
                    <TextField
                      id="input-with-sx"
                      label="Введите ФИО"
                      variant="standard"
                      sx={{
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
                    />
                  </Box>

                  <Box className={LPStyles.passwordText} sx={{ m: 1, width: 'auto !important' }}>
                    <TextField
                      id="password-input"
                      label="Введите пароль"
                      type={showPassword ? 'text' : 'password'}
                      variant="standard"
                      sx={{
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
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                              sx={{
                                marginRight: '-12px', // Дополнительный отступ для выравнивания
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </div>
              </form>
              <motion.button
                className={LPStyles.button}
                type="button"
                onClick={validateFrom}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Вход
              </motion.button>
              <motion.button
                className={LPStyles.button}
                type="button"
                onClick={guestButt}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Войти как гость
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;