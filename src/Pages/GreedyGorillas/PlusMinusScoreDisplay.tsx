import React from "react";
import styles from "./GreedyGorillas.module.css";

interface Props {
  score: number;
  changeAction: string;
  wsConnection: WebSocket;
  title: string;
}

const PlusMinusScoreDisplay = (props: Props) => {
  const changeScore = (newScore: number) => {
    props.wsConnection.send(
      JSON.stringify({
        action: props.changeAction,
        score: newScore,
      })
    );
  };

  return (
    <div className={styles.buttonContainer}>
      <h2>{props.title}</h2>
      <div
        onClick={() => changeScore(props.score - 1)}
        className={`${styles.lobbyButton} ${styles.small}`}
      >
        -
      </div>
      {props.score}
      <div
        onClick={() => changeScore(props.score + 1)}
        className={`${styles.lobbyButton} ${styles.small}`}
      >
        +
      </div>
    </div>
  );
};

export default PlusMinusScoreDisplay;
