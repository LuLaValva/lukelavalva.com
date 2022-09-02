import React from "react";
import { Player, GameState } from "./GreedyGorillasPage";
import styles from "./GreedyGorillas.module.css";

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
  connectionId: string;
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

  const callBluff = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "callBluff",
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

  const beCop = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "actAsCop",
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

  const beCIA = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "actAsCIA",
      })
    );
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
      {props.gameState.lastAction &&
        props.gameState.lastAction.playerId !== props.connectionId && (
          <>
            {props.players[props.connectionId].score > 3 && (
              <ActionButton onClick={callBluff} text="Call Bluff" />
            )}
            {props.gameState.lastAction.role === 2 &&
              props.gameState.roleList.includes(1) && (
                <ActionButton onClick={beCop} text="Cop" />
              )}
            {[5, 6].includes(props.gameState.lastAction.role) &&
              props.gameState.roleList.includes(3) && (
                <ActionButton onClick={beCIA} text="CIA" />
              )}
          </>
        )}
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
            <ActionButton onClick={bePI} text="Detective" />
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
