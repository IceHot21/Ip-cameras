import { FC } from "react"
import TStyles from "./Transletion.module.css"
import { pisya } from "../api/auth";

const Translation:FC = () => {
  const handleLogin = async () => {
    try {
      const data = await pisya();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}></button>
        <div className={TStyles.canvasesContainer}></div>
    </div>
  )
}

export default Translation

