import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/App.module.css";

interface Props {}

const Home = (props: Props) => {
  const [left, setLeft] = useState(0);

  function handleScroll(e: React.UIEvent<HTMLElement>) {
    setLeft(e.currentTarget.scrollLeft);
  }

  return (
    <div className={styles.sky} onScroll={handleScroll}>
      <div className={styles.horizontalPage}>
        <Link to="/albums">Albums thing</Link>
      </div>
      <div className={styles.horizontalPage}>Testing</div>
      <div className={styles.horizontalPage}></div>
      <div className={styles.horizontalPage}></div>
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
