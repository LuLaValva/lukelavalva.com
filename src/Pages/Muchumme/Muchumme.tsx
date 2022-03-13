import React, { useState } from "react";
import styles from "./Muchumme.module.css";

type Props = {};

const SECRET_CODE = "MOTHBALLS";

const Muchumme = (props: Props) => {
  const [codeGuess, changeCodeGuess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.match(/\w/g)?.join("").toUpperCase() || "";
    changeCodeGuess(e.target.value);
  };

  return codeGuess === SECRET_CODE ? (
    <>
      <h1>Sarosh's Birthday!</h1>
    </>
  ) : (
    <>
      <div className={styles.poem}>
        <p>Can you believe it's March fifteenth?</p>
        <p>A mere few dozen years ago,</p>
        <p>Saving this date was low</p>
        <p>However, the year 2000 changed the game</p>
        <p>Everybody saw a flame</p>
        <p>When, on the ides of March,</p>
        <p>Sarosh crawled out of his mother.</p>
      </div>

      <div className={styles.code}>
        <p>Enter the secret code here:</p>
        <input onChange={handleInputChange} />
      </div>
    </>
  );
};

export default Muchumme;
