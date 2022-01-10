import React from "react";
import { Player } from "./GreedyGorillasPage";
import styles from "../styles/GreedyGorillas.module.css";
import GorillaRiveComponent from "./GorillaRiveComponent";
import { ApiConstants } from "../consts";

interface Props {
  player: Player;
  isYou: boolean;
  isOnTheClock: boolean;
  clickRequestFunc?: (connectionId: string) => void;
}

const PlayerDisplay = (props: Props) => {
  return (
    <div
      className={`${styles.playerDisplayBox} ${
        props.isYou && styles.mainPlayerDisplayBox
      } ${props.isOnTheClock && styles.currentPlayerDisplayBox} ${
        !props.isYou && props.clickRequestFunc !== undefined && styles.clickable
      }`}
      onClick={() =>
        !props.isYou &&
        props.clickRequestFunc &&
        props.clickRequestFunc(props.player.connectionId)
      }
    >
      <GorillaRiveComponent player={props.player} />
      <h2>{props.player.username}</h2>
      <h1 className={styles.playerScore}>{props.player.gameState.points}</h1>
      <h3 className={styles.playerRole}>
        {
          ApiConstants.GREEDY_GORILLAS_ROLES[
            props.player.gameState.apparentRole ||
              props.player.gameState.knownRole ||
              0
          ]
        }
      </h3>
    </div>
  );
};

export default PlayerDisplay;
