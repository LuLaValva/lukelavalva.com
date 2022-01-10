import React from "react";
import { Player, GameState } from "./GreedyGorillasPage";
import styles from "../styles/GreedyGorillas.module.css";

interface Props {
  players: { [connectionId: string]: Player };
  gameState: GameState;
  connectionId: String;
  wsConnection: WebSocket;
  requestPlayersFunction: (messages: string[]) => Promise<string[]>;
}

const GreedyGorillasPlayerActions = (props: Props) => {
  const changeRole = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "changeRole",
      })
    );
  };

  const beThief = () => {
    props
      .requestPlayersFunction(["Select somebody to steal from"])
      .then((connectionIds) => console.log(connectionIds));
  };
  const beCommunist = () => {
    props
      .requestPlayersFunction([
        "Select the gorilla you're taking from",
        "Select the gorilla you're giving to",
      ])
      .then((connectionIds) => console.log(connectionIds));
  };

  return (
    <div className={styles.buttonContainer}>
      <h2>Actions</h2>
      {props.gameState.playerOrder[
        props.gameState.turn % props.gameState.playerOrder.length
      ] === props.connectionId && (
        <>
          <div
            onClick={changeRole}
            className={`${styles.lobbyButton} ${styles.large}`}
          >
            Change Role
          </div>
          <div
            onClick={beThief}
            className={`${styles.lobbyButton} ${styles.large}`}
          >
            Thief
          </div>
          <div
            onClick={beCommunist}
            className={`${styles.lobbyButton} ${styles.large}`}
          >
            Communist
          </div>
        </>
      )}
    </div>
  );
};

export default GreedyGorillasPlayerActions;
