
import styles from './HomePage.module.css';
import ChooseSide from "../../components/HomePage/ChooseSide";

const HomePage = () => {
    return (
        <>
            <h1 className="header__text">CHOOSE YOUR SIDE</h1>
            <ChooseSide />
        </>
    )
}

export default HomePage;
