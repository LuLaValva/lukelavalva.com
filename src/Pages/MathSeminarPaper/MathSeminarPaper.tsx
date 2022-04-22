import React, { useState } from "react";
import styles from "../../styles/AcademicPaper.module.css";

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

import InteractiveMastermind, { InlineSolution } from "./InteractiveMastermind";
import MastermindWithSolutionSpace from "./MastermindWithSolutionSpace";
import Bibliography from "./Bibliography";
import NumberScrubber from "./NumberScrubber";
import MastermindDistanceVector from "./MastermindDistanceVector";
import MastermindWithHeuristic from "./MastermindWithHeuristic";
import {
  entropy,
  expectedValue,
  minimax,
} from "./MastermindHeuristicAlgorithms";
import { Link } from "react-router-dom";
import GeneralSelector from "./GeneralSelector";
import MastermindWithEverything from "./MastermindWithEverything";

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
  irving78: {
    title: "Towards an optimum Mastermind strategy",
    authors: ["Robert W. Irving"],
    published: "Journal of Recreational Mathematics, 11(2), 81-87",
    year: 1978,
  },
  koyama93: {
    title: "An optimal Mastermind Strategy",
    authors: ["Kenji Koyoma", "Tony W. Lai"],
    published: "Journal of Recreational Mathematics, 25(4), 251-256",
    year: 1993,
  },
  sloane: {
    title: "a(n) is the number of partitions of n (the partition numbers)",
    authors: ["N. J. A. Sloane"],
    published: "OEIS A000041",
    url: "https://oeis.org/A000041",
  },
};

const mastermind = <i>Mastermind®</i>;
const sectionBreak = <div className={styles.sectionBreak} />;
const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className={styles.code}>{children}</span>
);

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

  const [minimax_numColors, setMinimax_numColors] = useState(4);
  const [minimax_wordLength, setMinimax_wordLength] = useState(3);

  const [expectedValue_numColors, setExpectedValue_numColors] = useState(4);
  const [expectedValue_wordLength, setExpectedValue_wordLength] = useState(3);

  const [entropy_numColors, setEntropy_numColors] = useState(4);
  const [entropy_wordLength, setEntropy_wordLength] = useState(3);

  const [consistent_numColors, setConsistent_numColors] = useState(4);
  const [consistent_wordLength, setConsistent_wordLength] = useState(3);
  const [consistent_heuristic, setConsistent_heuristic] = useState(
    () => minimax
  );

  const [final_numColors, setFinal_numColors] = useState(3);
  const [final_wordLength, setFinal_wordLength] = useState(3);

  return (
    <div className={styles.paper}>
      <h1>Cows, Bulls, and Beyond</h1>
      <h3>Cracking Code-Breaking Games with Mathematics</h3>

      {sectionBreak}

      <div className={styles.aside}>
        Disclaimer: almost every part of this article is interactive and
        designed to be played with by you, the reader. To get the most out of
        your experience, please nudge numbers and crack codes until you feel
        satisfied.
      </div>
      <div className={styles.paragraph}>
        For hundreds of years, pairs of people all over England have resigned to
        competing with one another in a rip-roaring, hair-raising game of wits
        and intelligence that has often been referred to by the common folk as{" "}
        <i>Cows and Bulls</i>. To begin this pencil-and-paper competition, each
        player wrote down a secret code on a piece of paper that contained four
        distinct numerical digits. Then, after a customary round of rivalrous
        chunter, each player submitted a random guess for what their opponent
        had written.
      </div>
      <div className={styles.paragraph}>
        Without revealing any specific digit locations, each player then
        responded with "There are <TeX>k</TeX> cow(s) and <TeX>b</TeX> bull(s)",
        where <TeX>k</TeX> represents the number of digits that exist in both
        the guess and the secret code but do not share a location and{" "}
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
        Here, the response would be "2 cows and 1 bull", where the bull is{" "}
        <TeX>5</TeX> and the cows are <TeX>4</TeX> and <TeX>2</TeX>. Players
        continued to trade turns presenting guesses until one or both of them
        were able to guess their competitor's code. The best players of{" "}
        <i>Cows and Bulls</i> usually figured out the secret code in about 5-6
        turns, as was{" "}
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
        beneficial to consider simplified versions first. Let us refer to a{" "}
        {mastermind} game with a secret code of length <TeX>n</TeX> that has{" "}
        <TeX>k</TeX> available colors as <TeX math="M_{n, k}" />. The board
        above should be labeled as{" "}
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
        can adjust these values by clicking and dragging the boxed numbers or by
        selecting them and using the arrow keys.
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
        codes, which may be displayed as either a set of red and white pins or
        as a vector. Since the length of the code is known at the beginning of
        the game, each distance vector can be represented with two values-- the
        number of red pins and the number of white pins. However, elimination of
        potential solutions is much more straightforward to calculate if the
        vector is instead represented as three numbers that sum to the code
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
        the response has been given for a code, we can simply determine whether{" "}
        <i>any</i> of its three values in vector form is greater than that of
        the distance vector between the guessed code and the potential solution.
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
        responses. It is impossible to respond with all red pegs except for one
        which is white because then all pegs would have to be red, so we can
        subtract 1 from this number. This means that, without any pruning or
        other advanced optimization techniques, the number of comparisons
        required to find an optimal solution is{" "}
        <TeX math="(k^n)(\binom{n+2}{2}(k^n)-1)." /> Thus, for a {mastermind}{" "}
        board with{" "}
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
          math={`(${bigO_numColors}^{${bigO_wordLength}})^2(\\binom{${
            bigO_wordLength + 2
          }}{2}-1)=${
            bigO_numColors ** (2 * bigO_wordLength) *
            (((bigO_wordLength + 1) * (bigO_wordLength + 2)) / 2 - 1)
          }`}
        />{" "}
        comparisons before deciding on a guess. Clearly, as the size of the
        board and the number of available colors grows this algorithm rapidly
        increases in compute time. Thus, the size of the board below is capped
        due to the limitations your web browser's single-threaded JavaScript
        interpreter. To explore the minimax algorithm and learn some of its
        limitations, try testing a few secret codes against it with this{" "}
        {mastermind} board, which has{" "}
        <NumberScrubber
          value={minimax_numColors}
          updateValue={setMinimax_numColors}
          min={1}
          max={6}
        />{" "}
        colors and a code length of{" "}
        <NumberScrubber
          value={minimax_wordLength}
          updateValue={setMinimax_wordLength}
          min={1}
          max={4}
        />
        .
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
              = \sum_{r\in R}\left(\frac{s_r}{s_o}\cdot s_r\right)
              = \frac{\sum s_r^2}{s_o},
          \end{equation}
        `}
        />
        where <TeX>s_o</TeX> represents the original size of the solution space
        and <TeX>s_r</TeX> represents its size after <TeX>r</TeX> has been given
        in response to <TeX>g</TeX>. Because this is also a heuristic strategy,
        the algorithm takes almost exactly the same amout of compute power as
        the minimax strategy. It may take more guesses before finding the secret
        code in the worst case, but on average it has been foud to perform
        slightly better. You may experiment with this algorithm in the following
        demonstration, which has{" "}
        <NumberScrubber
          value={expectedValue_numColors}
          updateValue={setExpectedValue_numColors}
          min={1}
          max={6}
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

      <div className={styles.paragraph}>
        The strategy that we have been using thus far, in which each guess is
        selected based on its anticipated reduction of the solution space, is
        not unique to code-breaking games like {mastermind}. In fact,{" "}
        <em>information theory</em> is an entire field of mathematics that
        focuses on studying this type of problem. One of the key concepts of
        this field is a unit called the <em>bit</em>, which measures the value
        of a piece of information that we will call an observation. The name of
        this term comes from the binary bit in computer science, which can have
        one of two values (0 or 1, <Code>true</Code> or <Code>false</Code>). If
        an observation holds one bit of information, then it reduces the
        solution space to half of its original size. If it holds two bits of
        information, then it reduces it to a quarter. Thus, the information{" "}
        <TeX>I</TeX> gained from a guess after response <TeX>r</TeX> can be
        found with
        <TeX
          block
          math={String.raw`
          \begin{aligned}
            \left(\frac{1}{2}\right)^I & = \frac{s_r}{s_o} \\
            2^I                        & = \frac{s_o}{s_r} \\
            I                          & = \log_2\left(\frac{s_o}{s_r}\right).
          \end{aligned}
        `}
        />
        Most works on information theory define <TeX>p</TeX> as the proportion
        between the original size of the solution space and the reduced size{" "}
        <TeX math="p=(s_r/s_o)" />, as a number between 0 and 1 is preferred.
        Thus, <TeX>I</TeX> is typically defined as
        <TeX
          block
          math={String.raw`
          \begin{equation}
            I = \log_2\left(\frac{s_o}{s_r}\right)
              = \log_2\left(\frac{1}{p}\right)
              = -\log_2(p).
          \end{equation}
        `}
        />
        Because of the logarithm in this formula, information is naturally
        additive instead of multiplicative. This means that, with observation
        that has <TeX>5</TeX> bits of information and another independent
        observation that has <TeX>3</TeX> bits, it is easy to calculate that the
        total amount of information is <TeX>5+3=8</TeX> bits.
      </div>

      <div className={styles.paragraph}>
        In the last strategy, we found the expected value of the size of the
        solution space after a piece of information has been revealed. This is
        an intuitive method for evaluating the effectiveness of a code, but we
        can do better if we recognize that the size of the solution space is a
        naive approach at measuring information. In fact, the expected value of
        information gained by an observation is so commonly used that
        information theorists decided that it was worth giving a name to. For
        our specific use case, the <em>entropy</em> of a guess <TeX>g</TeX> is
        determined by
        <TeX
          block
          math={String.raw`
          \begin{equation}
            \begin{aligned}
              \mathcal{E}(g)
                & = \sum_{r\in R}\left(\frac{s_r}{s_o}\cdot \log_2\left(\frac{s_o}{s_r}\right)\right) \\
                & = -\frac{\sum s_r\log_2(p)}{s_o}.
            \end{aligned}
          \end{equation}
        `}
        />
        Based on Gur's analysis, this strategy finds the secret code in an
        average of <TeX>4.4151</TeX> guesses. Of course, you are welcome to
        experiment with this strategy using the following {mastermind} game,
        which has{" "}
        <NumberScrubber
          value={entropy_numColors}
          updateValue={setEntropy_numColors}
          min={1}
          max={6}
        />{" "}
        colors and a code of length{" "}
        <NumberScrubber
          value={entropy_wordLength}
          updateValue={setEntropy_wordLength}
          min={1}
          max={4}
        />
        .
      </div>

      <MastermindWithHeuristic
        wordLength={entropy_wordLength}
        numColors={entropy_numColors}
        heuristic={entropy}
      />

      {sectionBreak}

      <div className={styles.paragraph}>
        You may have noticed that in many cases, these algorithms will select
        codes that are not actually possible solutions. This is because in
        certain cases, it makes more probabilistic sense to sacrifice chances of
        winning on the current turn to increase the amount of information that
        is known in the next turn. As a simple example, suppose that the
        solution space consists of the codes <InlineSolution code={[0, 0, 0]} />
        , <InlineSolution code={[1, 1, 1]} />, and{" "}
        <InlineSolution code={[2, 2, 2]} />. Then guessing only from the
        solution space results in a <TeX>66\%</TeX> chance of finding the secret
        code within two guesses. However, if instead{" "}
        <InlineSolution code={[0, 0, 1]} /> is supplied as a first guess then
        its response will guarantee that the code is known for the next one.
      </div>

      <div className={styles.paragraph}>
        Some people who have been thinking about {mastermind} for a while and
        discovering methods for solving it have deemed it boring to guess a code
        that is known to not be in the solution space, because it feels a little
        bit <i>too</i> calculated for their taste. As such, a separate branch of
        the game has been discussed among code-breakers called{" "}
        <em>Consistent {mastermind}</em>, in which it is illegal to make a guess
        that is not a part of the known solution space. Under this restriction,
        it is impossible to guarantee that <TeX math="M_{4, 6}" /> is solved
        within 5 moves using any strategy. However, the performance of the
        previous heuristic algorithms is improved in certain cases due to random
        chance. Below, you can experiment with a consistent {mastermind} solver
        for a board that has{" "}
        <NumberScrubber
          value={consistent_numColors}
          updateValue={setConsistent_numColors}
          min={1}
          max={6}
        />{" "}
        colors and a code of length{" "}
        <NumberScrubber
          value={consistent_wordLength}
          updateValue={setConsistent_wordLength}
          min={1}
          max={4}
        />
        , which uses the{" "}
        <GeneralSelector
          options={{
            minimax: minimax,
            "expected value": expectedValue,
            entropy: entropy,
          }}
          setValue={setConsistent_heuristic}
        />{" "}
        heuristic.
      </div>

      <MastermindWithHeuristic
        wordLength={consistent_wordLength}
        numColors={consistent_numColors}
        heuristic={consistent_heuristic}
        isConsistent={true}
      />

      {sectionBreak}

      <div className={styles.paragraph}>
        The implementations of heuristic algorithms for the demonstrations in
        this website have not been subject to many major fundamental changes for
        optimization, but one alteration has been made to significantly improve
        their performance. Before any guesses have been made, the solution space
        contains every possible combination of colors. As such, there exists
        symmetry which causes many codes to reduce the solution space in exactly
        the same way. More specifically, if two indices are swapped in a code or
        all pegs of one color are switched to the same unique color then they
        may be viewed as equivalent first guesses. This intuitively makes sense;
        each of <InlineSolution code={[3, 1, 3, 0]} /> and{" "}
        <InlineSolution code={[2, 1, 1, 4]} /> have two of one color, and one
        each of two other colors. Then simply by swapping colors and locations
        repeatedly, any code can be translated to follow these rules:
        <ol>
          <li>
            The first color is always <InlineSolution code={[0]} />.
          </li>
          <li>
            Each color after the first is either the same as the one before it,
            or next sequentially from the arbitrary order of{" "}
            <InlineSolution code={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} />.
          </li>
          <li>
            Every sequence of the same color <TeX>n</TeX> times in a row is
            either the same size as the one before it or smaller.
          </li>
        </ol>
        We may refer to each code that follows these rules as a "primitive
        code". Then the set of all primitive codes for <TeX math="M_{3, 4}" />{" "}
        is <TeX math="\{" />
        <InlineSolution code={[0, 0, 0]} />, <InlineSolution code={[0, 0, 1]} />
        , <InlineSolution code={[0, 1, 2]} />
        <TeX math="\}" /> and the primitive codes for <TeX math="M_{5, 6}" />{" "}
        are <TeX math="\{" />
        <InlineSolution code={[0, 0, 0, 0, 0]} />,{" "}
        <InlineSolution code={[0, 0, 0, 0, 1]} />,{" "}
        <InlineSolution code={[0, 0, 0, 1, 1]} />,{" "}
        <InlineSolution code={[0, 0, 0, 1, 2]} />,{" "}
        <InlineSolution code={[0, 0, 1, 1, 2]} />,{" "}
        <InlineSolution code={[0, 0, 1, 2, 3]} />,{" "}
        <InlineSolution code={[0, 1, 2, 3, 4]} />
        <TeX math="\}" />. For the first guess, the heuristic algorithms need
        not evaluate any codes which are not primitive because they are
        guaranteed to perform redundant calculations. It goes without saying
        that <TeX>7</TeX> sets of calculations take far fewer computer cycles
        than <TeX>6^5=7776</TeX>.
      </div>

      {sectionBreak}

      <div className={styles.paragraph}>
        Heuristic stretegies are effective when the amount of allotted time for
        calculations is limited, because they only look one step ahead when
        evaluating a potential guess. However, if we are to find the guess that
        is truly the most effective for each game state, we need to look at all
        steps ahead until the secret code is found. This method is called{" "}
        <em>exhaustive search</em>, and it can be used to find what Gur refers
        to as the <em>optimal strategy</em>. Since every single possibility is
        checked with this strategy, it is impossible to find a method that is
        any better than this one. Therefore, its results have been used as a
        benchmark for heuristic strategies. The first publication which included
        an optimal strategy for {mastermind} was in 1993, when Koyoma and Lai
        used a supercomputer to find the solution for <TeX math="M_{4, 6}" />.
      </div>

      <div className={styles.paragraph}>
        Calculating every possible <TeX math="M_{4, 6}" /> game from start to
        finish, where the length of the game is capped at 6 because minimax can
        already achieve it in 5, would require us to check{" "}
        <TeX math="((6^4)(\binom{6}{2}-1))^6=3.57\times 10^{25}" /> games. This
        is an absurdly high number, and with modern computers it would take
        hundreds or thousands of years to finish the calculation. Obviously,
        this is not how Koyoma and Lai figured out the optimal game with the
        computational ability of the 90s. In order to successfully search
        through the space of all possible games, to find the optimal ones, we
        need to find areas which are not worth exploring.
      </div>

      <div className={styles.paragraph}>
        Formally, before any optimizations are made, the number of games that
        are possible to explore in <TeX math="M_{n, k}" /> with a manually
        selected maximum game length <TeX>m</TeX> is
        <TeX
          block
          math={`
          \\begin{equation}
            \\left(k^n\\left(\\binom{n+2}{2}-1\\right)\\right)^m.
          \\end{equation}
        `}
        />
        The first optimization we can make is to eliminate all of the games
        which repeat the same guess multiple times, since this does not gain any
        information and is obviously not in the optimal strategy. Then the size
        of the new space of games to explore is
        <TeX
          block
          math={`
          \\begin{equation}
            \\left(k^n\\right)^{\\underline m}
            \\left(\\binom{n+2}{2}-1\\right)^m,
          \\end{equation}
        `}
        />
        where the underline refers to a falling factorial. Second, we can apply
        our knowledge from earlier about equivalent first guesses (primitive
        codes) to significantly reduce the size. Assuming that{" "}
        <TeX>k\geq n</TeX>, the number of primitive codes in{" "}
        <TeX math="S_{n, k}" /> is nontrivial but I believe that it is the{" "}
        <TeX>n</TeX>th{" "}
        <a href={references.sloane.url} target="_blank" rel="noreferrer">
          partition number
        </a>
        , which we will call <TeX>a(n)</TeX>. Then the number of games is
        reduced to
        <TeX
          block
          math={`
          \\begin{equation}
            a(n)
            \\left(k^n-1\\right)^{\\underline {m-1}}
            \\left(\\binom{n+2}{2}-1\\right)^m.
          \\end{equation}
        `}
        />
        Subsequent guesses also have equivalency, but due to the lack of obvious
        symmetry the groups are far more difficult to enumerate. Generally, two
        guesses are equivalent if the set of all responses each result in an
        equal reduction of the solution space. Thus, a naive approach is to
        generate a library of solution space reductions which can be used to
        eliminate potential guesses. Because there is not yet a clear closed
        form for this number, a formula is not provided at this step.
      </div>

      <div className={styles.paragraph}>
        After the equivalent codes have been removed, we have room for one more
        major reduction: if some information is known already, most codes should
        not be evaluated for all of the <TeX math="\binom{k+2}{2}" /> responses.
        For example, if a code is not a part of the known solution space then it
        cannot receive a response of <TeX math="\langle 4, 0, 0\rangle" /> and
        if it is consistent then it cannot receive a response of{" "}
        <TeX math="\langle 0, 0, 4\rangle" />. Furthermore, if the solution
        space is <TeX math="\{" />
        <InlineSolution code={[0, 1, 2, 2]} />,{" "}
        <InlineSolution code={[0, 4, 2, 2]} />
        <TeX math="\}" /> then the only possible responses for{" "}
        <InlineSolution code={[0, 1, 2, 2]} /> are{" "}
        <TeX math="\langle 3, 0, 1\rangle" /> and{" "}
        <TeX math="\langle 4, 0, 0\rangle" />.
      </div>

      <div className={styles.paragraph}>
        Even with all of these optimizations, the optimal solutions for{" "}
        {mastermind} take longer to calculate than can be comfortably included
        in this web demonstration. For the purposes of comparison, Gur found
        that the best possible average number of guesses for{" "}
        <TeX math="M_{4, 6}" /> is <TeX>4.3403,</TeX> but to acquire such a
        score there is <i>one</i> game that takes 6 guesses (longer than
        minimax!). If this is addressed, then the optimal strategy that solves
        every game in 5 or fewer guesses averages with <TeX>4.3410.</TeX>
      </div>

      {sectionBreak}

      <div className={styles.paragraph}>
        You may wonder why even though we have figured out the optimal strategy
        for {mastermind}, people continue to research heuristics and
        one-step-ahead metrics for guess evaluation. Of course, the primary
        reason for doing so is the joy of mathematical discovery. In addition,
        however, code-breaking games are only a small example of the types of
        problems that exist in the field of information theory. Many of the
        problems in this field are far too large to brute force, even after
        immense optimizations like those that we discovered when calculating the
        optimal strategy for {mastermind}. If new discoveries are made when
        exploring a game like this, there is a chance that they may be
        generalized to improve our algorithms for adjacent solution space
        searches, like the Traveling Salesman problem. And that's not even to
        mention Wordle.
      </div>

      {sectionBreak}

      <div className={styles.paragraph}>
        Before you go, you're welcome to play around with this all encompassing{" "}
        {mastermind} game, which has{" "}
        <NumberScrubber
          value={final_numColors}
          updateValue={setFinal_numColors}
          min={1}
          max={9}
        />{" "}
        colors and a code of length{" "}
        <NumberScrubber
          value={final_wordLength}
          updateValue={setFinal_wordLength}
          min={1}
          max={6}
        />
        . I can't promise that your browser won't crash with max settings,
        though.
      </div>

      <MastermindWithEverything
        numColors={final_numColors}
        wordLength={final_wordLength}
        heuristics={{
          minimax: minimax,
          "expected value": expectedValue,
          entropy: entropy,
        }}
      />

      {sectionBreak}

      <div className={styles.paragraph}>
        If you'd like to learn how this project was made, you're welcome to{" "}
        <a
          href="https://github.com/LuLaValva/lukelavalva.com/tree/main/src/Pages/MathSeminarPaper"
          target="_blank"
          rel="noreferrer"
        >
          explore the code on GitHub
        </a>
        .
      </div>

      <Bibliography citations={references} />

      {sectionBreak}

      <div className={styles.aside} style={{ textAlign: "center" }}>
        For more shenanigans, check out <Link to="/">my website</Link>.
      </div>
    </div>
  );
};

export default MathSeminarPaper;
