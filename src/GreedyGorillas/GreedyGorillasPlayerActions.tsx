import React from "react";
import { Player, GameState } from "./GreedyGorillasPage";
import styles from "../styles/GreedyGorillas.module.css";

interface Props {
  players: { [connectionId: string]: Player };
  gameState: GameState;
  connectionId: String;
  wsConnection: WebSocket;
}

const GreedyGorillasPlayerActions = (props: Props) => {
  const changeRole = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "changeRole",
      })
    );
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
        </>
      )}
    </div>
  );
};

export default GreedyGorillasPlayerActions;
