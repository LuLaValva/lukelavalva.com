export const MIDDLE_C_FREQUENCY = 256;

export const GAINS_BY_NOTE: { [note: string]: number } = {
  A: -300,
  "A♯ / B♭": -200,
  B: -100,
  C: 0,
  "C♯ / D♭": 100,
  D: 200,
  "D♯ / E♭": 300,
  E: 400,
  F: 500,
  "F♯ / G♭": 600,
  G: 700,
  "G♯ / A♭": 800,
};

export const SCALES: { [key: string]: number[] } = {
  Chromatic: [100],
  Major: [100, 200, 200, 100, 200, 200, 200],
  Minor: [200, 200, 100, 200, 200, 100, 200],
  Acoustic: [200, 200, 200, 200, 100, 200, 100],
  "15 Equal Temperament": [1200 / 15],
  "Quarter-step Chromatic": [50],
};
