import React from "react";
import styles from "../../styles/AcademicPaper.module.css";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";

// import "katex/dist/katex.min.css";
// import TeX from "@matejmazur/react-katex";

const SlidePuzzlePaper = () => {
  return (
    <div className={styles.paper}>
      <h1>Optimal Slide Puzzle Solutions</h1>
      <InteractiveSlidePuzzle dimensions={[3, 3]} squareSize={10} />
      <div className={styles.paragraph}>
        This puzzle almost needs no introduction. Everybody loves slide puzzles!
        Today I'm going to talk about these puzzles mathematically, and together
        we will discover effective ways of solving them quickly.
      </div>
    </div>
  );
};

export default SlidePuzzlePaper;
