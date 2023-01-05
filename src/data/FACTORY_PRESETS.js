export const FACTORY_PRESETS = [
  {
    id: 1,
    name: 'DEFAULT',
    lfo: {
      frequency: 1,
      level: 0,
      destination: 'filter',
      type: 'triangle',
    },
    osc1: {
      type: 'sawtooth',
      detune: 0,
      octave: 1,
    },
    osc2: {
      type: 'square',
      detune: 0,
      octave: 1,
    },
    amp: {
      level: 0.2,
    },
    filter: {
      frequency: 1500,
      q: 0,
    },
    delay: {
      time: 0,
      feedback: 0,
    },
    control: {
      tempo: 90,
      latch: false,
      arp: false,
    },
    envelope: {
      attack: 0,
      decay: 0.5,
      sustain: 0.2,
      release: 0,
    },
  },
  {
    id: 2,
    name: 'SOFT PAD',
    lfo: {
      frequency: 1,
      level: 0.05,
      destination: 'filter',
      type: 'triangle',
    },
    osc1: {
      type: 'sawtooth',
      detune: 0,
      octave: 1,
    },
    osc2: {
      type: 'sawtooth',
      detune: 0,
      octave: 1,
    },
    amp: {
      level: 0.2,
    },
    filter: {
      frequency: 1500,
      q: 0,
    },
    delay: {
      time: 0,
      feedback: 0,
    },
    control: {
      tempo: 90,
      latch: false,
      arp: false,
    },
    envelope: {
      attack: 0.5,
      decay: 0.5,
      sustain: 0.2,
      release: 0.1,
    },
  },
  {
    id: 3,
    name: 'PLUCKY ARP',
    lfo: {
      frequency: 1,
      level: 0.05,
      destination: 'filter',
      type: 'triangle',
    },
    osc1: {
      type: 'square',
      detune: 0,
      octave: 1,
    },
    osc2: {
      type: 'square',
      detune: 0,
      octave: 2,
    },
    amp: {
      level: 0.2,
    },
    filter: {
      frequency: 1800,
      q: 0,
    },
    delay: {
      time: 0.3,
      feedback: 0.3,
    },
    control: {
      tempo: 120,
      latch: true,
      arp: true,
    },
    envelope: {
      attack: 0,
      decay: 0.2,
      sustain: 0.1,
      release: 0,
    },
  },
];
