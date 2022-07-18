import React from "react";
import { Link } from "react-router-dom";
import styles from "../AcademicPaper.module.css";
import Bibliography from "../Bibliography";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import ManualSlideGraphGenerator from "./ManualSlideGraphGenerator";

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

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

      {sectionBreak}

      <div className={styles.paragraph}>
        Before discussing any approaches for quickly solving slide puzzles, I
        would like to introduce you to a mathematically comprehensive
        representation. Suppose that we attribute each state of the puzzle to a
        single node in a graph that consists of all possible states. Then each
        of the possible moves from these states can be associated with an edge
        that connects two states together.
      </div>

      <div className={styles.paragraph}>
        For <i>very</i> small puzzles, this graph is small enough that it is
        easy to generate quickly and understand at a glance. For example, please
        play around with this 2x2 puzzle. Within 12 moves, you'll be able to
        visit all possible states of the puzzle and complete its graphical
        representation.
      </div>

      <ManualSlideGraphGenerator dimensions={[2, 2]} squareSize={10} />

      <div className={styles.paragraph}>
        However, the graphs for most puzzles are not nearly as comprehensible.
        After only one additional column has been added to the previous puzzle,
        the graph increases in size by a considerable amount. After a few
        shuffles of this 2x3 puzzle, the network of discovered states blows the
        2x2 graph out of the water.
      </div>

      <ManualSlideGraphGenerator
        dimensions={[2, 3]}
        squareSize={10}
        includeShuffle
      />

      {sectionBreak}

      <div className={styles.paragraph}>
        Readers who are keen on combinatorics may have noticed something
        peculiar about the size of the graph for the 2x2 puzzle. Before the
        restrictions of a slide puzzle are analyzed with keen eyes, it is easy
        to suppose that the number of nodes in the graph is the same as the
        number of possible permutations of 4 digits. Then the number of possible
        board states should be
        <TeX block>4!=4\cdot3\cdot2\cdot1=24.</TeX>
        However, this is not the case. In fact, the actual number of possible
        states for this puzzle is exactly <i>half</i> of the number of possible
        permutations. This is because 50% of board states are actually entirely
        unreachable. No matter the number of moves, it is impossible to reach a
        solution from the following board:
      </div>

      <InteractiveSlidePuzzle
        dimensions={[2, 2]}
        boardState={[
          [2, 1],
          [3, 0],
        ]}
        squareSize={10}
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
