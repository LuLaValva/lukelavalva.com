import React, { useEffect, useState } from "react";
import styles from "../styles/GreedyGorillas.module.css";
import { Player, GameState } from "./GreedyGorillasPage";

interface Props {
  gameState: GameState;
  connectionId: string;
  players: { [connectionId: string]: Player };
  messageOverride?: string;
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
      {props.messageOverride || message}
    </div>
  );
};

export default GreedyGorillasHeaderMessage;
