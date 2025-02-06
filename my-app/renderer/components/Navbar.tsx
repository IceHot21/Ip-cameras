import { FC, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import NStyles from "../styles/Navbar.module.css";
import { BiCameraMovie, BiCamera, BiRepeat, BiSolidHome, BiX, BiHome, BiCarousel } from "react-icons/bi";
import { MdAppRegistration, MdOutlineCameraOutdoor } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

type Tab = {
  id: string;
  name: string;
  icon: any;
  path: string;
  isActive: boolean;
  isPinned?: boolean;
};

const HomeTab: Tab = {
  id: 'home',
  name: 'Главная',
  icon: <i className="bi bi-house-door" style={{fontSize: '24px'}}></i>,
  path: '/Home/Home',
  isActive: true,
  isPinned: true,
};

const initialTabs = [HomeTab];

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
    { name: "Главная", action: "/Home/Home", icon: <i className="bi bi-house-door" style={{fontSize: '24px'}}></i> },
    { name: "Схема здания", action: "/Feeding/Feeding", icon: <i className="bi bi-building" style={{fontSize: '24px'}}></i> },
    { name: "Видеоархив", action: "/Videoarchive/Videoarchive", icon: <i className="bi bi-camera-reels" style={{fontSize: '24px'}}></i> },
    { name: "Фотоархив", action: "/Setting/Setting", icon: <i className="bi bi-camera" style={{fontSize: '24px'}}></i> },
    { name: "Перезагрузка", action: "/LoginPage/LoginPage", icon: <i className="bi bi-arrow-repeat" style={{fontSize: '24px'}}></i> },
  ];

  return (
    <motion.ul
      className={NStyles.menuList}
      initial="closed"
      animate="open"
      exit="closed"
      variants={{
        open: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.07, delayChildren: 0.2, duration: 1.3, ease: "easeOut", }
        },
        closed: {
          opacity: 0,
          y: 0,
          transition: { staggerChildren: 0.05, staggerDirection: -1, duration: 0.3, ease: "easeIn",}
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
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const containerRef = useRef(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (item) => {
    const existingTab = tabs.find((tab) => tab.path === item.action);

    if (existingTab) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === existingTab.id ? { ...tab, isActive: true } : { ...tab, isActive: false }
        )
      );
    } else {
      const newTab: Tab = {
        id: String(new Date().getTime()),
        name: item.name,
        icon: item.icon,
        path: item.action,
        isActive: true,
        isPinned: false,
      };
      setTabs((prevTabs) =>
        prevTabs.map((tab) => ({ ...tab, isActive: false })).concat(newTab)
      );
    }
    router.push(item.action);
    toggleMenu();
  };

  const handleTabClose = (id) => {
    const tabToClose = tabs.find((tab) => tab.id === id);
    
    if (tabToClose && tabToClose.isActive) {
      const nextTab = tabs.find((tab) => !tab.isPinned && tab.id !== id); 

      if (nextTab) {
        router.push(nextTab.path);
        setTabs((prevTabs) =>
          prevTabs
            .filter((tab) => tab.id !== id)
            .map((tab) => tab.id === nextTab.id ? { ...tab, isActive: true } : { ...tab, isActive: false })
        );
      } else {
        router.push(HomeTab.path);
        setTabs([HomeTab]);
      }
    } else {
      setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    }
  };

  const handleTabClick = (id, path) => {
    const activeTab = tabs.find((tab) => tab.isActive);

    if (activeTab?.id === id) return;

    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, isActive: true } : { ...tab, isActive: false }
      )
    );
    router.push(path);
  };

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

  useEffect(() => {
    const currentPath = router.pathname;
    const currentTab = tabs.find((tab) => tab.path === currentPath);

    if (currentTab) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === currentTab.id ? { ...tab, isActive: true } : { ...tab, isActive: false }
        )
      );
    }
  }, [router.pathname]);

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
            className={`${NStyles.tab} ${tab.path === router.pathname ? NStyles.activeTab : ''}`}
            onClick={() => handleTabClick(tab.id, tab.path)}
          >
            <span className={NStyles.spanContainer}>{tab.icon}{tab.name}</span>
            {!tab.isPinned && (
              <button className={NStyles.closeTab} onClick={() => handleTabClose(tab.id)}><BiX /></button>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => window.ipc.closeWindow()} className={NStyles.logoutButton}> <i className="bi bi-x" style={{fontSize: '25px'}}></i></button>
    </motion.nav>
  );
};

export default Navbar;