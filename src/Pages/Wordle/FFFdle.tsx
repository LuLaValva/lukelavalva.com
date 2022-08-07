import React, { useMemo } from "react";
import MultiWordle from "./MultiWordle";

const FFFdle = () => {
  const date = useMemo(() => new Date().toLocaleDateString(), []);

  return <MultiWordle numLetters={4} numWords={3} seed={date} />;
};

export default FFFdle;
