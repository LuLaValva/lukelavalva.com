import React from "react";
import { Player, GameState } from "./GreedyGorillasPage";
import PlayerDisplay from "./PlayerDisplay";
import styles from "../styles/GreedyGorillas.module.css";
import GreedyGorillasPlayerActions from "./GreedyGorillasPlayerActions";

interface Props {
  players: { [connectionId: string]: Player };
  gameState: GameState;
  connectionId: string;
  wsConnection: WebSocket;
}

const GreedyGorillasGame = (props: Props) => {
  return (
    <>
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
      <GreedyGorillasPlayerActions
        players={props.players}
        gameState={props.gameState}
        connectionId={props.connectionId}
        wsConnection={props.wsConnection}
      />
    </>
  );
};

export default GreedyGorillasGame;
