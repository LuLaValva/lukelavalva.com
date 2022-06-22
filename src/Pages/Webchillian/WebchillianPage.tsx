import React, { useState } from "react";
import { GAINS_BY_NOTE, SCALES } from "./MusicalConstants";
import Webchillian from "./Webchillian";
import articleStyles from "../../styles/AcademicPaper.module.css";
import styles from "./Webchillian.module.css";

const WebchillianPage = () => {
  const [started, setStarted] = useState(false);

  const [baseNote, setBaseNote] = useState(Object.keys(GAINS_BY_NOTE)[0]);
  const [scale, setScale] = useState(Object.keys(SCALES)[0]);

  return (
    <>
      <div className={articleStyles.paper}>
        <div className={articleStyles.paragraph}>
          The <em>Samchillian Tip Tip Tip Cheeepeeeee</em> in an instrument
          invented by Leon Gruenbaum in the 80s that challenges the idea of
          traditional instruments. Instead of associating each action with a
          specific note or pitch, the Samchillian utilized computer memory to
          associate each keypress with a <i>change</i> in pitch.
        </div>
        <div className={articleStyles.paragraph}>
          Gruenbaum's instrument has a wide range of capabilities, and it is
          able to generate complicated, fast melodies with very little finger
          movement. I am enchanted by the idea of creating an instrument of
          similar caliber one day, but for now I will settle for a basic web
          demo with a single oscillator. Below, you can play around with the...
        </div>
        <h1>Webchillian Tip Tip Tip Cheeepeeeee</h1>
      </div>
      <div className={styles.scaleInputs}>
        <select
          dir="rtl"
          onChange={(e) => {
            setBaseNote(e.currentTarget.value);
            e.currentTarget.blur();
          }}
        >
          {Object.keys(GAINS_BY_NOTE).map((note) => (
            <option dir="ltr" value={note}>
              {note}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => {
            setScale(e.currentTarget.value);
            e.currentTarget.blur();
          }}
        >
          {Object.keys(SCALES).map((scale) => (
            <option value={scale}>{scale}</option>
          ))}
        </select>
      </div>
      {started ? (
        <Webchillian scale={SCALES[scale]} baseGain={GAINS_BY_NOTE[baseNote]} />
      ) : (
        <button onClick={() => setStarted(true)} className={styles.startButton}>
          Start
        </button>
      )}
    </>
  );
};

export default WebchillianPage;
