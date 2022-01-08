import React, { useCallback, useEffect, useMemo, useState } from "react";
import GGLogin from "./GGLogin";
import { ApiConstants } from "../consts";
import GreedyGorillasGame from "./GreedyGorillasGame";
import GreedyGorillasLobby from "./GreedyGorillasLobby";

export type Player = {
  connectionId: string;
  room: string;
  username: string;
  gameState: {
    points: number;
    knownRole?: number;
    apparentRole?: number;
  };
};

export type GameState = {
  turn: number;
  playerOrder: string[];
  roleList: number[];
};

const GreedyGorillasPage: React.FC = () => {
  const [wsConnection, setWsConnection] = useState<WebSocket>();
  const [players, setPlayers] = useState<{ [connectionId: string]: Player }>(
    {}
  );
  const [connectionId, setConnectionId] = useState("");
  const [gameState, setGameState] = useState<GameState>({
    turn: -1,
    playerOrder: [],
    roleList: [],
  });

  const socketMessageActions: { [action: string]: (data: any) => void } =
    useMemo(() => {
      return {
        playerJoin: (data: any) => {
          setPlayers((currentPlayers) => {
            return {
              ...currentPlayers,
              [data.player.connectionId]: data.player,
            };
          });
          console.log(`Player "${data.player.username}" joined the room`);
        },
        playerExit: (data: any) => {
          if (gameState.turn !== -1) {
            console.log(
              `"${data.player.username}" left mid-game! The game has been forced to quit as a result.`
            );
          }
          setGameState((prevState) => {
            return {
              ...prevState,
              turn: -1,
            };
          });
          setPlayers((currentPlayers) => {
            const newPlayers = { ...currentPlayers };
            delete newPlayers[data.player.connectionId];
            return newPlayers;
          });
          console.log(`Player "${data.player.username}" left the room`);
        },
        initializePlayer: (data: any) => {
          setPlayers((currentPlayers) => {
            return {
              ...currentPlayers,
              ...Object.fromEntries(
                data.players.map((player: Player) => [
                  player.connectionId,
                  player,
                ])
              ),
            };
          });
          setConnectionId(data.you);
          setGameState(data.gameState);
        },
        startGame: (data: any) => {
          setGameState((currentState) => {
            return {
              ...currentState,
              turn: 0,
              playerOrder: data.playerOrder,
              roleList: data.finalRoles,
            };
          });
          setPlayers((currentPlayers) => {
            return {
              ...currentPlayers,
              [connectionId]: {
                ...currentPlayers[connectionId],
                gameState: {
                  ...currentPlayers[connectionId].gameState,
                  knownRole: data.yourRole,
                },
              },
            };
          });
        },
        updateRoles: (data: any) => {
          setGameState((currentState) => {
            return {
              ...currentState,
              roleList: data.newRoles,
            };
          });
        },
      };
    }, [connectionId, gameState.turn]);

  const receiveMessage = useCallback(
    (message: MessageEvent<any>) => {
      const parsedData = JSON.parse(message.data);
      console.log(parsedData);
      parsedData.action && socketMessageActions[parsedData.action](parsedData);
    },
    [socketMessageActions]
  );

  useEffect(() => {
    if (wsConnection) wsConnection.onmessage = receiveMessage;
  }, [wsConnection, receiveMessage]);

  const connectToSocket = (username: string, room: string) => {
    const baseUrl = new URL(ApiConstants.GREEDY_GORILLAS_URL);
    baseUrl.searchParams.append("username", username);
    baseUrl.searchParams.append("room", room);

    const socket = new WebSocket(baseUrl.href);

    socket.onopen = () => {
      socket.send(JSON.stringify({ action: "getRoomMembers" }));
    };

    socket.onmessage = receiveMessage;

    setWsConnection(socket);
  };

  return (
    <>
      {(wsConnection === undefined && (
        <GGLogin socketConnectionFunction={connectToSocket} />
      )) ||
        (gameState && gameState.turn !== -1 && (
          <GreedyGorillasGame
            players={players}
            connectionId={connectionId}
            gameState={gameState}
          />
        )) ||
        (wsConnection && (
          <GreedyGorillasLobby
            players={players}
            wsConnection={wsConnection}
            roles={gameState.roleList}
          />
        ))}
    </>
  );
};

export default GreedyGorillasPage;
