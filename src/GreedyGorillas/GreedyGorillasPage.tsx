import React, { useCallback, useEffect, useMemo, useState } from "react";
import GGLogin from "./GGLogin";
import { ApiConstants } from "../consts";
import GreedyGorillasGame from "./GreedyGorillasGame";
import GreedyGorillasLobby from "./GreedyGorillasLobby";

export type Player = {
  connectionId: string;
  room: string;
  username: string;
  score: number;
  knownRole?: number;
};

export type GameState = {
  turn: number;
  playerOrder: string[];
  roleList: number[];
  startingPoints: number;
  pointsToWin: number;
  lastAction?: {
    playerId: string;
    role: number;
  };
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
    startingPoints: -1,
    pointsToWin: -1,
    lastAction: undefined,
  });

  const playerSubactions: { [action: string]: (data: any) => void } =
    useMemo(() => {
      return {
        showRole: (data: any) => {
          setPlayers((currentPlayers) => {
            return {
              ...currentPlayers,
              [data.targetPlayer]: {
                ...currentPlayers[data.targetPlayer],
                knownRole: data.role,
              },
            };
          });
        },
        hideRole: (data: any) => {
          if (players[data.targetPlayer].knownRole) {
            setPlayers((currentPlayers) => {
              const newPlayers: { [connectionId: string]: Player } = {
                ...currentPlayers,
                [data.targetPlayer]: {
                  ...currentPlayers[data.targetPlayer],
                },
              };
              delete newPlayers[data.targetPlayer].knownRole;
              return newPlayers;
            });
          }
        },
        incrementPlayerScores: (data: any) => {
          data.scoreUpdates.forEach(
            (scoreUpdate: { connectionId: string; change: number }) => {
              setPlayers((currentPlayers) => {
                return {
                  ...currentPlayers,
                  [scoreUpdate.connectionId]: {
                    ...currentPlayers[scoreUpdate.connectionId],
                    score:
                      currentPlayers[scoreUpdate.connectionId].score +
                      scoreUpdate.change,
                  },
                };
              });
            }
          );
        },
      };
    }, [players]);

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
              lastAction: undefined,
              playerOrder: data.playerOrder,
              roleList: data.finalRoles,
            };
          });
          setPlayers((currentPlayers) => {
            // Object map idea attained from https://stackoverflow.com/a/14810722
            return Object.fromEntries(
              Object.entries(currentPlayers).map(([key, player]) => [
                key,
                {
                  ...player,
                  score: data.points,
                  knownRole: key === connectionId ? data.yourRole : undefined,
                },
              ])
            );
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
        applyPlayerAction: (data: any) => {
          if (data.newTurn !== undefined) {
            setGameState((currentState) => {
              return {
                ...currentState,
                turn: data.newTurn,
              };
            });
          }
          setGameState((currentState) => {
            return {
              ...currentState,
              lastAction: data.lastAction,
            };
          });
          if (data.subaction && playerSubactions[data.subaction]) {
            playerSubactions[data.subaction](data);
          }
        },
        updateStartingPoints: (data: any) => {
          setGameState((currentState) => {
            return {
              ...currentState,
              startingPoints: data.newStartingPoints,
            };
          });
        },
        updatePointsToWin: (data: any) => {
          setGameState((currentState) => {
            return {
              ...currentState,
              pointsToWin: data.newPointsToWin,
            };
          });
        },
      };
    }, [connectionId, gameState.turn, playerSubactions]);

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
        (wsConnection && gameState && gameState.turn !== -1 && (
          <GreedyGorillasGame
            players={players}
            connectionId={connectionId}
            gameState={gameState}
            wsConnection={wsConnection}
          />
        )) ||
        (wsConnection && (
          <GreedyGorillasLobby
            players={players}
            wsConnection={wsConnection}
            gameState={gameState}
          />
        ))}
    </>
  );
};

export default GreedyGorillasPage;
