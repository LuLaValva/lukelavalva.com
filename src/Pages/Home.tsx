import React from "react";
import { useState } from "react";
import styles from "../styles/App.module.css";
import BoxInSky from "../Elements/BoxInSky";
import BoxLink from "../Elements/BoxLink";
import RunawayBox from "../Elements/RunawayBox";

const Home = () => {
  const [left, setLeft] = useState(0);

  function handleScroll(e: React.UIEvent<HTMLElement>) {
    setLeft(e.currentTarget.scrollLeft);
  }

  function handleWheel(e: React.WheelEvent<HTMLElement>) {
    if (e.deltaX === 0) e.currentTarget.scrollBy({ left: e.deltaY });
  }

  return (
    <div className={styles.sky} onScroll={handleScroll} onWheel={handleWheel}>
      <BoxInSky width={9} left={5} top={4} size={3}>
        Luke LaValva
      </BoxInSky>
      <a href="/resume.pdf" className={styles.boxLink}>
        <BoxInSky width={14} left={2} top={57} size={0.9}>
          My Resume
        </BoxInSky>
      </a>
      <BoxLink to="/cowsandbulls" width={20} left={47} top={60} size={1.4}>
        Cows, Bulls, and Beyond
      </BoxLink>
      <BoxLink to="/webchillian" width={22} left={71} top={15} size={1.1}>
        The Webchillian
      </BoxLink>
      <BoxLink to="/greedygorillas" width={13} left={106} top={35} size={0.8}>
        Greedy Gorillas
      </BoxLink>
      <BoxLink to="/slide" width={20} left={113} top={7} size={1}>
        Face Slide
      </BoxLink>
      <BoxLink to="/theoryofsliding" width={14} left={121} top={19} size={1.6}>
        Theory of Sliding
      </BoxLink>
      <BoxLink to="/countdown" width={16} left={152} top={68} size={1.05}>
        Countdown Generator
      </BoxLink>
      <BoxLink to="/albums" width={21} left={168} top={53} size={0.8}>
        My opinions about a bunch of albums
      </BoxLink>
      <RunawayBox width={11} left={172} top={14} size={0.75}>
        Super Secret Information
      </RunawayBox>
      <BoxLink to="/wordle" width={13} left={197} top={62} size={0.9}>
        Wordle Clone
      </BoxLink>
      <BoxLink to="/444dle" width={9} left={206} top={46} size={1.3}>
        444dle
      </BoxLink>
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
