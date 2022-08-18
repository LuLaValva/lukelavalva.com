import React, { useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import { Board, EMOJIS, Eval, evaluate, WordLength } from "./Wordle";
import WordleKeyboard, { GenericKeyHandler } from "./WordleKeyboard";
import styles from "./Wordle.module.css";

type EvalSet = {
  evals: (Eval[] | undefined)[];
  won: number | undefined;
};

const getEmojiRow = ({ evals, won }: EvalSet, i: number) =>
  evals[i]
    ?.map(
      (evaluation) => EMOJIS[won !== undefined && won < i ? -1 : evaluation]
    )
    .join("");

const evalsToEmojis = (evaluations: EvalSet[]) => {
  const [first, second, third] = evaluations;
  let emojis = "";
  for (
    let i = 0;
    first.won !== undefined && second.won !== undefined
      ? i <= first.won || i <= second.won
      : i < first.evals.length;
    i++
  ) {
    emojis += getEmojiRow(first, i) + "  " + getEmojiRow(second, i) + "\n";
  }

  emojis += "\n";

  for (
    let i = 0;
    third.won !== undefined ? i <= third.won : i < third.evals.length;
    i++
  ) {
    emojis += "            " + getEmojiRow(third, i) + "\n";
  }

  return emojis;
};

const makeGameCompleteMessage = (
  evaluations: {
    evals: (Eval[] | undefined)[];
    won: number | undefined;
  }[]
) => `444dle ${new Date().toLocaleDateString("en-US", {
  month: "numeric",
  day: "numeric",
  year: "2-digit",
})}: ${evaluations
  .map(({ won }) => (won === undefined ? "X" : won + 1))
  .join("|")}

${evalsToEmojis(evaluations)}

https://lukelavalva.com/444dle`;

const MultiWordle: React.FC<{
  numLetters: WordLength;
  numWords: number;
  seed: string;
  numGuesses?: number;
}> = ({ numLetters, numWords, seed, numGuesses = 8 }) => {
  const [wordList, setWordList] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[]>(() =>
    Array(numGuesses).fill("")
  );
  const [evaluations, setEvaluations] = useState<EvalSet[]>(() =>
    [...Array(numWords)].map(() => ({
      evals: Array(numGuesses),
      won: undefined,
    }))
  );
  const [numGuessed, setNumGuessed] = useState(0);
  const [guessedWrong, setGuessedWrong] = useState(false);
  const [keyColors, setKeyColors] = useState<{ [key: string]: Eval[] }>({});
  const [gameOver, setGameOver] = useState(false);

  const won = useMemo(
    () => evaluations.every((val) => val.won !== undefined),
    [evaluations]
  );

  useEffect(() => {
    (won || numGuessed === numGuesses) &&
      setTimeout(() => setGameOver(true), numLetters * 400 + 200);
  }, [numLetters, won, numGuessed, numGuesses]);

  useEffect(() => {
    guessedWrong && setTimeout(() => setGuessedWrong(false), 500);
  }, [guessedWrong]);

  useEffect(() => {
    const wordList: string[] =
      require(`./WordLists/words${numLetters}`).default;
    const common: string[] = require(`./WordLists/common${numLetters}`).default;
    setWordList(wordList);
    const rand = seedrandom(seed);
    setSolutions(
      [...Array(numWords)].map(() => common[Math.floor(rand() * common.length)])
    );
  }, [numWords, numLetters, seed]);

  const addKeyColor = (key: string, word: number, color: Eval) => {
    setKeyColors((keyColors) => {
      if (keyColors[key] === undefined || keyColors[key][word] < color) {
        const newKey =
          keyColors[key] === undefined
            ? Array(numWords).fill(Eval.MISS)
            : [...keyColors[key]];
        newKey[word] = color;
        return { ...keyColors, [key]: newKey };
      } else return keyColors;
    });
  };

  const submitWord = () => {
    const guess = guesses[numGuessed];
    if (wordList.includes(guess) || solutions.includes(guess)) {
      setEvaluations((evaluations) =>
        evaluations.map((evaluations, index) => {
          const newEvals = [...evaluations.evals];
          const latestWordEval = evaluate(guess, solutions[index]);
          latestWordEval.forEach((val, i) =>
            addKeyColor(guess.charAt(i), index, val)
          );
          newEvals[numGuessed] = latestWordEval;

          return {
            evals: newEvals,
            won:
              evaluations.won ??
              (latestWordEval.every((val) => val === Eval.BULL)
                ? numGuessed
                : undefined),
          };
        })
      );
      setNumGuessed(numGuessed + 1);
    } else {
      setGuessedWrong(true);
    }
  };

  const handleKeydown: GenericKeyHandler = ({ key }) => {
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
      <div className={styles.multiBoard}>
        {evaluations.map((evaluation, key) => (
          <Board
            key={key}
            numLetters={numLetters}
            guesses={guesses}
            evaluations={evaluation.evals}
            guessedWrong={guessedWrong}
            numGuessed={numGuessed}
            locked={evaluation.won}
          />
        ))}
      </div>

      <WordleKeyboard keyEvent={handleKeydown} keyColors={keyColors} />

      {gameOver && (
        <div className={styles.popup}>
          <h2>
            |{" "}
            {solutions.map((word) => (
              <>
                {" "}
                <em key={word}>{word}</em> |
              </>
            ))}
          </h2>
          <h1>{won ? "You Win!" : "You are awful at this."}</h1>
          <pre>
            {evaluations[0].evals
              .filter((row) => row !== undefined)
              .map((_, i) =>
                evaluations
                  .map(({ evals, won }) =>
                    evals[i]
                      ?.map(
                        (evaluation) =>
                          EMOJIS[won !== undefined && won < i ? -1 : evaluation]
                      )
                      .join("")
                  )
                  .join("   ")
              )
              .join("\n")}
          </pre>
          <button
            onClick={() => {
              if (navigator.share !== undefined) {
                navigator.share({
                  text: makeGameCompleteMessage(evaluations),
                });
              } else {
                navigator.clipboard.writeText(
                  makeGameCompleteMessage(evaluations)
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

export default MultiWordle;
