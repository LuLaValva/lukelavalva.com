import React, { useEffect, useState } from "react";
import styles from "./GreedyGorillas.module.css";
import { Player, GameState } from "./GreedyGorillasPage";

interface Props {
  gameState: GameState;
  connectionId: string;
  players: { [connectionId: string]: Player };
  latestMessage: string;
}

const GreedyGorillasHeaderMessage = (props: Props) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentPlayer =
      props.players[
        props.gameState.playerOrder[
          props.gameState.turn % props.gameState.playerOrder.length
        ]
      ];
    if (currentPlayer.connectionId === props.connectionId) {
      setMessage("You're up!");
    } else {
      setMessage(`${currentPlayer.username} is up`);
    }
  }, [
    props.connectionId,
    props.players,
    props.gameState.playerOrder,
    props.gameState.turn,
  ]);

  return (
    <div className={styles.gameHeaderMessage}>
      <p>{props.latestMessage}</p>
      <p>{message}</p>
    </div>
  );
};

export default GreedyGorillasHeaderMessage;
