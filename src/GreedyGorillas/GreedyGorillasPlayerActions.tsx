import React from "react";
import { Player, GameState } from "./GreedyGorillasPage";

interface Props {
  players: { [connectionId: string]: Player };
  gameState: GameState;
  connectionId: String;
  wsConnection: WebSocket;
}

const GreedyGorillasPlayerActions = (props: Props) => {
  const changeRole = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "changeRole",
      })
    );
  };

  return (
    <div>
      {props.gameState.playerOrder[
        props.gameState.turn % props.gameState.playerOrder.length
      ] === props.connectionId && (
        <>
          <button onClick={changeRole}>Change Role</button>
        </>
      )}
    </div>
  );
};

export default GreedyGorillasPlayerActions;
