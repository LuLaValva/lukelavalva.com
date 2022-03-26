import React, { useState } from "react";
import styles from "../../styles/AcademicPaper.module.css";

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

import InteractiveMastermind from "./InteractiveMastermind";
import MastermindWithSolutionSpace from "./MastermindWithSolutionSpace";
import Bibliography from "./Bibliography";
import NumberScrubber from "./NumberScrubber";

const bibliography = {
  knuth77: {
    title: "The Computer as Master Mind",
    authors: ["Donald Knuth"],
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
};

const mastermind = <i>Mastermind®</i>;
const sectionBreak = <div className={styles.sectionBreak} />;

const MathSeminarPaper: React.FC = () => {
  const [mastermind1_numColors, updateMastermind1_numColors] = useState(6);
  const [mastermind1_wordLength, updateMastermind1_wordLength] = useState(4);

  const [solSpace1_numColors, updateSolSpace1_numColors] = useState(4);
  const [solSpace1_wordLength, updateSolSpace1_wordLength] = useState(2);

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
        <a href={bibliography.solvesnov.url} target="_blank" rel="noreferrer">
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
        digit, then we can quickly find all values in <TeX math="S_{n, k}." />{" "}
        by listing all <TeX>n</TeX>-digit integers with a base of <TeX>k.</TeX>{" "}
        Because there are <TeX>k</TeX> choices for each of the <TeX>n</TeX>{" "}
        positions, the size of this set can be found using
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
      <div className={styles.paragraph}>
        Most computational {mastermind} strategies are based on the idea of
        choosing each guess based on the expected resulting reduction of the
        solution space. In{" "}
        <a href={bibliography.gur21.url} target="_blank" rel="noreferrer">
          Serkan Gur's 2016 analysis of {mastermind}
        </a>
        , he labels these as <em>heuristic strategies</em>.
      </div>

      {sectionBreak}

      <div className={styles.paragraph}>
        The first person who publicly documented knowledge of their
        computational solution to {mastermind} was the computing legend and
        oft-proclaimed "father of algorithm analysis" Donald Knuth, in his short
        work entitled{" "}
        <a href={bibliography.knuth77.url} target="_blank" rel="noreferrer">
          The Computer As Master Mind
        </a>
        . In this work, he applied what is known as the <em>minimax</em>{" "}
        algorithm in information theory.
      </div>
      <Bibliography citations={bibliography} />
    </div>
  );
};

export default MathSeminarPaper;
