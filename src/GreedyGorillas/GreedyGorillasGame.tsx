import React, { useState } from "react";
import { Player, GameState } from "./GreedyGorillasPage";
import PlayerDisplay from "./PlayerDisplay";
import styles from "../styles/GreedyGorillas.module.css";
import GreedyGorillasPlayerActions from "./GreedyGorillasPlayerActions";
import GreedyGorillasHeaderMessage from "./GreedyGorillasHeaderMessage";

interface Props {
  players: { [connectionId: string]: Player };
  gameState: GameState;
  connectionId: string;
  wsConnection: WebSocket;
}

const GreedyGorillasGame = (props: Props) => {
  const [playerRequestFunction, setPlayerRequestFunction] =
    useState<(connectionId: string) => void>();
  const [headerMessageOverride, setHeaderMessageOverride] = useState<string>();
  const [requestedPlayerList, setRequestedPlayerList] = useState<string[]>([]);

  const requestPlayerClicks = async (messages: string[]) => {
    await messages.reduce(
      (previousPromise, message) =>
        previousPromise.then(
          () =>
            new Promise((resolve) => {
              setHeaderMessageOverride(message);
              setPlayerRequestFunction(() => {
                return (connectionId: string) => {
                  setRequestedPlayerList((currentList) => [
                    ...currentList,
                    connectionId,
                  ]);
                  resolve();
                };
              });
            })
        ),
      Promise.resolve()
    );
    setHeaderMessageOverride(undefined);
    setPlayerRequestFunction(undefined);
    let requestedPlayers: string[] = [];
    setRequestedPlayerList((updatedPlayerList) => {
      requestedPlayers = updatedPlayerList;
      return [];
    });
    return requestedPlayers;
  };

  return (
    <>
      <GreedyGorillasHeaderMessage
        players={props.players}
        gameState={props.gameState}
        connectionId={props.connectionId}
        messageOverride={headerMessageOverride}
      />
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
            clickRequestFunc={
              requestedPlayerList.includes(connectionId)
                ? undefined
                : playerRequestFunction
            }
          />
        ))}
      </div>
      <GreedyGorillasPlayerActions
        players={props.players}
        gameState={props.gameState}
        connectionId={props.connectionId}
        wsConnection={props.wsConnection}
        requestPlayersFunction={requestPlayerClicks}
      />
    </>
  );
};

export default GreedyGorillasGame;
