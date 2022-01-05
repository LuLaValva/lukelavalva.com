import React from "react";
import { Player } from "./GreedyGorillasPage";
import GorillaDisplay from "./GorillaDisplay";
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
          <GorillaDisplay
            key={connectionId}
            player={props.players[connectionId]}
          />
        ))}
      </div>
    </>
  );
};

export default GreedyGorillasGame;
