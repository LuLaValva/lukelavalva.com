import React from "react";
import { Player } from "./GreedyGorillasPage";
import styles from "../styles/GreedyGorillas.module.css";
import GorillaRiveComponent from "./GorillaRiveComponent";

interface Props {
  player: Player;
  isYou: boolean;
}

const PlayerDisplay = (props: Props) => {
  return (
    <div className={styles.playerDisplayBox}>
      <GorillaRiveComponent player={props.player} />
      {props.player.username}
    </div>
  );
};

export default PlayerDisplay;
