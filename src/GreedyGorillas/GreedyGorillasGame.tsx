import React from "react";
import { Player } from "./GreedyGorillasPage";
import PlayerDisplay from "./PlayerDisplay";
import styles from "../styles/GreedyGorillas.module.css";

interface Props {
  players: { [connectionId: string]: Player };
  playerOrder: string[];
}

const GreedyGorillasGame = (props: Props) => {
  return (
    <>
      <h1>Greedy Gorillas!</h1>
      <div className={styles.allGorillas}>
        {props.playerOrder.map((connectionId) => (
          <PlayerDisplay
            key={connectionId}
            player={props.players[connectionId]}
          />
        ))}
      </div>
    </>
  );
};

export default GreedyGorillasGame;
