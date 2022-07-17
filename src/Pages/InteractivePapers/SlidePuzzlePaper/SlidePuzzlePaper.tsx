import React from "react";
import { Link } from "react-router-dom";
import styles from "../AcademicPaper.module.css";
import Bibliography from "../Bibliography";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import ManualSlideGraphGenerator from "./ManualSlideGraphGenerator";

// import "katex/dist/katex.min.css";
// import TeX from "@matejmazur/react-katex";

const sectionBreak = <div className={styles.sectionBreak} />;

const references = {
  kim19: {
    title: "Blog: Solving the 15 Puzzle",
    authors: ["Michael Kim"],
    year: 2019,
    url: "https://michael.kim/blog/puzzle",
  },
};

const SlidePuzzlePaper = () => {
  return (
    <div className={styles.paper}>
      <h1>Optimal Slide Puzzle Solutions</h1>

      <InteractiveSlidePuzzle
        dimensions={[3, 3]}
        squareSize={10}
        shuffleImmediately
      />

      <div className={styles.paragraph}>
        This puzzle almost needs no introduction. Everybody loves slide puzzles!
        Today I'm going to talk about these puzzles mathematically, and together
        we will discover effective ways of solving them quickly.
      </div>

      <ManualSlideGraphGenerator
        dimensions={[2, 2]}
        squareSize={10}
        includeShuffle
      />

      {sectionBreak}

      <Bibliography citations={references} />

      {sectionBreak}

      <div className={styles.aside} style={{ textAlign: "center" }}>
        For more shenanigans, check out <Link to="/">my website</Link>.
      </div>
    </div>
  );
};

export default SlidePuzzlePaper;
