import React, { useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import styles from "./Wordle.module.css";
import WordleKeyboard from "./WordleKeyboard";

export type WordLength = 4 | 5 | 6 | 7;
export enum Eval {
  MISS,
  COW,
  BULL,
}

export const EVAL_COLORS = {
  [Eval.MISS]: "#777",
  [Eval.COW]: "#a80",
  [Eval.BULL]: "#080",
};

export const EMOJIS = {
  [Eval.MISS]: "⚪",
  [Eval.COW]: "🟠",
  [Eval.BULL]: "🟢",
  [-1]: "⚫",
};

const makeGameCompleteMessage = (
  evaluations: (Eval[] | undefined)[],
  score: number | undefined
) => `LaVordle ${new Date().toLocaleDateString("en-US", {
  month: "numeric",
  day: "numeric",
  year: "2-digit",
})}: ${score ?? "X"}/${evaluations.length}

${evaluations
  .filter((row) => row !== undefined)
  .map((row) =>
    (row as Eval[]).map((evaluation) => EMOJIS[evaluation]).join("")
  )
  .join("\n")}

https://lukelavalva.com/wordle`;

export function evaluate(guess: string, solution: string) {
  const solChars = solution.split("");
  const evaluation: Eval[] = Array(guess.length).fill(Eval.MISS);
  for (let i = guess.length - 1; i >= 0; i--) {
    if (solChars[i] === guess.charAt(i)) {
      solChars.splice(i, 1);
      evaluation[i] = Eval.BULL;
    }
  }
  for (let i = guess.length - 1; i >= 0; i--)
    if (evaluation[i] !== Eval.BULL) {
      const foundIndex = solChars.indexOf(guess.charAt(i));
      if (foundIndex !== -1) {
        solChars.splice(foundIndex, 1);
        evaluation[i] = 1;
      }
    }
  return evaluation;
}

export const Letter: React.FC<{
  char?: string;
  evaluation?: Eval;
  index: number;
}> = ({ char, evaluation, index }) => {
  let displayClass = styles.empty;
  if (char) displayClass = styles.typing;
  if (evaluation !== undefined) displayClass = styles.guessed;

  return (
    <div
      className={styles.letter + " " + displayClass}
      style={{
        backgroundColor:
          evaluation === undefined ? undefined : EVAL_COLORS[evaluation],
        animationDelay: evaluation === undefined ? "0" : index * 0.4 + "s",
        transitionDelay:
          evaluation === undefined ? "0" : index * 0.4 + 0.2 + "s",
      }}
    >
      {char?.toUpperCase()}
    </div>
  );
};

export const Row: React.FC<{
  numLetters: WordLength;
  word: string;
  evaluation?: Eval[];
  guessedWrong?: boolean;
}> = ({ numLetters, word, evaluation, guessedWrong }) => {
  return (
    <div
      className={styles.word + " " + (guessedWrong ? styles.guessedWrong : "")}
    >
      {[...Array(numLetters)].map((_, i) => (
        <Letter
          key={i}
          index={i}
          char={word.length < i ? undefined : word.charAt(i)}
          evaluation={evaluation ? evaluation[i] : undefined}
        />
      ))}
    </div>
  );
};

export const Board: React.FC<{
  numLetters: WordLength;
  guesses: string[];
  evaluations: (Eval[] | undefined)[];
  numGuessed: number;
  guessedWrong: boolean;
  locked?: number;
}> = ({
  numLetters,
  guesses,
  evaluations,
  numGuessed,
  guessedWrong,
  locked,
}) => {
  return (
    <div className={styles.wordBox + " " + (locked && styles.locked)}>
      {guesses.map((guess, i) => (
        <Row
          key={i}
          numLetters={numLetters}
          word={locked !== undefined && i > locked ? "" : guess}
          evaluation={
            locked !== undefined && i > locked ? undefined : evaluations[i]
          }
          guessedWrong={numGuessed === i && guessedWrong}
        />
      ))}
    </div>
  );
};

const Wordle: React.FC<{
  numLetters: WordLength;
  seed: string;
}> = ({ numLetters = 5, seed = "" }) => {
  const NUM_GUESSES = 6;

  const [wordList, setWordList] = useState<string[]>([]);
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState<string[]>(() =>
    Array(NUM_GUESSES).fill("")
  );
  const [evaluations, setEvaluations] = useState<(Eval[] | undefined)[]>([
    ...Array(NUM_GUESSES),
  ]);
  const [numGuessed, setNumGuessed] = useState(0);
  const [guessedWrong, setGuessedWrong] = useState(false);
  const [keyColors, setKeyColors] = useState<{ [key: string]: Eval }>({});
  const [gameOver, setGameOver] = useState(false);
  const won = useMemo(
    () => evaluations[numGuessed - 1]?.every((val) => val === Eval.BULL),
    [evaluations, numGuessed]
  );

  useEffect(() => {
    guessedWrong && setTimeout(() => setGuessedWrong(false), 500);
  }, [guessedWrong]);

  useEffect(() => {
    const wordList: string[] =
      require(`./WordLists/words${numLetters}`).default;
    const common: string[] = require(`./WordLists/common${numLetters}`).default;
    setWordList(wordList);
    setSolution(common[Math.floor(seedrandom(seed)() * common.length)]);
  }, [numLetters, seed]);

  const addKeyColor = (key: string, color: Eval) => {
    setKeyColors((keyColors) => {
      if (keyColors[key] === undefined || keyColors[key] < color)
        return { ...keyColors, [key]: color };
      else return keyColors;
    });
  };

  const submitWord = () => {
    const guess = guesses[numGuessed];
    if (wordList.includes(guess) || guess === solution) {
      const newEvaluations = [...evaluations];
      const latestWordEval = evaluate(guess, solution);
      latestWordEval.forEach((val, i) => {
        addKeyColor(guess.charAt(i), val);
      });
      newEvaluations[numGuessed] = latestWordEval;
      setEvaluations(newEvaluations);
      setNumGuessed(numGuessed + 1);
      if (
        latestWordEval.every((val) => val === Eval.BULL) ||
        numGuessed === NUM_GUESSES - 1
      )
        setTimeout(() => setGameOver(true), numLetters * 400 + 200);
    } else {
      setGuessedWrong(true);
    }
  };

  const handleKeydown = ({ key }: { key: string }) => {
    if (
      key.length === 1 &&
      /[a-zA-Z]/.test(key) &&
      guesses[numGuessed].length < numLetters
    ) {
      key = key.toLowerCase();
      const newGuesses = [...guesses];
      newGuesses[numGuessed] += key;
      setGuesses(newGuesses);
    } else if (key === "Backspace" || key === "Delete") {
      const newGuesses = [...guesses];
      newGuesses[numGuessed] = newGuesses[numGuessed].slice(
        0,
        newGuesses[numGuessed].length - 1
      );
      setGuesses(newGuesses);
    } else if (key === "Enter") {
      submitWord();
    }
  };
  useEffect(() => {
    if (!gameOver) {
      document.addEventListener("keydown", handleKeydown);
      return () => document.removeEventListener("keydown", handleKeydown);
    }
  });

  return (
    <>
      <Board
        numLetters={numLetters}
        guesses={guesses}
        evaluations={evaluations}
        guessedWrong={guessedWrong}
        numGuessed={numGuessed}
      />

      <WordleKeyboard keyEvent={handleKeydown} keyColors={keyColors} />
      {/* Popup */}
      {gameOver && (
        <div className={styles.popup}>
          <h1>
            {won ? "You Win!" : "You are awful at this."} The word was{" "}
            <em>{solution}</em>.
          </h1>
          <pre>
            {makeGameCompleteMessage(evaluations, won ? numGuessed : undefined)}
          </pre>
          <button
            onClick={() => {
              if (navigator.share !== undefined) {
                navigator.share({
                  text: makeGameCompleteMessage(
                    evaluations,
                    won ? numGuessed : undefined
                  ),
                });
              } else {
                navigator.clipboard.writeText(
                  makeGameCompleteMessage(
                    evaluations,
                    won ? numGuessed : undefined
                  )
                );
                alert("copied!");
              }
            }}
          >
            Share
          </button>
        </div>
      )}
    </>
  );
};

export default Wordle;
