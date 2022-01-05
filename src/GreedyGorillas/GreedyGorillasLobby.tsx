import React from "react";
import { Player } from "./GreedyGorillasPage";

interface Props {
  players: { [connectionId: string]: Player };
  wsConnection: WebSocket;
}

const GreedyGorillasLobby = (props: Props) => {
  const startGame = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "startGame",
      })
    );
  };

  return (
    <>
      {Object.values(props.players).map((player) => (
        <div key={player.connectionId}>{player.username}</div>
      ))}
      {Object.keys(props.players).length > 0 && (
        <button onClick={startGame}>Start Game</button>
      )}
    </>
  );
};

export default GreedyGorillasLobby;
