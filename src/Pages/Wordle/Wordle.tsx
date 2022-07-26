import React, { useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import styles from "./Wordle.module.css";
import WordleKeyboard from "./WordleKeyboard";

export type WordLength = 4 | 5 | 6 | 7;

const MISS = 0,
  COW = 1,
  BULL = 2;

export const colorClasses = {
  [MISS]: "miss",
  [COW]: "cow",
  [BULL]: "bull",
};
const EMOJIS = {
  [MISS]: "⚪",
  [COW]: "🟠",
  [BULL]: "🟢",
};

const makeGameCompleteMessage = (
  evaluations: ((0 | 1 | 2)[] | undefined)[],
  score: number
) => `LaVordle ${new Date().toLocaleDateString()}: ${score}/${
  evaluations.length
}

${evaluations
  .filter((row) => row !== undefined)
  .map((row) =>
    (row as (0 | 1 | 2)[]).map((evaluation) => EMOJIS[evaluation]).join("")
  )
  .join("\n")}

https://lukelavalva.com/wordle`;

function evaluate(
  guess: string,
  solution: string,
  addKeyColor: (key: string, color: 0 | 1 | 2) => void
) {
  const solChars = solution.split("");
  const evaluation: (0 | 1 | 2)[] = Array(guess.length).fill(MISS);
  for (let i = guess.length - 1; i >= 0; i--) {
    addKeyColor(guess.charAt(i), MISS);
    if (solChars[i] === guess.charAt(i)) {
      solChars.splice(i, 1);
      evaluation[i] = BULL;
      addKeyColor(guess.charAt(i), BULL);
    }
  }
  for (let i = guess.length - 1; i >= 0; i--)
    if (evaluation[i] !== BULL) {
      const foundIndex = solChars.indexOf(guess.charAt(i));
      if (foundIndex !== -1) {
        solChars.splice(foundIndex, 1);
        evaluation[i] = 1;
        addKeyColor(guess.charAt(i), COW);
      }
    }
  return evaluation;
}

const Letter: React.FC<{
  char?: string;
  evaluation?: 0 | 1 | 2;
  index: number;
}> = ({ char, evaluation, index }) => {
  let displayClass = styles.empty;
  if (char) displayClass = styles.typing;
  if (evaluation !== undefined) displayClass = styles.guessed;

  return (
    <div
      className={[
        styles.letter,
        displayClass,
        evaluation === undefined ? undefined : styles[colorClasses[evaluation]],
      ].join(" ")}
      style={{
        animationDelay: evaluation === undefined ? "0" : index * 0.4 + "s",
        transitionDelay:
          evaluation === undefined ? "0" : index * 0.4 + 0.2 + "s",
      }}
    >
      {char?.toUpperCase()}
    </div>
  );
};

const Row: React.FC<{
  numLetters: WordLength;
  word: string;
  evaluation?: (0 | 1 | 2)[];
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
  const [evaluations, setEvaluations] = useState<((0 | 1 | 2)[] | undefined)[]>(
    [...Array(NUM_GUESSES)]
  );
  const [numGuessed, setNumGuessed] = useState(0);
  const [guessedWrong, setGuessedWrong] = useState(false);
  const [keyColors, setKeyColors] = useState<{ [key: string]: 0 | 1 | 2 }>({});
  const [gameOver, setGameOver] = useState(false);
  const won = useMemo(
    () => evaluations[numGuessed - 1]?.every((val) => val === BULL),
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

  const addKeyColor = (key: string, color: 0 | 1 | 2) => {
    setKeyColors((keyColors) => {
      if (keyColors[key] === undefined || keyColors[key] < color)
        return { ...keyColors, [key]: color };
      else return keyColors;
    });
  };

  const submitWord = () => {
    const guess = guesses[numGuessed];
    if (wordList.includes(guess)) {
      const newEvaluations = [...evaluations];
      const latestWordEval = evaluate(guess, solution, addKeyColor);
      newEvaluations[numGuessed] = latestWordEval;
      setEvaluations(newEvaluations);
      setNumGuessed(numGuessed + 1);
      if (
        latestWordEval.every((val) => val === BULL) ||
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
      <div className={styles.wordBox}>
        {guesses.map((guess, i) => (
          <Row
            key={i}
            numLetters={numLetters}
            word={guess}
            evaluation={evaluations[i]}
            guessedWrong={numGuessed === i && guessedWrong}
          />
        ))}
      </div>
      <WordleKeyboard keyEvent={handleKeydown} keyColors={keyColors} />
      {/* Popup */}
      {gameOver && (
        <div className={styles.popup}>
          <h1>{won ? "You Win!" : "You are awful at this."}</h1>
          <pre>{makeGameCompleteMessage(evaluations, numGuessed)}</pre>
          <button
            onClick={() => {
              if (navigator.share !== undefined) {
                navigator.share({
                  text: makeGameCompleteMessage(evaluations, numGuessed),
                });
              } else {
                navigator.clipboard.writeText(
                  makeGameCompleteMessage(evaluations, numGuessed)
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
