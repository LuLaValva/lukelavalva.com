import React, { useState } from "react";
import GGLogin from "./GGLogin";
import { ApiConstants } from "../consts";
import GorillaDisplay from "./GorillaDisplay";

export type Player = {
  connectionId: string;
  room: string;
  username: string;
  gameState: {
    points: number;
    role: number;
  };
};

const GreedyGorillasPage: React.FC = () => {
  const [wsConnection, setWsConnection] = useState<WebSocket>();
  const [players, setPlayers] = useState<{ [connectionId: string]: Player }>(
    {}
  );

  const socketMessageActions: { [action: string]: (data: any) => void } = {
    playerJoin: (data: any) => {
      setPlayers((currentPlayers) => {
        return { ...currentPlayers, [data.player.connectionId]: data.player };
      });
      console.log(`Player "${data.player.username}" joined the room`);
    },
    playerExit: (data: any) => {
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
      {wsConnection === undefined && (
        <GGLogin socketConnectionFunction={connectToSocket} />
      )}
      {Object.values(players).map((player) => (
        <GorillaDisplay key={player.connectionId} player={player} />
      ))}
    </>
  );
};

export default GreedyGorillasPage;
