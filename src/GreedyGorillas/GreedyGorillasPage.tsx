import React, { useState } from "react";
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
  room: string;
  turn: number;
  playerOrder: string[];
  roles: number[];
};

const GreedyGorillasPage: React.FC = () => {
  const [wsConnection, setWsConnection] = useState<WebSocket>();
  const [players, setPlayers] = useState<{ [connectionId: string]: Player }>(
    {}
  );
  const [gameState, setGameState] = useState<GameState>();

  const socketMessageActions: { [action: string]: (data: any) => void } = {
    playerJoin: (data: any) => {
      setPlayers((currentPlayers) => {
        return { ...currentPlayers, [data.player.connectionId]: data.player };
      });
      console.log(`Player "${data.player.username}" joined the room`);
    },
    playerExit: (data: any) => {
      setGameState((prevState) => {
        if (prevState !== undefined) {
          console.log(
            `"${data.player.username}" left mid-game! The game has been forced to quit as a result.`
          );
        }
        return undefined;
      });
      setPlayers((currentPlayers) => {
        const newPlayers = { ...currentPlayers };
        delete newPlayers[data.player.connectionId];
        return newPlayers;
      });
      console.log(`Player "${data.player.username}" left the room`);
    },
    playerList: (data: any) => {
      setPlayers((currentPlayers) => {
        return {
          ...currentPlayers,
          ...Object.fromEntries(
            data.players.map((player: Player) => [player.connectionId, player])
          ),
        };
      });
    },
    initGameState: (data: any) => {
      setGameState(data.state);
    },
  };

  const receiveMessage = (message: MessageEvent<any>) => {
    const parsedData = JSON.parse(message.data);
    socketMessageActions[parsedData.action](parsedData);
  };

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
        (gameState && (
          <GreedyGorillasGame
            players={players}
            playerOrder={gameState.playerOrder}
          />
        )) ||
        (wsConnection && (
          <GreedyGorillasLobby players={players} wsConnection={wsConnection} />
        ))}
    </>
  );
};

export default GreedyGorillasPage;
