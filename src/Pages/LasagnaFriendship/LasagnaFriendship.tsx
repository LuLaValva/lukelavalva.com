import React, { useEffect, useState } from "react";
import styles from "./LasagnaFriendship.module.css";

const QUESTIONS = [
  { q: "What do beefers pack?", a: "THE BEEF" },
  { q: "What do forests pack?", a: "THE WOODS" },
  { q: "What isn't sonic?", a: "A POKEMON" },
  { q: "Why don't bees feel pain? (one word)", a: "FAT" },
  { q: "What color is the secret crayon?", a: "CLEAR" },
  { q: "What is bro's last name in my phone?", a: "LASAGNA-FRIENDSHIP" },
];

const LasagnaFriendship = () => {
  const [dim, setDim] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  const [guess, changeGuess] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value =
      e.target.value
        .match(/[\w -]/g)
        ?.join("")
        .toUpperCase() || "";
    changeGuess(e.target.value);
  };

  useEffect(() => {
    const handleResize = () =>
      setTimeout(
        () => setDim({ x: window.innerWidth, y: window.innerHeight }),
        5
      );

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    if (guess === QUESTIONS[questionIndex]?.a) {
      setQuestionIndex(questionIndex + 1);
      changeGuess("");
    }
  }, [guess, questionIndex]);

  return questionIndex === QUESTIONS.length ? (
    <video width={dim.x} height={dim.y} autoPlay>
      <source src="/happy-birthday.mp4" type="video/mp4" />
      Your browser does not support video
    </video>
  ) : (
    <>
      <div className={styles.question}>
        <h2>{QUESTIONS[questionIndex].q}</h2>
        <input value={guess} onChange={handleGuessChange} />
      </div>
    </>
  );
};

export default LasagnaFriendship;
