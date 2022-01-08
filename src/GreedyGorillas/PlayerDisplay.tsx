import React from "react";
import { Player } from "./GreedyGorillasPage";
import styles from "../styles/GreedyGorillas.module.css";
import GorillaRiveComponent from "./GorillaRiveComponent";

interface Props {
  player: Player;
  isYou: boolean;
  isOnTheClock: boolean;
}

const PlayerDisplay = (props: Props) => {
  return (
    <div
      className={`${styles.playerDisplayBox} ${
        props.isYou && styles.mainPlayerDisplayBox
      } ${props.isOnTheClock && styles.currentPlayerDisplayBox}`}
    >
      <GorillaRiveComponent player={props.player} />
      {props.player.username}
    </div>
  );
};

export default PlayerDisplay;
