import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/App.module.css";
import BoxInSky from "../Elements/BoxInSky";

interface Props {}

const Home = (props: Props) => {
  const [left, setLeft] = useState(0);

  function handleScroll(e: React.UIEvent<HTMLElement>) {
    setLeft(e.currentTarget.scrollLeft);
  }

  function handleWheel(e: React.WheelEvent<HTMLElement>) {
    if (e.deltaX === 0) e.currentTarget.scrollBy({ left: e.deltaY });
  }

  return (
    <div className={styles.sky} onScroll={handleScroll} onWheel={handleWheel}>
      <BoxInSky width={30} left={10} top={4}>
        <h1>Luke LaValva</h1>
      </BoxInSky>
      <BoxInSky width={20} left={40} top={50}>
        <Link to="/albums">My opinion about a bunch of albums</Link>
      </BoxInSky>
      <BoxInSky width={24} left={800} top={2}>
        Haha you made it to the end
      </BoxInSky>
      <img
        src="me_circle.gif"
        className={styles.rollingPicture}
        alt="My face"
        style={{
          transform: `rotate(${left}deg)`,
          left: `${8 + Math.sin(left / 506) * 3 + Math.sin(335) * 2}%`,
        }}
      />
    </div>
  );
};

export default Home;
