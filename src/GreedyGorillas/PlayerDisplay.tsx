import React, { useEffect, useState } from "react";
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
  const [visibleRole, setVisibleRole] = useState(0);

  useEffect(() => {
    setVisibleRole(
      props.player.gameState.knownRole ||
        props.player.gameState.apparentRole ||
        0
    );
  }, [props.player.gameState.apparentRole, props.player.gameState.knownRole]);

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
      <GorillaRiveComponent activeRole={visibleRole} />
      <h2>{props.player.username}</h2>
      <h1 className={styles.playerScore}>{props.player.gameState.points}</h1>
      <h3 className={styles.playerRole}>
        {ApiConstants.GREEDY_GORILLAS_ROLES[visibleRole]}
        {props.player.gameState.apparentRole &&
        !props.player.gameState.knownRole
          ? "?"
          : ""}
      </h3>
    </div>
  );
};

export default PlayerDisplay;
