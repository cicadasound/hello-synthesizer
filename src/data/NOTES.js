const NOTES = [
  {
    midi: 0,
    name: 'C-1',
    frequency: 8.176,
  },
  {
    midi: 1,
    name: 'C#-1',
    frequency: 8.662,
  },
  {
    midi: 2,
    name: 'D-1',
    frequency: 9.177,
  },
  {
    midi: 3,
    name: 'D#-1',
    frequency: 9.723,
  },
  {
    midi: 4,
    name: 'E-1',
    frequency: 10.301,
  },
  {
    midi: 5,
    name: 'F-1',
    frequency: 10.913,
  },
  {
    midi: 6,
    name: 'F#-1',
    frequency: 11.562,
  },
  {
    midi: 7,
    name: 'G-1',
    frequency: 12.25,
  },
  {
    midi: 8,
    name: 'G#-1',
    frequency: 12.978,
  },
  {
    midi: 9,
    name: 'A-1',
    frequency: 13.75,
  },
  {
    midi: 10,
    name: 'A#-1',
    frequency: 14.568,
  },
  {
    midi: 11,
    name: 'B-1',
    frequency: 15.434,
  },
  {
    midi: 12,
    name: 'C0',
    frequency: 16.352,
  },
  {
    midi: 13,
    name: 'C#0',
    frequency: 17.324,
  },
  {
    midi: 14,
    name: 'D0',
    frequency: 18.354,
  },
  {
    midi: 15,
    name: 'D#0',
    frequency: 19.445,
  },
  {
    midi: 16,
    name: 'E0',
    frequency: 20.602,
  },
  {
    midi: 17,
    name: 'F0',
    frequency: 21.827,
  },
  {
    midi: 18,
    name: 'F#0',
    frequency: 23.125,
  },
  {
    midi: 19,
    name: 'G0',
    frequency: 24.5,
  },
  {
    midi: 20,
    name: 'G#0',
    frequency: 25.957,
  },
  {
    midi: 21,
    name: 'A0',
    frequency: 27.5,
  },
  {
    midi: 22,
    name: 'A#0',
    frequency: 29.135,
  },
  {
    midi: 23,
    name: 'B0',
    frequency: 30.868,
  },
  {
    midi: 24,
    name: 'C1',
    frequency: 32.703,
  },
  {
    midi: 25,
    name: 'C#1',
    frequency: 34.648,
  },
  {
    midi: 26,
    name: 'D1',
    frequency: 36.708,
  },
  {
    midi: 27,
    name: 'D#1',
    frequency: 38.891,
  },
  {
    midi: 28,
    name: 'E1',
    frequency: 41.203,
  },
  {
    midi: 29,
    name: 'F1',
    frequency: 43.654,
  },
  {
    midi: 30,
    name: 'F#1',
    frequency: 46.249,
  },
  {
    midi: 31,
    name: 'G1',
    frequency: 48.999,
  },
  {
    midi: 32,
    name: 'G#1',
    frequency: 51.913,
  },
  {
    midi: 33,
    name: 'A1',
    frequency: 55,
  },
  {
    midi: 34,
    name: 'A#1',
    frequency: 58.27,
  },
  {
    midi: 35,
    name: 'B1',
    frequency: 61.735,
  },
  {
    midi: 36,
    name: 'C2',
    frequency: 65.406,
  },
  {
    midi: 37,
    name: 'C#2',
    frequency: 69.296,
  },
  {
    midi: 38,
    name: 'D2',
    frequency: 73.416,
  },
  {
    midi: 39,
    name: 'D#2',
    frequency: 77.782,
  },
  {
    midi: 40,
    name: 'E2',
    frequency: 82.407,
  },
  {
    midi: 41,
    name: 'F2',
    frequency: 87.307,
  },
  {
    midi: 42,
    name: 'F#2',
    frequency: 92.499,
  },
  {
    midi: 43,
    name: 'G2',
    frequency: 97.999,
  },
  {
    midi: 44,
    name: 'G#2',
    frequency: 103.826,
  },
  {
    midi: 45,
    name: 'A2',
    frequency: 110,
  },
  {
    midi: 46,
    name: 'A#2',
    frequency: 116.541,
  },
  {
    midi: 47,
    name: 'B2',
    frequency: 123.471,
  },
  {
    midi: 48,
    name: 'C3',
    frequency: 130.813,
  },
  {
    midi: 49,
    name: 'C#3',
    frequency: 138.591,
  },
  {
    midi: 50,
    name: 'D3',
    frequency: 146.832,
  },
  {
    midi: 51,
    name: 'D#3',
    frequency: 155.563,
  },
  {
    midi: 52,
    name: 'E3',
    frequency: 164.814,
  },
  {
    midi: 53,
    name: 'F3',
    frequency: 174.614,
  },
  {
    midi: 54,
    name: 'F#3',
    frequency: 184.997,
  },
  {
    midi: 55,
    name: 'G3',
    frequency: 195.998,
  },
  {
    midi: 56,
    name: 'G#3',
    frequency: 207.652,
  },
  {
    midi: 57,
    name: 'A3',
    frequency: 220,
  },
  {
    midi: 58,
    name: 'A#3',
    frequency: 233.082,
  },
  {
    midi: 59,
    name: 'B3',
    frequency: 246.942,
  },
  {
    midi: 60,
    name: 'C4',
    frequency: 261.626,
  },
  {
    midi: 61,
    name: 'C#4',
    frequency: 277.183,
  },
  {
    midi: 62,
    name: 'D4',
    frequency: 293.665,
  },
  {
    midi: 63,
    name: 'D#4',
    frequency: 311.127,
  },
  {
    midi: 64,
    name: 'E4',
    frequency: 329.628,
  },
  {
    midi: 65,
    name: 'F4',
    frequency: 349.228,
  },
  {
    midi: 66,
    name: 'F#4',
    frequency: 369.994,
  },
  {
    midi: 67,
    name: 'G4',
    frequency: 391.995,
  },
  {
    midi: 68,
    name: 'G#4',
    frequency: 415.305,
  },
  {
    midi: 69,
    name: 'A4',
    frequency: 440,
  },
  {
    midi: 70,
    name: 'A#4',
    frequency: 466.164,
  },
  {
    midi: 71,
    name: 'B4',
    frequency: 493.883,
  },
  {
    midi: 72,
    name: 'C5',
    frequency: 523.251,
  },
  {
    midi: 73,
    name: 'C#5',
    frequency: 554.365,
  },
  {
    midi: 74,
    name: 'D5',
    frequency: 587.33,
  },
  {
    midi: 75,
    name: 'D#5',
    frequency: 622.254,
  },
  {
    midi: 76,
    name: 'E5',
    frequency: 659.255,
  },
  {
    midi: 77,
    name: 'F5',
    frequency: 698.456,
  },
  {
    midi: 78,
    name: 'F#5',
    frequency: 739.989,
  },
  {
    midi: 79,
    name: 'G5',
    frequency: 783.991,
  },
  {
    midi: 80,
    name: 'G#5',
    frequency: 830.609,
  },
  {
    midi: 81,
    name: 'A5',
    frequency: 880,
  },
  {
    midi: 82,
    name: 'A#5',
    frequency: 932.328,
  },
  {
    midi: 83,
    name: 'B5',
    frequency: 987.767,
  },
  {
    midi: 84,
    name: 'C6',
    frequency: 1046.502,
  },
  {
    midi: 85,
    name: 'C#6',
    frequency: 1108.731,
  },
  {
    midi: 86,
    name: 'D6',
    frequency: 1174.659,
  },
  {
    midi: 87,
    name: 'D#6',
    frequency: 1244.508,
  },
  {
    midi: 88,
    name: 'E6',
    frequency: 1318.51,
  },
  {
    midi: 89,
    name: 'F6',
    frequency: 1396.913,
  },
  {
    midi: 90,
    name: 'F#6',
    frequency: 1479.978,
  },
  {
    midi: 91,
    name: 'G6',
    frequency: 1567.982,
  },
  {
    midi: 92,
    name: 'G#6',
    frequency: 1661.219,
  },
  {
    midi: 93,
    name: 'A6',
    frequency: 1760,
  },
  {
    midi: 94,
    name: 'A#6',
    frequency: 1864.655,
  },
  {
    midi: 95,
    name: 'B6',
    frequency: 1975.533,
  },
  {
    midi: 96,
    name: 'C7',
    frequency: 2093.005,
  },
  {
    midi: 97,
    name: 'C#7',
    frequency: 2217.461,
  },
  {
    midi: 98,
    name: 'D7',
    frequency: 2349.318,
  },
  {
    midi: 99,
    name: 'D#7',
    frequency: 2489.016,
  },
  {
    midi: 100,
    name: 'E7',
    frequency: 2637.02,
  },
  {
    midi: 101,
    name: 'F7',
    frequency: 2793.826,
  },
  {
    midi: 102,
    name: 'F#7',
    frequency: 2959.955,
  },
  {
    midi: 103,
    name: 'G7',
    frequency: 3135.963,
  },
  {
    midi: 104,
    name: 'G#7',
    frequency: 3322.438,
  },
  {
    midi: 105,
    name: 'A7',
    frequency: 3520,
  },
  {
    midi: 106,
    name: 'A#7',
    frequency: 3729.31,
  },
  {
    midi: 107,
    name: 'B7',
    frequency: 3951.066,
  },
  {
    midi: 108,
    name: 'C8',
    frequency: 4186.009,
  },
  {
    midi: 109,
    name: 'C#8',
    frequency: 4434.922,
  },
  {
    midi: 110,
    name: 'D8',
    frequency: 4698.636,
  },
  {
    midi: 111,
    name: 'D#8',
    frequency: 4978.032,
  },
  {
    midi: 112,
    name: 'E8',
    frequency: 5274.041,
  },
  {
    midi: 113,
    name: 'F8',
    frequency: 5587.652,
  },
  {
    midi: 114,
    name: 'F#8',
    frequency: 5919.911,
  },
  {
    midi: 115,
    name: 'G8',
    frequency: 6271.927,
  },
  {
    midi: 116,
    name: 'G#8',
    frequency: 6644.875,
  },
  {
    midi: 117,
    name: 'A8',
    frequency: 7040,
  },
  {
    midi: 118,
    name: 'A#8',
    frequency: 7458.62,
  },
  {
    midi: 119,
    name: 'B8',
    frequency: 7902.133,
  },
  {
    midi: 120,
    name: 'C9',
    frequency: 8372.018,
  },
  {
    midi: 121,
    name: 'C#9',
    frequency: 8869.844,
  },
  {
    midi: 122,
    name: 'D9',
    frequency: 9397.273,
  },
  {
    midi: 123,
    name: 'D#9',
    frequency: 9956.063,
  },
  {
    midi: 124,
    name: 'E9',
    frequency: 10548.08,
  },
  {
    midi: 125,
    name: 'F9',
    frequency: 11175.3,
  },
  {
    midi: 126,
    name: 'F#9',
    frequency: 11839.82,
  },
  {
    midi: 127,
    name: 'G9',
    frequency: 12543.85,
  },
];

export default NOTES;
