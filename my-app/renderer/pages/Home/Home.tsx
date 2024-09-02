import { FC } from "react";
import HStyles from "./Home.module.css";
import { BsBuildingFill } from "react-icons/bs";

const Home:FC = () => {

    return (
        <div className={HStyles.homeContainer}>
            <BsBuildingFill />
        </div>
    );
}
export default Home;