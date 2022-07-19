import React from "react";
import { Link } from "react-router-dom";
import styles from "../AcademicPaper.module.css";
import Bibliography, { Citation } from "../Bibliography";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import ManualSlideGraphGenerator from "./ManualSlideGraphGenerator";

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

const sectionBreak = <div className={styles.sectionBreak} />;

const references: { [key: string]: Citation } = {
  kim19: {
    title: "Blog: Solving the 15 Puzzle",
    authors: ["Michael Kim"],
    year: 2019,
    url: "https://michael.kim/blog/puzzle",
  },
  johnson79: {
    title: 'Notes on the "15" Puzzle',
    authors: ["Wm. Wooley Johnson", "William E. Story"],
    year: 1879,
    published: "American Journal of Mathematics, 2 (4): 397-404",
    url: "https://doi.org/10.2307%2F2369492",
  },
};

const SlidePuzzlePaper = () => {
  return (
    <div className={styles.paper}>
      <h1>Theory of Sliding</h1>
      <h3>
        Finding truths about sliding puzzles using Graph Theory and Group Theory
      </h3>

      <InteractiveSlidePuzzle
        dimensions={[3, 3]}
        squareSize={10}
        shuffleImmediately
      />

      <div className={styles.paragraph}>
        This puzzle almost needs no introduction. Everybody loves sliding
        puzzles! Today I'm going to talk about these puzzles mathematically, and
        together we will discover effective ways of solving them quickly. Before
        you move ahead, please feel free to meddle with the 3x3 puzzle above
        until it has returned to sequential order.
      </div>

      {sectionBreak}

      <h2>The State Graph</h2>

      <div className={styles.paragraph}>
        Before discussing any approaches for quickly solving sliding puzzles, I
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

      <h2>Puzzle Solvability</h2>

      <div className={styles.paragraph}>
        Readers who are keen on combinatorics may have noticed something
        peculiar about the size of the graph for the 2x2 puzzle. Before the
        restrictions of a sliding puzzle are analyzed with keen eyes, it is easy
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

      <div className={styles.paragraph}>
        As it turns out, this is true for <i>all</i> sliding puzzles. Thus, for
        any board with <TeX>m</TeX> rows and <TeX>n</TeX> columns, the number of
        reachable states is
        <TeX block math="\frac{(mn)!}{2}." />
        To understand why half of all sliding puzzles are unsolvable, we can
        refer to an argument made{" "}
        <a href={references.johnson79.url} target="_blank" rel="noreferrer">
          back in 1879
        </a>{" "}
        by Wm. Woolsey Johnson and its generalization by his colleague, William
        E. Story.
      </div>

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
