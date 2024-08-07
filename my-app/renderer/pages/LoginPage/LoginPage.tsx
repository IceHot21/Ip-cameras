import { useRouter } from 'next/router';
import LPStyles from './LoginPage.module.css';
import Image from "next/image";
import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage: FC = () => {
  const router = useRouter();
  const [stage, setStage] = useState(0); // Управляет стадиями анимации

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
              exit={{ opacity: 0}}
              transition={{ duration: 1.5, ease: "easeOut" }}
              onAnimationComplete={handleLogoAnimationComplete}
            >
              <Image src="/Atislogo.png" width={350} height={60} alt="логотип" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === 2 && (
            <motion.div
              key="logoFadeOut"
              className={LPStyles.logoContainer}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              onAnimationComplete={handleLogoFadeOutComplete}
            />
          )}
        </AnimatePresence>

        {stage === 3 && (
          <motion.div
            className={LPStyles.formContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              className={LPStyles.logoContainer}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <Image src="/Atislogo.png" width={350} height={60} alt="логотип" />
            </motion.div>
            <div className={LPStyles.loginPageBody}>
              <form>
                <div className={LPStyles.users}>
                  <div className={LPStyles.userLogin}>
                    <motion.input
                      type="text"
                      whileFocus={{ scale: 1.05 }}
                    />
                    <label>Введите ФИО</label>
                  </div>
                  <div className={LPStyles.userPassword}>
                    <motion.input
                      type="password"
                      whileFocus={{ scale: 1.05 }}
                    />
                    <label>Введите пароль</label>
                  </div>
                </div>
              </form>
              <motion.button
                type="button"
                onClick={validateFrom}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Вход
              </motion.button>
              <motion.button
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
