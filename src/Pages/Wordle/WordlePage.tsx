import React, { useMemo } from "react";
import seedrandom from "seedrandom";
import Wordle, { WordLength } from "./Wordle";

type Props = {};

const WordlePage = (props: Props) => {
  const [date, numLetters] = useMemo(() => {
    const dateString = new Date().toDateString();
    const numLetters = Math.floor(
      seedrandom(dateString)() * 4 + 3
    ) as WordLength;
    return [dateString, numLetters];
  }, []);

  return <Wordle numLetters={numLetters} seed={date} />;
};

export default WordlePage;
