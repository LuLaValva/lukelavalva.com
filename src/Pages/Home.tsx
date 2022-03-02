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
        <BoxInSky width={23} left={30} top={60}>
          My Resume
        </BoxInSky>
      </a>
      <Link to="/albums" className={styles.boxLink}>
        <BoxInSky width={20} left={135} top={50}>
          My opinions about a bunch of albums
        </BoxInSky>
      </Link>
      <Link to="/greedygorillas" className={styles.boxLink}>
        <BoxInSky width={20} left={212} top={30}>
          Greedy Gorillas Game
        </BoxInSky>
      </Link>
      <BoxInSky width={15} left={80} top={5}>
        Software Engineer
      </BoxInSky>
      <BoxInSky width={21} left={95} top={80}>
        Mathematician
      </BoxInSky>
      <BoxInSky width={18} left={170} top={40}>
        Full Stack Developer
      </BoxInSky>
      <BoxInSky width={23} left={255} top={60}>
        Frequent Rock Climber
      </BoxInSky>
      <BoxInSky width={30} left={290} top={12}>
        Sociologist
      </BoxInSky>
      <BoxInSky width={14} left={385} top={44}>
        Constant Learner
      </BoxInSky>
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
