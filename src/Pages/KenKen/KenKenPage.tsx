import React, { useState } from "react";
import KenKen from "./KenKen";
import styles from "./KenKenStyles.module.css";

const KenKenPage = () => {
  const [size, setSize] = useState(5);
  const [seed, setSeed] = useState(() =>
    new Date().getMilliseconds().toString()
  );
  const [showSettings, setShowSettings] = useState(true);

  return (
    <>
      <KenKen n={size} seed={seed} />
      {showSettings && (
        <div className={styles.settingsBox}>
          <h1>KenKen!</h1>
          <p>
            It's like Sudoku, but with math and stuff. Also known in certain
            circles as Mathdoku
          </p>
          <div className={styles.inputs}>
            <div>
              <label htmlFor="size">Board Size</label>
              <input
                type="number"
                value={size}
                id="size"
                min={3}
                max={9}
                onChange={(e) => setSize(+e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="seed">Random Seed</label>
              <input
                type="text"
                id="seed"
                onChange={(e) => setSeed(e.target.value)}
              />
            </div>
          </div>
          <button onClick={() => setShowSettings(false)}>Begin</button>
        </div>
      )}
    </>
  );
};

export default KenKenPage;
