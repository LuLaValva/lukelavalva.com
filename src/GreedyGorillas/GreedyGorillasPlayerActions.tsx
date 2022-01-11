import React from "react";
import { Player, GameState } from "./GreedyGorillasPage";
import styles from "../styles/GreedyGorillas.module.css";

interface ActionButtonProps {
  text: string;
  onClick: () => void;
}

const ActionButton = (props: ActionButtonProps) => {
  return (
    <div
      onClick={props.onClick}
      className={`${styles.lobbyButton} ${styles.large}`}
    >
      {props.text}
    </div>
  );
};

interface Props {
  players: { [connectionId: string]: Player };
  gameState: GameState;
  connectionId: String;
  wsConnection: WebSocket;
  requestPlayersFunction: (messages: string[]) => Promise<string[]>;
}

const GreedyGorillasPlayerActions = (props: Props) => {
  const changeRole = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "changeRole",
      })
    );
  };

  const beRegularGorilla = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "actAsNormalGorilla",
      })
    );
  };

  const beThief = () => {
    props
      .requestPlayersFunction(["Select somebody to steal from"])
      .then(([targetPlayer]) => {
        props.wsConnection.send(
          JSON.stringify({
            action: "actAsThief",
            stealingFrom: targetPlayer,
          })
        );
      });
  };

  const bePI = () => {
    props
      .requestPlayersFunction(["Select somebody to reveal"])
      .then(([targetPlayer]) => {
        props.wsConnection.send(
          JSON.stringify({
            action: "actAsPI",
            revealingFrom: targetPlayer,
          })
        );
      });
  };

  const beSnarlMarx = () => {
    props
      .requestPlayersFunction([
        "Select the gorilla you're taking from",
        "Select the gorilla you're giving to",
      ])
      .then(([takingFrom, givingTo]) => {
        props.wsConnection.send(
          JSON.stringify({
            action: "actAsCommunist",
            takingFrom: takingFrom,
            givingTo: givingTo,
          })
        );
      });
  };

  const beRobber = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "actAsRobber",
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
          <ActionButton onClick={changeRole} text="Change Role" />
          <ActionButton onClick={beRegularGorilla} text="Gorilla" />
          {props.gameState.roleList.includes(2) && (
            <ActionButton onClick={beThief} text="Thief" />
          )}
          {props.gameState.roleList.includes(4) && (
            <ActionButton onClick={bePI} text="P.I." />
          )}
          {props.gameState.roleList.includes(5) && (
            <ActionButton onClick={beSnarlMarx} text="Communist" />
          )}
          {props.gameState.roleList.includes(6) && (
            <ActionButton onClick={beRobber} text="Robber" />
          )}
        </>
      )}
    </div>
  );
};

export default GreedyGorillasPlayerActions;
