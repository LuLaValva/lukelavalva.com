import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/App.module.css";
import Cloud from "../Elements/Cloud";

interface Props {}

const Home = (props: Props) => {
  const [left, setLeft] = useState(0);

  function handleScroll(e: React.UIEvent<HTMLElement>) {
    setLeft(e.currentTarget.scrollLeft);
  }

  return (
    <div className={styles.sky} onScroll={handleScroll}>
      <Cloud x={30} y={15} left={10} top={4}>
        Luke LaValva
      </Cloud>
      <Cloud x={20} y={10} left={40} top={15}>
        <Link to="/albums">Albums thing</Link>
      </Cloud>
      <Cloud x={24} y={12} left={800} top={0}>
        Haha you made it to the end
      </Cloud>
      <img
        src="me_circle.gif"
        className={styles.rollingPicture}
        alt="My face"
        style={{ transform: `rotate(${left}deg)` }}
      />
    </div>
  );
};

export default Home;
