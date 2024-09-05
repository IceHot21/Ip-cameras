import { FC, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import NStyles from "../styles/Navbar.module.css";
import { BiPlay, BiCameraMovie, BiCamera, BiRepeat, BiLogOut, BiSolidHome, BiAccessibility, BiX } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";


type Tab = {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
};

const MenuToggle = ({ toggle }) => (
  <button onClick={toggle} className={NStyles.menuToggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <motion.path
        strokeWidth="3"
        fill="transparent"
        stroke="hsl(0, 0%, 20%)"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
      />
      <motion.path
        d="M 2 9.423 L 20 9.423"
        strokeWidth="3"
        stroke="hsl(0, 0%, 20%)"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        transition={{ duration: 0.1 }}
      />
      <motion.path
        strokeWidth="3"
        stroke="hsl(0, 0%, 20%)"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
      />
    </svg>
  </button>
);

const Navigation = ({ onMenuItemClick }) => {
  const menuItems = [
    { name: "Главная", action: "/Home/Home", icon: <BiSolidHome size={24} /> },
    { name: "Схема здания", action: "/Feeding/Feeding", icon: <BiAccessibility size={24} /> },
    { name: "Видеоархив", action: "/Videoarchive/Videoarchive", icon: <BiCameraMovie size={24} /> },
    { name: "Фотоархив", action: "/Photoarchive/Photoarchive", icon: <BiCamera size={24} /> },
    { name: "Регистрация", action: "/LoginPage/LoginPage", icon: <BiRepeat size={24} /> },
    { name: "Настройки", action: "/Setting/Setting", icon: <IoIosSettings size={24} /> },
  ];

  /*   const router = useRouter();
  
    const handleClick = (action) => {
      onMenuItemClick();
      router.push(action);
    }; */

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
          onClick={() => onMenuItemClick(item)}
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

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const containerRef = useRef(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (item) => {
    const exitingTab = tabs.find((tab) => tab.path === item.action);
    if (exitingTab) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === exitingTab.id ? { ...tab, isActive: true } : { ...tab, isActive: false }
        )
      );
    } else {
      const newTab: Tab = {
        id: String(new Date().getTime()),
        name: item.name,
        path: item.action,
        isActive: true,
      };
      setTabs((prevTabs) =>
        prevTabs.map((tab) => ({ ...tab, isActive: false })).concat(newTab)
      );
    }
    router.push(item.action);
    toggleMenu();
  }

  const handleTabClose = (id) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
  };

  const handleTabClick = (id, path) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, isActive: true } : { ...tab, isActive: false }
      )
    );
    router.push(path);
  }
  //TODO: доделать выход из системы
  const handleLogout = () => {
    console.log("Выход из системы");
    router.push("/login");
  };

  /*   const sidebar = {
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
   */
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
      <AnimatePresence>
        {isOpen && <Navigation onMenuItemClick={handleMenuItemClick} />}
      </AnimatePresence>

      <MenuToggle toggle={toggleMenu} />
      <div className={NStyles.tabsContainer}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${NStyles.tab} ${tab.isActive ? NStyles.activeTab : ''}`}
            onClick={() => handleTabClick(tab.id, tab.path)}
          >
            <span>{tab.name}</span>
            <button className={NStyles.closeTab} onClick={() => handleTabClose(tab.id)}><BiX /></button>
          </div>
        ))}
      </div>

      <button onClick={() => router.push("/login")} className={NStyles.logoutButton}><BiX /></button>
    </motion.nav>
  );
};

export default Navbar;