import React, { useState } from "react";
import { Player, GameState } from "./GreedyGorillasPage";
import PlayerDisplay from "./PlayerDisplay";
import styles from "./GreedyGorillas.module.css";
import GreedyGorillasPlayerActions from "./GreedyGorillasPlayerActions";
import GreedyGorillasHeaderMessage from "./GreedyGorillasHeaderMessage";

interface Props {
  players: { [connectionId: string]: Player };
  gameState: GameState;
  connectionId: string;
  wsConnection: WebSocket;
  latestMessage: string;
  setLatestMessage: React.Dispatch<React.SetStateAction<string>>;
}

const GreedyGorillasGame = (props: Props) => {
  const [playerRequestFunction, setPlayerRequestFunction] =
    useState<(connectionId: string) => void>();
  const [requestedPlayerList, setRequestedPlayerList] = useState<string[]>([]);

  const requestPlayerClicks = async (messages: string[]) => {
    await messages.reduce(
      (previousPromise, message) =>
        previousPromise.then(
          () =>
            new Promise((resolve) => {
              props.setLatestMessage(message);
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
        latestMessage={props.latestMessage}
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
            isPretendingToBe={
              props.gameState.lastAction?.playerId === connectionId
                ? props.gameState.lastAction.role
                : 0
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
