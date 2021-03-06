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
      <BoxInSky width={25} left={5} top={4}>
        <h1>Luke LaValva</h1>
      </BoxInSky>
      <a href="/resume.pdf" className={styles.boxLink}>
        <BoxInSky width={23} left={30} top={30}>
          My Resume
        </BoxInSky>
      </a>
      <Link to="/cowsandbulls" className={styles.boxLink}>
        <BoxInSky width={20} left={67} top={60}>
          Cows, Bulls, and Beyond
        </BoxInSky>
      </Link>
      <Link to="/greedygorillas" className={styles.boxLink}>
        <BoxInSky width={20} left={85} top={35}>
          Greedy Gorillas Game
        </BoxInSky>
      </Link>
      <Link to="/slide" className={styles.boxLink}>
        <BoxInSky width={20} left={133} top={10}>
          Face Slide
        </BoxInSky>
      </Link>
      <Link to="/theoryofsliding" className={styles.boxLink}>
        <BoxInSky width={24} left={141} top={23}>
          Theory of Sliding
        </BoxInSky>
      </Link>
      <Link to="/webchillian" className={styles.boxLink}>
        <BoxInSky width={22} left={116} top={55}>
          The Webchillian
        </BoxInSky>
      </Link>
      <Link to="/albums" className={styles.boxLink}>
        <BoxInSky width={27} left={202} top={33}>
          My opinions about a bunch of albums
        </BoxInSky>
      </Link>
      <Link to="/countdown" className={styles.boxLink}>
        <BoxInSky width={16} left={181} top={66}>
          Countdown Generator
        </BoxInSky>
      </Link>
      <Link to="/wordle" className={styles.boxLink}>
        <BoxInSky width={13} left={273} top={22}>
          Wordle Clone
        </BoxInSky>
      </Link>
      <BoxInSky width={24} left={3400} top={2}>
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
