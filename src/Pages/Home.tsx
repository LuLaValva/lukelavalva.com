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

  function handleWheel(e: React.WheelEvent<HTMLElement>) {
    e.currentTarget.scrollBy({ left: e.deltaY });
  }

  return (
    <div className={styles.sky} onScroll={handleScroll} onWheel={handleWheel}>
      <Cloud width={30} left={10} top={4}>
        Luke LaValva
      </Cloud>
      <Cloud width={20} left={40} top={15}>
        <Link to="/albums">Albums thing</Link>
      </Cloud>
      <Cloud width={24} left={800} top={0}>
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
