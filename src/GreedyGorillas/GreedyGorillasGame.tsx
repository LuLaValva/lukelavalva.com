import React from "react";
import { Player, GameState } from "./GreedyGorillasPage";
import PlayerDisplay from "./PlayerDisplay";
import styles from "../styles/GreedyGorillas.module.css";

interface Props {
  players: { [connectionId: string]: Player };
  gameState: GameState;
  connectionId: string;
}

const GreedyGorillasGame = (props: Props) => {
  return (
    <>
      <h1>Greedy Gorillas!</h1>
      <div className={styles.allGorillas}>
        {props.gameState.playerOrder.map((connectionId, index) => (
          <PlayerDisplay
            key={connectionId}
            player={props.players[connectionId]}
            isYou={connectionId === props.connectionId}
            isOnTheClock={
              index ===
              props.gameState.turn % props.gameState.playerOrder.length
            }
          />
        ))}
      </div>
    </>
  );
};

export default GreedyGorillasGame;
