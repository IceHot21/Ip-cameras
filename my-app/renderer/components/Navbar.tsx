import { FC } from "react"
import NStyles from "../styles/Navbar.module.css"
import { useRouter } from "next/router";

const Navbar:FC = () => {
const router = useRouter();

  const translation = () => {
    router.push("/Translation/Translation");
  }
  
  const video = () => {
    router.push("/Videoarchive/Videoarchive");
  }

  const photo = () => {
    router.push("/Photoarchive/Photoarchive");
  }

  const change = () => {
    router.push("/LoginPage/LoginPage");
  }

  return (
    <nav>
      <div className="NStyles.menuContainer">
        <i className="bi bi-list"></i>
        <i className="bi bi-x-lg"></i>
      </div>
      <div className="NStyles.menuListAll">
        <button className="bi bi-display" onClick={translation}>Трансляция</button>
        <button className="bi bi-camera-video" onClick={video}>Видео</button>
        <button className="bi bi-camera" onClick={photo}>Фото</button>
        <button className="bi bi-repeat" onClick={change}>Смена</button>
      </div>
    </nav>
  );
};

export default Navbar;
