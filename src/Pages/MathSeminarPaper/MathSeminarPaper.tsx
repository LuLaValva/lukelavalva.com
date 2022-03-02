import React from "react";
import styles from "../../styles/AcademicPaper.module.css";

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

import InteractiveMastermind from "./InteractiveMastermind";
import MastermindWithSolutionSpace from "./MastermindWithSolutionSpace";
import Bibliography from "./Bibliography";

const bibliography = [
  {
    title: "The Computer as Master Mind",
    authors: ["Donald Knuth"],
    year: 1977,
    url: "http://www.cs.uni.edu/~wallingf/teaching/cs3530/resources/knuth-mastermind.pdf",
  },
  {
    title: "Cracking the Mastermind Code",
    authors: ["Sylvester de Graaf"],
    year: 2019,
    url: "https://theses.liacs.nl/pdf/2018-2019-GraafSde.pdf",
  },
];

const mastermind = <i>Mastermind®</i>;

const MathSeminarPaper: React.FC = () => {
  return (
    <div className={styles.paper}>
      <h1>Cows, Bulls and Beyond</h1>
      <h2>Solving Code-Breaking Games with Information Theory</h2>
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
        <a href="http://slovesnov.users.sourceforge.net/index.php?bullscows_tree,,avgBullsCows">
          shown algorithmically by Alexey Slovesnov.
        </a>
      </div>
      <div className={styles.paragraph}>
        In the late 1960s, Mordecai Meirowitz slightly modified the rules of{" "}
        <i>Cows and Bulls</i> and rebranded it as {mastermind} before selling it
        to a plastics company for a large profit. The only differences that{" "}
        {mastermind} has from <i>Cows and Bulls</i> are that it uses 6
        differently colored pegs instead of 10 digits, and it allows for a code
        to contain multiple values that are the same. Cows are replaced with
        small white pins, and bulls with red ones. Below is an interactive
        version of {mastermind} with the standard set of rules.
      </div>
      <InteractiveMastermind />
      <div className={styles.paragraph}>
        Let us define any {mastermind} game as <TeX math="M_{n, k}" />, where{" "}
        <TeX>n</TeX>
        represents the length of the secret code and <TeX>k</TeX> is the number
        of available colors. Then, since each position can contain any of the{" "}
        <TeX>k</TeX> colors, the number of possible solutions <TeX>N</TeX> is
        found using <TeX block>N=k^n.</TeX> As a concrete example, the solution
        space of <TeX math="M_{2, 4}" /> has <TeX>4^2=16</TeX> unique solutions,
        which are displayed here.
      </div>
      <MastermindWithSolutionSpace>
        <div className={styles.paragraph}>
          Each time a guess is made in this <TeX math="M_{2, 4}" /> game, the
          "cows and bulls" (white and red pins) reveal a subset of solutions
          which are definitely <i>not</i> the secret code.
        </div>
      </MastermindWithSolutionSpace>
      <div className={styles.paragraph}>
        After exposure to this framework, one might imagine that each guess
        should be selected to reduce the size of the solution space as much as
        possible. This is the inspiration behind Donald Knuth's implementation
        of the minimax algorithm in his {mastermind} solver.
      </div>
      <Bibliography citations={bibliography} />
    </div>
  );
};

export default MathSeminarPaper;
