import React, { useState } from "react";
import styles from "../../styles/AcademicPaper.module.css";

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

import InteractiveMastermind from "./InteractiveMastermind";
import MastermindWithSolutionSpace from "./MastermindWithSolutionSpace";
import Bibliography from "./Bibliography";
import NumberScrubber from "./NumberScrubber";
import MastermindDistanceVector from "./MastermindDistanceVector";
import MastermindWithHeuristic from "./MastermindWithHeuristic";
import { expectedValue, minimax } from "./MastermindHeuristicAlgorithms";

const references = {
  knuth77: {
    title: "The Computer as Master Mind",
    authors: ["Donald Knuth"],
    published: "Journal of Recreational Mathematics, 9(1), 1-6",
    year: 1977,
    url: "http://www.cs.uni.edu/~wallingf/teaching/cs3530/resources/knuth-mastermind.pdf",
  },
  graaf19: {
    title: "Cracking the Mastermind Code",
    authors: ["Sylvester de Graaf"],
    year: 2019,
    url: "https://theses.liacs.nl/pdf/2018-2019-GraafSde.pdf",
  },
  solvesnov: {
    title: "Optimal Algorithms for Bulls and Cows Game",
    authors: ["Alexey Slovesnov"],
    url: "http://slovesnov.users.sourceforge.net/index.php?bullscows",
  },
  gur: {
    title: "Serkan Gur's VB Examples Page",
    authors: ["Serkan Gur"],
    url: "http://serkangur.freeservers.com/",
  },
  gur21: {
    title:
      "New and Powerful Mastermind Strategies: A deep dive into heuristic and optimal code-breaking algorithms and board game AI bots",
    authors: ["Serkan Gur"],
    year: 2016,
    url: "https://www.amazon.com/Optimal-Mastermind-Solutions-comprehensive-programming-ebook/dp/B01M17PMIQ",
  },
  irving: {
    title: "Towards an optimum Mastermind strategy",
    authors: ["Robert W. Irving"],
    published: "Journal of Recreational Mathematics, 11(2), 81-87",
    year: 1978,
  },
};

const mastermind = <i>Mastermind®</i>;
const sectionBreak = <div className={styles.sectionBreak} />;

const MathSeminarPaper: React.FC = () => {
  const [mastermind1_numColors, updateMastermind1_numColors] = useState(6);
  const [mastermind1_wordLength, updateMastermind1_wordLength] = useState(4);

  const [solSpace1_numColors, updateSolSpace1_numColors] = useState(4);
  const [solSpace1_wordLength, updateSolSpace1_wordLength] = useState(2);

  const [distanceMetric_numColors, updateDistanceMetric_numColors] =
    useState(6);
  const [distanceMetric_wordLength, updateDistanceMetric_wordLength] =
    useState(4);

  const [bigO_numColors, setBigO_numColors] = useState(6);
  const [bigO_wordLength, setBigO_wordLength] = useState(4);

  const [minimax_numColors, setMinimax_numColors] = useState(3);
  const [minimax_wordLength, setMinimax_wordLength] = useState(3);

  const [expectedValue_numColors, setExpectedValue_numColors] = useState(3);
  const [expectedValue_wordLength, setExpectedValue_wordLength] = useState(3);

  return (
    <div className={styles.paper}>
      <h1>Cows, Bulls, and Beyond</h1>
      <h2>Solving Code-Breaking Games with Information Theory</h2>

      {sectionBreak}

      <div className={styles.aside}>
        Disclaimer: almost every part of this article is interactive and
        designed to be played with by you, the reader. To get the most out of
        your experience, please nudge numbers and play code-breaking games to
        your heart's content.
      </div>
      <div className={styles.paragraph}>
        For hundreds of years, pairs of people all over England have resigned to
        competing with one another in a rip-roaring, hair-raising game of wits
        and intelligence that has often been referred to by the common folk as{" "}
        <i>Cows and Bulls</i>. To begin this pencil-and-paper competition, each
        player wrote down a secret code on a piece of paper that contained four
        distinct numerical digits. Then, after a customary round of rivalrous
        chunter, each player submitted a random guess for their opponent's word.
        This guess was to be evaluated against the secret code it had attempted
        to approximate.
      </div>
      <div className={styles.paragraph}>
        Without revealing any specific digit locations, the holder of the secret
        code would respond with "There are <TeX>k</TeX> cow(s) and <TeX>b</TeX>{" "}
        bull(s)," where <TeX>k</TeX> represents the number of digits that are in
        both the guess and the secret code but the locations are not shared and{" "}
        <TeX>b</TeX> represents the number of digits that are exactly the same
        in both. Consider the following example:
        <TeX
          block
          math={String.raw`
          \begin{align*}
            \text{Secret Code}  & = 9254 \\
            \text{Player Guess} & = 4352
          \end{align*}
        `}
        />
        Here, the response would be "2 cows and 1 bull," where the bull is 5 and
        the cows are 4 and 2. Players continued to trade turns presenting
        guesses until one or both of them were able to guess their competitor's
        code. The best players of <i>Cows and Bulls</i> usually figured out the
        secret code in about 5-6 turns, as was{" "}
        <a href={references.solvesnov.url} target="_blank" rel="noreferrer">
          shown algorithmically by Alexey Slovesnov
        </a>
        .
      </div>
      <div className={styles.paragraph}>
        In the late 1960s, Mordecai Meirowitz slightly modified the rules of{" "}
        <i>Cows and Bulls</i> and rebranded it as {mastermind} before selling it
        to a plastics company for a large profit. The only differences that{" "}
        {mastermind} has from <i>Cows and Bulls</i> are that it uses 6
        differently colored pegs instead of 10 digits, and it allows for a code
        to contain multiple values that are the same. Cows are replaced with
        small white pins, and bulls with red ones. Before reading on any
        further, please play this interactive {mastermind} game a few times to
        get acquainted with the rules.
      </div>
      <InteractiveMastermind
        numColors={mastermind1_numColors}
        wordLength={mastermind1_wordLength}
      />
      <div className={styles.paragraph}>
        In the development of strategies for puzzles like this, it is often
        beneficial to consider simplified versions first. For the sake of
        conciseness, let us refer to a {mastermind} game with a secret code of
        length <TeX>n</TeX> that has <TeX>k</TeX> available colors as{" "}
        <TeX math="M_{n, k}" />. The board above should be labeled as{" "}
        <TeX math={`M_{${mastermind1_wordLength}, ${mastermind1_numColors}}`} />{" "}
        because it has a code of length{" "}
        <NumberScrubber
          value={mastermind1_wordLength}
          updateValue={updateMastermind1_wordLength}
          min={1}
          max={10}
        />{" "}
        with{" "}
        <NumberScrubber
          value={mastermind1_numColors}
          updateValue={updateMastermind1_numColors}
          min={1}
          max={12}
        />{" "}
        color{mastermind1_numColors !== 1 && "s"} available. If you'd like, you
        can adjust these values by clicking and dragging these boxed numbers or
        by selecting them and using the arrow keys.
      </div>

      {sectionBreak}

      <div className={styles.paragraph}>
        Since each of the <TeX>n</TeX> positions can contain any of <TeX>k</TeX>{" "}
        colors, it is fairly straightforward to enumerate the set of all
        possible solutions. Let us call this set the <em>solution space</em>,
        and label the solution space of each <TeX math="M_{n, k}" /> as{" "}
        <TeX math="S_{n, k}." /> If we choose to represent each color as a
        digit, then we can quickly find all values in <TeX math="S_{n, k}" /> by
        listing all <TeX>n</TeX>-digit integers with a base of <TeX>k</TeX> and
        replacing each digit with a color. Because there are <TeX>k</TeX>{" "}
        choices for each of the <TeX>n</TeX> positions, the size of this set can
        be found using
        <TeX
          block
          math={String.raw`
          \begin{equation}
            |S_{n, k}| = k^n
          \end{equation}
        `}
        />
        Let's start simple with the solution space for a {mastermind} game with{" "}
        <NumberScrubber
          value={solSpace1_wordLength}
          updateValue={updateSolSpace1_wordLength}
          min={1}
          max={4}
        />{" "}
        element{solSpace1_wordLength !== 1 && "s"} in its code and{" "}
        <NumberScrubber
          value={solSpace1_numColors}
          updateValue={updateSolSpace1_numColors}
          min={1}
          max={9}
        />{" "}
        color{solSpace1_numColors !== 1 && "s"} available. Using equation{" "}
        <TeX>(1)</TeX>, we can determine that{" "}
        <TeX
          math={`|S_{${solSpace1_wordLength}, ${solSpace1_numColors}}| = ${solSpace1_numColors}^${solSpace1_wordLength} = ${
            solSpace1_numColors ** solSpace1_wordLength
          }.`}
        />{" "}
        Below are the enumerated values of{" "}
        <TeX math={`S_{${solSpace1_wordLength}, ${solSpace1_numColors}}.`} />
      </div>
      <MastermindWithSolutionSpace
        numColors={solSpace1_numColors}
        wordLength={solSpace1_wordLength}
      >
        <div className={styles.paragraph}>
          Each time a guess is made in this{" "}
          <TeX math={`M_{${solSpace1_wordLength}, ${solSpace1_numColors}}`} />{" "}
          game, the response that is given reveals a subset of{" "}
          <TeX math={`S_{${solSpace1_wordLength}, ${solSpace1_numColors}}`} />{" "}
          that can no longer be a possible solution.
        </div>
      </MastermindWithSolutionSpace>

      {sectionBreak}

      <div className={styles.paragraph}>
        To determine whether each individual solution may be eliminated after
        the response to a guess has been revealed, it is useful to represent
        each code as a mathematical object that has a <i>distance</i> from other
        codes which may be displayed as either a set of red and white pins or as
        a vector. Since the length of the code is known at the beginning of the
        game, each distance vector can be represented with two numbers-- the
        number of red pins and the number of white pins. However, elimination of
        potential solutions is much more straightforward to calculate if the
        vector is instead reprsented as three numbers that sum to the code
        length-- the number of red pins, the number of white pins, and the
        number of empty slots.
      </div>
      <div className={styles.paragraph}>
        One useful attribute of this metric is that the distance between any two
        objects is always the same, regardless of which of them is the guess and
        which is the solution. To acquire a better understanding of this metric,
        experiment with these two codes of length{" "}
        <NumberScrubber
          value={distanceMetric_wordLength}
          updateValue={updateDistanceMetric_wordLength}
          min={1}
          max={9}
        />{" "}
        with{" "}
        <NumberScrubber
          value={distanceMetric_numColors}
          updateValue={updateDistanceMetric_numColors}
          min={1}
          max={9}
        />{" "}
        colors available.
      </div>

      <MastermindDistanceVector
        wordLength={distanceMetric_wordLength}
        numColors={distanceMetric_numColors}
      />

      <div className={styles.paragraph}>
        In order to determine if a potential solution may be eliminated after
        the response has been given for a word, we can simply determine whether{" "}
        <i>any</i> of its three values in vector form is greater than that of
        the distance vector between the guessed word and the potential solution.
      </div>

      {sectionBreak}

      <div className={styles.paragraph}>
        Most computational {mastermind} strategies are based on the idea of
        choosing each guess based on its expected reduction of the solution
        space. In{" "}
        <a href={references.gur21.url} target="_blank" rel="noreferrer">
          Serkan Gur's 2016 analysis of {mastermind}
        </a>
        , he labels these as <em>heuristic strategies</em>.
      </div>

      <div className={styles.paragraph}>
        The first person who publicly documented knowledge of their
        computational solution to {mastermind} was the computing legend and
        oft-proclaimed "father of algorithm analysis" Donald Knuth, in his short
        work entitled{" "}
        <a href={references.knuth77.url} target="_blank" rel="noreferrer">
          The Computer As Master Mind
        </a>
        . In this work, he applied what is known as the <em>minimax</em>{" "}
        algorithm in information theory to {mastermind}. The naive application
        of this algorithm is as follows (in pseudocode):
        <ul className={styles.pseudocode}>
          <li>
            For every possible guess
            <ul>
              <li>
                For all possible responses to the guess
                <ul>
                  <li>
                    Consider the size of the solution space after the response
                    acts on it
                  </li>
                </ul>
              </li>
              <li>
                Select the <i>maximum</i> solution space size after a response
                has been applied
              </li>
            </ul>
          </li>
          <li>
            Select the guess that results <i>minimum</i> size of the solution
            space
          </li>
        </ul>
        In effect, this algorithm chooses a guess every time that{" "}
        <i>minimizes risk</i>. It is guaranteed that even in the worst case
        scenario, after every guess is made the solution space has been reduced
        as much as possible. As such, this algorithm is very effective at
        solving the puzzle with a guaranteed maximum number of moves. As Serkan
        Gur outlined in{" "}
        <a href={references.gur21.url} target="_blank" rel="noreferrer">
          his analysis
        </a>
        , this strategy guarantees that the classic <TeX math="M_{4, 6}" /> is
        solved in 5 or fewer moves, which is provably the best that any strategy
        can perform. Gur also found that the minimax algorithm solved{" "}
        <TeX math="M_{4, 6}" /> in an average of <TeX>4.4761</TeX> moves across
        all possible games.
      </div>

      <div className={styles.paragraph}>
        For each guess in a <TeX math="M_{n, k}" /> {mastermind} board, there
        are <TeX math="\binom{n+2}{2}=\frac{(n+2)(n+1)}{2}" /> possible
        responses. This means that, without any pruning or other advanced
        optimization techniques, the number of comparisons required to find an
        optimal solution is <TeX math="(k^n)\binom{n+2}{2}(k^n)." /> Thus, for a{" "}
        {mastermind} board with{" "}
        <NumberScrubber
          value={bigO_numColors}
          updateValue={setBigO_numColors}
          min={1}
        />{" "}
        colors and codes of length{" "}
        <NumberScrubber
          value={bigO_wordLength}
          updateValue={setBigO_wordLength}
          min={1}
        />
        , the computer must make{" "}
        <TeX
          math={`(${bigO_numColors}^{${bigO_wordLength}})^2\\binom{${
            bigO_wordLength + 2
          }}{2}=${
            (bigO_numColors ** (2 * bigO_wordLength) *
              (bigO_wordLength + 1) *
              (bigO_wordLength + 2)) /
            2
          }`}
        />{" "}
        comparisons before deciding on a guess. Clearly, as the size of the
        board and the number of available colors grows this algorithm rapidly
        increases in compute time. Thus, the size of the board below is capped
        due to the limitations your web browser's single-threaded JavaScript. To
        explore the minimax algorithm and learn some of its limitations, try
        testing a few secret codes against it with this board of length{" "}
        <NumberScrubber
          value={minimax_wordLength}
          updateValue={setMinimax_wordLength}
          min={1}
          max={4}
        />{" "}
        with{" "}
        <NumberScrubber
          value={minimax_numColors}
          updateValue={setMinimax_numColors}
          min={1}
          max={5}
        />{" "}
        colors.
      </div>

      <MastermindWithHeuristic
        wordLength={minimax_wordLength}
        numColors={minimax_numColors}
        heuristic={minimax}
      />

      <div className={styles.paragraph}>
        Since the minimax strategy focuses on the <i>worst case</i>, it is very
        effective at lowering the ceiling for the number of moves required to
        find the secret code. However, since only the worst case scenario is
        considered this strategy has an average case that is often higher than
        that of other strategies. As such, various other mathematicians and
        computer scientists have considered alternative strategies which focus
        on minimizing average case at the expense of the worst case.
      </div>

      <div className={styles.paragraph}>
        Two years after Knuth's article about the minimax strategy, a fellow
        writer for the same journal named Robert W. Irving took a crack at
        solving {mastermind} with a smaller number of average moves. In order to
        do this, he explored the idea of using <em>expected size</em> to measure
        the effectiveness of a guess. Using this strategy, he was able to bring
        down the average number of moves for <TeX math="M_{4, 6}" /> from{" "}
        <TeX>4.4761</TeX> to <TeX>4.3951.</TeX> This strategy assumes that the
        probability of a response is the same as that of its reduction of the
        solution space. Thus, for the set of possilbe responses <TeX>R</TeX>,
        the expected value of a guess <TeX>g</TeX> can be calculated with
        <TeX
          block
          math={String.raw`
          \begin{equation}
            E(g)
              = \sum_{r\in R}\left(s_r\cdot\frac{s_r}{s_o}\right)
              = \frac{\sum s_r^2}{s_o},
          \end{equation}
        `}
        />
        where <TeX>s_o</TeX> represents the original size of the solution space
        and <TeX>s_r</TeX> represents its size after <TeX>r</TeX> has been given
        in response to <TeX>g</TeX>. In the worst case, this algorithm may take
        more guesses before finding the secret code. You may experiment with
        this algorithm in the following demonstration, which has{" "}
        <NumberScrubber
          value={expectedValue_numColors}
          updateValue={setExpectedValue_numColors}
          min={1}
          max={5}
        />{" "}
        colors and a code of length{" "}
        <NumberScrubber
          value={expectedValue_wordLength}
          updateValue={setExpectedValue_wordLength}
          min={1}
          max={4}
        />
        .
      </div>

      <MastermindWithHeuristic
        wordLength={expectedValue_wordLength}
        numColors={expectedValue_numColors}
        heuristic={expectedValue}
      />

      <Bibliography citations={references} />
    </div>
  );
};

export default MathSeminarPaper;
