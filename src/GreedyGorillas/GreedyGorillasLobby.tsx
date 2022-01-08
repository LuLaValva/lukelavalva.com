import React from "react";
import { Player } from "./GreedyGorillasPage";
import GreedyGorillasRoleSelection from "./GreedyGorillasRoleSelection";

interface Props {
  players: { [connectionId: string]: Player };
  wsConnection: WebSocket;
  roles: number[];
}

const GreedyGorillasLobby = (props: Props) => {
  const startGame = () => {
    if (Object.keys(props.players).length <= props.roles.length) {
      props.wsConnection.send(
        JSON.stringify({
          action: "startGame",
        })
      );
    } else {
      console.log("Add more roles before you start the game");
    }
  };

  return (
    <>
      {Object.values(props.players).map((player) => (
        <div key={player.connectionId}>{player.username}</div>
      ))}
      {Object.keys(props.players).length > 0 && (
        <>
          <button onClick={startGame}>Start Game</button>
          <GreedyGorillasRoleSelection
            roles={props.roles}
            wsConnection={props.wsConnection}
          />
        </>
      )}
    </>
  );
};

export default GreedyGorillasLobby;
