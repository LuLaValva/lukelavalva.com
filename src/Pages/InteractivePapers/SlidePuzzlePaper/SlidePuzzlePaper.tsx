import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../AcademicPaper.module.css";
import Bibliography, { Citation } from "../Bibliography";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import ManualSlideGraphGenerator from "./ManualSlideGraphGenerator";

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import SlidePuzzleWithCycles from "./SlidePuzzleWithCycles";
import { SlidePuzzle } from "./SlidePuzzleDisplay";
import { getCycle } from "./SlidePuzzleUtilities";
import IncrementalSlideGraphGenerator from "./IncrementalSlideGraphGenerator";

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
  beeler15: {
    title: "The 15 Puzzle: A Motivating Example for the Alternating Group",
    authors: ["Robert A. Beeler"],
    year: 2015,
    published: "East Tennessee State University",
    url: "https://paperzz.com/doc/9258633/the-fifteen-puzzle-a-motivating-example-for-the-alternati...",
  },
  wiki_15puzzle: {
    title: "15 puzzle",
    authors: ["Wikipedia Contributors"],
    published: "Wikipedia, The Free Encyclopedia",
    url: "https://en.wikipedia.org/wiki/15_puzzle",
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
      <h3>Exploring sliding puzzles with Graph Theory and Group Theory</h3>

      <InteractiveSlidePuzzle dimensions={[3, 3]} shuffleImmediately />

      <P>
        Late in the 19th century, this small and easy-to-understand puzzle swept
        across the nation and captured the minds of thousands of individuals.
        The rules are simple: starting from a scrambled state, it is possible to
        solve the puzzle by repeatedly sliding adjacent tiles into the empty
        space until the numbers are in sequence, with <TeX>1</TeX> in the upper
        left hand corner. This puzzle and its variants have gone by many names,
        but for purposes of this article I will be calling them{" "}
        <TeX>m\times n</TeX> sliding puzzles, where <TeX>m</TeX> represents the
        number of rows and <TeX>n</TeX> the number of columns. If you haven't
        done it before, please try your hand at solving the <TeX>3\times 3</TeX>{" "}
        puzzle above before you continue reading.
      </P>

      <P>
        After looking hard enough, you may discover that there is a lot to learn
        from these simple puzzles. In this article, I would like to introduce
        You to the relationship between sliding puzzles and various mathematical
        disciplines, including graph theory and group theory. Along the way
        we'll find optimal solutions for some of the smaller puzzles, show why{" "}
        <i>nobody</i> has yet found them for larger ones, and explore the
        feasibility of the following $1,000 configuration from the 1890s.
      </P>

      <InteractiveSlidePuzzle
        dimensions={[4, 4]}
        squareSize={4}
        boardState={[
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 15, 14, 0],
        ]}
      />

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
        play around with this <TeX>2\times 2</TeX> puzzle. You'll be able to
        visit all possible states of the puzzle in 12 movies, and perform all
        transitions in 13.
      </P>

      <ManualSlideGraphGenerator dimensions={[2, 2]} />

      <div className={styles.aside}>
        Quick tip: Navigate graphs by pinching, scrolling, or dragging and move
        individual nodes around using your finger or mouse. Graph display
        technology provided by{" "}
        <a href="https://visjs.org/" target="_blank" rel="noreferrer">
          vis.js
        </a>
        .
      </div>

      <P>
        However, the graphs for most puzzles are not nearly as comprehensible.
        After only one additional column has been added to the previous puzzle,
        the graph increases in size by a considerable amount. After a few
        shuffles of this <TeX>2\times 3</TeX> puzzle, the network of discovered
        states blows the graph of the <TeX>2\times 2</TeX> puzzle out of the
        water.
      </P>

      <ManualSlideGraphGenerator dimensions={[2, 3]} includeShuffle />

      {sectionBreak}

      <h2>Puzzle Solvability</h2>

      <P>
        Readers who are keen on combinatorics may have noticed something
        peculiar about the size of the graph generated by the{" "}
        <TeX>2\times 2</TeX> puzzle. Before the restrictions of a sliding puzzle
        are taken into account, it may come across as obvious that the number of
        nodes in the graph should the same as the number of possible 4-digit
        permutations. Then the number of possible board states should be
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
        As it turns out, this 50% rule is true for <i>all</i> sliding puzzles.
        For any board with <TeX>m</TeX> rows and <TeX>n</TeX> columns, the
        number of reachable states is
        <TeX block math="\frac{(mn)!}{2}." />
        To understand why half of all sliding puzzles are unsolvable, we can
        refer to an argument made{" "}
        <a href={references.johnson79.url} target="_blank" rel="noreferrer">
          back in 1879
        </a>{" "}
        by Wm. Woolsey Johnson and its generalization by his colleague William
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
            that the blank space is on changes with every move. This "color" can
            also be found by calculating the number of rows and columns that the
            empty space has been displaced from its solved position and checking
            whether it is even or odd. This metric, where rows and columns are
            counted, is known as "Manhattan distance" because it is indicative
            of the way that cars travel amongst streets in a grid pattern.
          </li>
          <li>
            The <em>parity</em> of the number of cycles in the permutation
            generated by each of the squares and their indices.
          </li>
        </ol>
        That second constant requires a reasonable understanding of structures
        in group theory, so let's break it down. First, we define the{" "}
        <em>index</em> of a square to be read row-by-row, starting at 0. Below
        is a standard square <TeX>3\times 3</TeX> puzzle with indices included:
      </P>

      <InteractiveSlidePuzzle dimensions={[3, 3]} includeIndices />

      <P>
        To find the permutation generated by a given puzzle state, we generate a
        map between all indices and the numbers that are on them, where the
        blank space represents zero. This map is typically written in{" "}
        <em>permutation notation</em>, which is most easily understood in a
        demonstration. The diagram below the following puzzle describes its
        state as a permutation.
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
        in each sliding puzzle. In the <TeX>5\times 5</TeX> puzzle below, each
        cycle is assigned to a color. All cycles are listed below, in proper
        mathematical notation.
      </P>

      <SlidePuzzleWithCycles
        dimensions={[3, 3]}
        includeIndices
        showCycleNotation
      />

      <P>
        The observation made by Johnson &amp; Story is that each time a move is
        made, the number of cycles changes by exactly 1. If the blank space
        moves to a space that is already a part of its cycle, its cycle splits
        in two. If it moves to a space that is a part of a different cycle then
        the cycles are merged. Therefore, the number of cycles switches between
        an even and odd number every move. This is referred to as the{" "}
        <em>parity</em> of the permutation.
      </P>

      <P>
        Recall that if we imagine a superimposed checkerboard, the color of the
        empty space also switches every move. This means that, in a solvable
        puzzle, the parity of the generated permutation is always odd when the
        Manhattan distance of the blank space from its target location is even,
        and vice versa. If this is not the case, then the puzzle is impossible
        to solve. This is true for all finite sliding puzzles, regardless of
        their dimensions.
      </P>

      <SlidePuzzleWithCycles
        dimensions={[5, 5]}
        squareSize={4}
        includeIndices
        showNumCyclesAndManhattanDistance
      />

      <P>
        Thus, we can deduce very quickly that the following popular puzzle
        arrangement is impossible to solve!
      </P>

      <SlidePuzzleWithCycles
        dimensions={[3, 3]}
        boardState={[
          [2, 1, 3],
          [4, 5, 6],
          [7, 8, 0],
        ]}
        squareSize={4}
        showCycleNotation
        includeIndices
        showNumCyclesAndManhattanDistance
      />

      <P>
        For those who are familiar with abstract algebra, it has been proven any
        square puzzle with odd number of tiles <TeX>n</TeX> is isomorphic to its
        respective alternating group <TeX>A_n.</TeX> That discussion is beyond
        the scope of this article, but you can read more about it in{" "}
        <a href={references.beeler15.url} target="_blank" rel="noreferrer">
          this excellent paper by Robert A. Beeler
        </a>
        .
      </P>

      {sectionBreak}

      <h2>Finding an Optimal Solution</h2>

      <P>
        A naive method for finding the optimal solution starting from a specific
        state is to construct a graph that explores all other puzzle states
        breadth-first until the solved state is reached by one of the branches.
        Since a return to a state that has already been visited guarantees a
        longer solution than what is already known to be possible, we can
        refrain from ever visiting a single state more than once. This means
        that our graph will contain no loops, so we will call it a <em>tree</em>
        .
      </P>

      <P>
        In the example below, we can use this algorithm to quickly find the
        fastest possible path to the solution.
      </P>

      <IncrementalSlideGraphGenerator
        dimensions={[2, 3]}
        rootState={[
          [4, 0, 1],
          [2, 5, 3],
        ]}
      />

      <P>
        While this is an effective method for finding the solution in small
        puzzles, the number of possible board states in larger ones makes it
        computationally infeasible to follow the algorithm for long. As we
        learned earlier, in a <TeX>5\times 5</TeX> sliding puzzle there are{" "}
        <TeX math="\frac{25!}{2}\approx 7.76\times 10^{24}" /> possible states
        to explore, which is an unfathomably large number. When using the
        breadth-first search technique, we are limited by not only the amount of
        time it takes to explore all of the possible next moves, but also by the
        space that it takes to store all of the visited states. In fact, the
        number of states in a <TeX>5\times 5</TeX> sliding puzzle is so large
        that no algorithm has yet discovered the number of moves that are
        required in the worst case.
      </P>

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
