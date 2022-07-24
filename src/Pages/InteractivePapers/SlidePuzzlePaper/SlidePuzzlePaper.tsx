import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../AcademicPaper.module.css";
import Bibliography, { Citation } from "../Bibliography";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import ManualSlideGraphGenerator from "./ManualSlideGraphGenerator";

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import SlidePuzzleWithGroups from "./SlidePuzzleWithGroups";
import { SlidePuzzle } from "./SlidePuzzleDisplay";
import { getCycle } from "./SlidePuzzleUtilities";

const sectionBreak = <div className={styles.sectionBreak} />;
const P: React.FC<{ children?: React.ReactNode }> = (props) => (
  <div className={styles.paragraph}>{props.children}</div>
);

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
  const [permutationPuzzle, setPermutationPuzzle] = useState<SlidePuzzle>([]);
  const permutation = useMemo(
    () => permutationPuzzle.flatMap((row) => row),
    [permutationPuzzle]
  );
  const cycle = useMemo(() => getCycle(permutation), [permutation]);

  return (
    <div className={styles.paper}>
      <h1>Theory of Sliding</h1>
      <h3>
        Finding truths about sliding puzzles using Graph Theory and Group Theory
      </h3>

      <InteractiveSlidePuzzle dimensions={[3, 3]} shuffleImmediately />

      <P>
        This puzzle almost needs no introduction. Everybody loves sliding
        puzzles! Today I'm going to talk about these puzzles mathematically, and
        together we will discover effective ways of solving them quickly. Before
        you move ahead, please feel free to meddle with the 3x3 puzzle above
        until it has returned to sequential order.
      </P>

      {sectionBreak}

      <h2>The State Graph</h2>

      <P>
        Before discussing any approaches for quickly solving sliding puzzles, I
        would like to introduce you to a mathematically comprehensive
        representation. Suppose that we attribute each state of the puzzle to a
        single node in a graph that consists of all possible states. Then each
        of the possible moves from these states can be associated with an edge
        that connects two states together.
      </P>

      <P>
        For <i>very</i> small puzzles, this graph is small enough that it is
        easy to generate quickly and understand at a glance. For example, please
        play around with this 3-puzzle. You'll be able to visit all possible
        states of the puzzle in 12 movies, and perform all transitions in 13.
      </P>

      <ManualSlideGraphGenerator dimensions={[2, 2]} />

      <P>
        However, the graphs for most puzzles are not nearly as comprehensible.
        After only one additional column has been added to the previous puzzle,
        the graph increases in size by a considerable amount. After a few
        shuffles of this 2x3 puzzle, the network of discovered states blows the
        graph of the 3-puzzle out of the water.
      </P>

      <ManualSlideGraphGenerator dimensions={[2, 3]} includeShuffle />

      {sectionBreak}

      <h2>Puzzle Solvability</h2>

      <P>
        Readers who are keen on combinatorics may have noticed something
        peculiar about the size of the graph for the 3-puzzle. Before the
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
      </P>

      <InteractiveSlidePuzzle
        dimensions={[2, 2]}
        boardState={[
          [2, 1],
          [3, 0],
        ]}
      />

      <P>
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
      </P>

      <P>
        The Johnson &amp; Story argument, in its long-winded 19th century
        mathematical vernacular, begins with the recognition that each time a
        square is moved into the empty space there are two constants that
        change:
        <ol>
          <li>
            If we impose a checkerboard pattern on the puzzle, then the color
            that the blank space is on changes with every move.
          </li>
          <li>
            The <em>parity</em> of the number of cycles in the permutation
            generated by each of the squares and their indices.
          </li>
        </ol>
        That second constant requires a reasonable understanding of structures
        in group theory, so let's break it down. First, we define the{" "}
        <em>index</em> of a square to be read row-by-row, starting at 0. Below
        is a standard square 8-puzzle with indices included:
      </P>

      <InteractiveSlidePuzzle dimensions={[3, 3]} includeIndices />

      <P>
        To find the permutation generated by a given puzzle state, we generate a
        map between all indices and the numbers that are on them, where the
        blank space represents zero. This map is typically written in{" "}
        <em>permutation notation</em>, which is most easily understood in a
        demonstration. The diagram below the following puzzle describes it as a
        permutation.
      </P>

      <InteractiveSlidePuzzle
        dimensions={[2, 3]}
        includeIndices
        onUpdate={(puzzle) => setPermutationPuzzle(puzzle)}
      />
      <TeX
        block
        math={String.raw`
        \begin{pmatrix}
          ${permutation.map((_, i) => i).join(" & ")} \\
          ${permutation.join(" & ")}
        \end{pmatrix}
        `}
      />

      <P>
        In the puzzle above 0 maps to {permutation[0]}, which in turn maps to{" "}
        {permutation[permutation[0]]}. We can find a <em>cycle</em> by
        recursively permuting a number until it returns to its original
        position. The cycle that includes 0 in this permutation can be written
        as
      </P>

      <TeX
        block
        math={String.raw`
        \begin{pmatrix}
          ${cycle.join(" & ")}
        \end{pmatrix}.
        `}
      />

      <P>
        Please feel free to play with the puzzle above until you have an
        understanding of how these cycles are generated. An important fact to
        note is that, because permutations are one-to-one functions, it is
        impossible for a number to be a part of more than one cycle. Since they
        are mutually exclusive, we can consistently count the number of cycles
        in each sliding puzzle. In the 24-puzzle below, each cycle is colored
        separately.
      </P>

      <SlidePuzzleWithGroups
        dimensions={[5, 5]}
        includeIndices
        squareSize={4}
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
