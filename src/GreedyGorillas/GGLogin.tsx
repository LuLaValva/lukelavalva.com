import React, { useState } from "react";

interface Props {
  socketConnectionFunction: (username: string, room: string) => void;
}

const GGLogin = (props: Props) => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const joinRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.socketConnectionFunction(username, room);
  };

  return (
    <>
      Room Key: <input name="room" onChange={handleRoomChange} />
      Player Name: <input name="username" onChange={handleUsernameChange} />
      <button onClick={joinRoom}>Join Room</button>
    </>
  );
};

export default GGLogin;
