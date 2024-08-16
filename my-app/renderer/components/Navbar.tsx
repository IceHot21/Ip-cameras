import { FC, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import NStyles from "../styles/Navbar.module.css";
import { BiPlay, BiCameraMovie, BiCamera, BiRepeat, BiLogOut, BiSolidHome  } from "react-icons/bi";

// Компонент MenuToggle для переключения между иконкой меню и крестиком
const MenuToggle = ({ toggle }) => (
  <button onClick={toggle} className={NStyles.menuToggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <motion.path
        strokeWidth="3"
        fill="transparent"
        stroke="hsl(0, 0%, 100%)"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
      />
      <motion.path
        d="M 2 9.423 L 20 9.423"
        strokeWidth="3"
        stroke="hsl(0, 0%, 100%)"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        transition={{ duration: 0.1 }}
      />
      <motion.path
        strokeWidth="3"
        stroke="hsl(0, 0%, 100%)"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
      />
    </svg>
  </button>
);

// Компонент для навигации, включающий пункты меню
const Navigation = ({ onMenuItemClick }) => {
  const menuItems = [
    { name: "Главная", action: "/Feeding/Feeding", icon: <BiSolidHome size={24} />},
    { name: "Трансляция", action: "/Translation/Translation", icon: <BiPlay size={24} /> },
    { name: "Видеоархив", action: "/Videoarchive/Videoarchive", icon: <BiCameraMovie size={24} /> },
    { name: "Фотоархив", action: "/Photoarchive/Photoarchive", icon: <BiCamera size={24} /> },
    { name: "Смена", action: "/LoginPage/LoginPage", icon: <BiRepeat size={24} /> },
  ];

  const router = useRouter();

  const handleClick = (action) => {
    onMenuItemClick();
    router.push(action);
  };

  return (
    <motion.ul
      className={NStyles.menuList}
      initial="closed"
      animate="open"
      exit="closed"
      variants={{
        open: {
          transition: { staggerChildren: 0.07, delayChildren: 0.2 }
        },
        closed: {
          transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
      }}
    >
      {menuItems.map((item, i) => (
        <motion.li
          key={i}
          className={NStyles.menuItem}
          onClick={() => handleClick(item.action)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={{
            open: {
              y: 0,
              opacity: 1,
              transition: {
                y: { stiffness: 1000, velocity: -100 }
              }
            },
            closed: {
              y: 50,
              opacity: 0,
              transition: {
                y: { stiffness: 1000 }
              }
            }
          }}
        >
          <span className={NStyles.menuIcon}>{item.icon}</span>
          <span className={NStyles.menuText}>{item.name}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
};

// Основной компонент Navbar
const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  // Функция для переключения состояния меню
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Логика выхода из системы
  const handleLogout = () => {
    // Здесь можно добавить логику выхода, например, очистку токена или вызов API
    console.log("Выход из системы");
    router.push("/login"); // Перенаправление на страницу входа
  };

  // Анимации для меню
  const sidebar = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: "circle(30px at 40px 40px)",
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  // Обработка закрытия меню при нажатии вне него
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [containerRef]);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={containerRef.current?.offsetHeight}
      ref={containerRef}
      className={NStyles.navbar}
    >
      {/* Анимация появления/исчезновения меню */}
      <AnimatePresence>
        {isOpen && <Navigation onMenuItemClick={toggleMenu} />}
      </AnimatePresence>

      {/* Кнопка для переключения состояния меню */}
      <MenuToggle toggle={toggleMenu} />

      {/* Кнопка выхода из системы */}
      <button onClick={handleLogout} className={NStyles.logoutButton}>
        <BiLogOut size={24} color="#fff" />
      </button>
    </motion.nav>
  );
};

export default Navbar;