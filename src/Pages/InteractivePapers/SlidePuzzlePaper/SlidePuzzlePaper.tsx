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
        space until the numbers are back in sequence, with <TeX>1</TeX>{" "}
        stationed in the upper left hand corner. If you haven't done it before,
        feel free to try your hand at solving the puzzle above before you
        continue reading. This puzzle and its variants have gone by many names,
        but for purposes of this article I will be calling them{" "}
        <TeX>m\times n</TeX> sliding puzzles, where <TeX>m</TeX> represents the
        number of rows and <TeX>n</TeX> the number of columns.
      </P>

      <P>
        While it may not seem so at first, there is actually a lot to learn from
        these simple puzzles. In this article, I would like to introduce you to
        the relationship between sliding puzzles and various mathematical
        disciplines, including graph theory and group theory. Along the way
        we'll find optimal solutions for some of the smaller puzzles, show why{" "}
        <i>nobody</i> has yet found them for larger ones, and explore the
        feasibility of reaching a solution from the following $1,000
        configuration from the 1890s.
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
        Before moving forward with some of the interesting mathemaical
        properties of sliding puzzles, let's gather our bearings by exploring
        some alternative methods of visualization. To start, we can attribute
        each state of the puzzle to a single node in a graph. Each time we make
        a move, a new edge is generated between the previos move and the current
        one. After we've seen all possible puzzle states and all of the moves
        between them, we will have a complete picture of the puzzle and all of
        its possibilities.
      </P>

      <P>
        For <i>very</i> small puzzles, this graph is small enough that it is
        easy to generate quickly and understand at a glance. For example, take a
        moment to play around with this <TeX>2\times 2</TeX> puzzle. You'll be
        able to visit all possible states within only 12 movies, and the 13th
        will complete the graph.
      </P>

      <ManualSlideGraphGenerator dimensions={[2, 2]} />

      <div className={styles.aside}>
        Quick tip: Navigate graphs by pinching, scrolling, or dragging and move
        individual nodes around using your finger or mouse [
        <a href="https://visjs.org/" target="_blank" rel="noreferrer">
          vis.js
        </a>
        ].
      </div>

      <P>
        After only one additional column has been added, the graph increases in
        size by a considerable amount. After a few shuffles of this{" "}
        <TeX>2\times 3</TeX> puzzle, you may discover that the graph is so large
        that it is difficult to follow.
      </P>

      <ManualSlideGraphGenerator dimensions={[2, 3]} includeShuffle />

      <P>
        Of course, it doesn't stop here. As the size of the puzzle grows, its
        state graph does too. In the next section we'll be doing some work to
        figure out just how big those graphs get, and discover some interesting
        qualities of the puzzle that may not have been obvious at first.
      </P>

      {sectionBreak}

      <h2>Puzzle Solvability</h2>

      <P>
        Readers who are keen on combinatorics may have noticed something
        peculiar about the size of the graph generated by the{" "}
        <TeX>2\times 2</TeX> puzzle. If there are 4 pieces in the puzzle and we
        can organize them in any way we'd like, then the number of possible
        states should be the same as the number of length-4 permutations.
        Following this logic, the number of possible states should come out to
        <TeX block>4!=4\cdot3\cdot2\cdot1=24.</TeX>
        However, this is not the case. We learned earlier that the actual number
        of reachable states in the <TeX>2\times 2</TeX> puzzle is actually 12.
        This means that 50% of the possible configurations must be unreachable!
        After some experimentation, this becomes clear. No matter the number of
        moves, it is impossible to reach a solution from the following state:
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
        by Wm. Woolsey Johnson and its subsequent generalization by William E.
        Story.
      </P>

      <P>
        The Johnson &amp; Story argument, in its long-winded 19th century
        mathematical vernacular, begins with the recognition that each time a
        square is moved into the empty space there are two values that change:
        <ol>
          <li>
            <em>Parity of Manhattan Distance</em>: If we add together the number
            of rows and columns that the empty space has traveled from the
            bottom right corner, it will switch between being even and odd every
            single move. This metric is known as "Manhattan distance" because it
            is indicative of the way that cars travel among city streets.
          </li>
          <li>
            <em>Parity of Permutation Cycles</em>: This value will take a bit
            longer to explain than Manhattan distance, so hold tight for the
            next few paragraphs. If you're familiar with group theory, feel free
            to skim through.
          </li>
        </ol>
        To find the permutation cycles, we can begin by defining the{" "}
        <em>index</em> of each piece in the puzzle to be read row-by-row,
        starting at 0. Below is a <TeX>3\times 3</TeX> puzzle with indices
        included:
      </P>

      <InteractiveSlidePuzzle dimensions={[3, 3]} includeIndices />

      <P>
        To find the permutation generated by a given puzzle state, we can refer
        to the map between all indices and the numbers that are on them (for
        simplicity, the "number" of the blank space is 0). This map is typically
        written in <em>permutation notation</em>, which is most easily
        understood by demonstration. The diagram below the following puzzle
        describes its state as a permutation.
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
        In a permutation, mapping a value from the top row to its associated
        number on the bottom is called <em>permuting</em>. In the puzzle above,
        0 permutes to {permutation[0]} which in turn permutes to{" "}
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
        To really get an understanding of each generated permutation and its
        cycles, mess with the <TeX>3\times 3</TeX> puzzle above and watch how
        the values change.
      </P>

      <P>
        An important note is that, because each value is found once and only
        once on the top and bottom of each permutation (this means they're
        one-to-one functions), it is impossible for a number to be a part of
        more than one cycle. Since the cycles are mutually exclusive, we can
        actually represent each permutation by just the list of the cycles that
        it generates. In the <TeX>3\times 3</TeX> puzzle below, each cycle is
        assigned to a color and listed below, in proper cycle notation. As you
        move the pieces around, the number of cycles will constantly be
        changing.
      </P>

      <SlidePuzzleWithCycles
        dimensions={[3, 3]}
        includeIndices
        showCycleNotation
      />

      <P>
        The observation made by Johnson &amp; Story in 1879 was that each time
        they made a move , the number of cycles changed by exactly 1. If the
        blank space moves to a space that is already a part of its cycle, its
        cycle splits in two. If it moves to a space that is a part of a
        different cycle, then the two cycles are merged. Therefore, the number
        of cycles switches between an even and odd number every move. This is
        referred to as the <em>parity</em> of the permutation.
      </P>

      <P>
        Recall that the parity of the manhattan distance also changes with every
        move. This means that, in a solvable puzzle, the parity of the generated
        permutation is always odd when the Manhattan distance is even, and vice
        versa. If this is not the case, then the puzzle must be impossible to
        solve. This is true for all finite sliding puzzles, regardless of their
        dimensions.
      </P>

      <SlidePuzzleWithCycles
        dimensions={[5, 5]}
        squareSize={4}
        includeIndices
        showNumCyclesAndManhattanDistance
      />

      <P>
        Using this knowledge and some computational visualization, we can deduce
        in seconds that the following popular puzzle arrangement is actually
        impossible to solve!
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
        For those who are familiar with abstract algebra and group theory, it
        has been shown any square puzzle with odd number of tiles <TeX>n</TeX>{" "}
        is isomorphic to its respective alternating group <TeX>A_n.</TeX> That
        discussion is beyond the scope of this article, but you can read more
        about it in{" "}
        <a href={references.beeler15.url} target="_blank" rel="noreferrer">
          this excellent paper by Robert A. Beeler
        </a>
        .
      </P>

      {sectionBreak}

      <h2>Finding an Optimal Solution</h2>

      <P>
        Now that we're done with our little detour into group theory, let's take
        a step back to the state graph in order to find some fast solutions.
      </P>

      <P>
        A naive method for finding the optimal solution from a given state is to
        construct a graph that explores all other states breadth-first until the
        solved state is reached by one of the branches. Since returning to a
        state that has already been visited guarantees a longer solution than
        what is already known to be possible, we can refrain from ever visiting
        a known state more than once. This means that our graph will contain no
        loops, so we can call it a <em>tree</em>.
      </P>

      <P>
        In the example below, we can use this algorithm to quickly find the
        fastest possible path to the solution (From this state you'll only need
        8 moves to make it there, so don't stop short!).
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
        learned earlier, in a <TeX>5\times 5</TeX> sliding puzzle there are
        <TeX block math="\frac{25!}{2}\approx 7.76\times 10^{24}" />
        possible states to explore, which is an unfathomably large number. When
        using the breadth-first search technique, we are limited not only by the
        amount of time it takes to explore all of the possible next moves, but
        also by the space that it takes to store all of the previously visited
        states. In fact, there are so many states in a <TeX>5\times 5</TeX>{" "}
        sliding puzzle that no algorithm has yet discovered the board states
        which are provably the furthest from being solved.
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
