import React, {useEffect, useState, useRef, useCallback} from 'react';

import {Analyser} from './Analyser';
import {Oscillator} from './Oscillator';
import {Amp} from './Amp';
import {Filter} from './Filter';
import {Envelope} from './Envelope';
import {Delay} from './Delay';
import {Keyboard} from './Keyboard';
import {Toggle} from './Toggle';
import {Clock} from './Clock';
import {LFO} from './LFO';
import {Module} from './Module';
import {CicadaIcon} from '../icons';
import {Midi} from './Midi';

import KEYS from '../data/KEYS';
import NOTES from '../data/NOTES';

const DEFAULTS = {
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
  clock: {
    tempo: 90,
  },
  envelope: {
    attack: 0,
    decay: 0.5,
    sustain: 0.2,
    release: 0,
  },
};

export const Synth = () => {
  const audioContextRef = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const voicesRef = useRef([]);
  const mainGainRef = useRef(null);
  const filterRef = useRef(null);
  const delayRef = useRef(null);
  const feedbackRef = useRef(null);
  const envelopeRef = useRef(DEFAULTS.envelope);
  const lfoRef = useRef(null);
  const lfoGainRef = useRef(null);

  const [currentNote, setCurrentNote] = useState(null);
  const arpClock = useRef(null);
  const [pressedKeys, setPressedKeys] = useState([]);
  const [latch, setLatch] = useState(false);
  const [arp, setArp] = useState(false);
  const [osc1, setOsc1] = useState(DEFAULTS.osc1);
  const [osc2, setOsc2] = useState(DEFAULTS.osc2);
  const [lfo, setLFO] = useState(DEFAULTS.lfo);
  const [amp, setAmp] = useState(DEFAULTS.amp);
  const [filter, setFilter] = useState(DEFAULTS.filter);
  const [envelope, setEnvelope] = useState(DEFAULTS.envelope);
  const [delay, setDelay] = useState(DEFAULTS.delay);
  const [clock, setClock] = useState(DEFAULTS.clock);

  React.useEffect(() => {
    const synth = document.getElementById('synth');
    synth.focus();
  }, []);

  useEffect(() => {
    // Initialize main gain control
    mainGainRef.current = audioContextRef.current.createGain();
    mainGainRef.current.gain.value = DEFAULTS.amp.level;

    // Initialize filter
    filterRef.current = audioContextRef.current.createBiquadFilter();
    filterRef.current.type = 'lowpass';
    filterRef.current.frequency.setValueAtTime(
      DEFAULTS.filter.frequency,
      audioContextRef.current.currentTime
    );
    filterRef.current.Q.setValueAtTime(
      DEFAULTS.filter.q,
      audioContextRef.current.currentTime
    );

    // Initialize delay
    delayRef.current = audioContextRef.current.createDelay();
    delayRef.current.delayTime.value = DEFAULTS.delay.time;
    feedbackRef.current = audioContextRef.current.createGain();
    feedbackRef.current.gain.value = DEFAULTS.delay.feedback;

    // Initialize lfo
    lfoRef.current = audioContextRef.current.createOscillator();
    lfoRef.current.frequency.setValueAtTime(
      DEFAULTS.lfo.frequency,
      audioContextRef.current.currentTime
    );
    lfoRef.current.type = DEFAULTS.lfo.type;
    lfoGainRef.current = audioContextRef.current.createGain();
    lfoGainRef.current.gain.value = DEFAULTS.lfo.level;
    lfoRef.current.connect(lfoGainRef.current);
    lfoGainRef.current.connect(filterRef.current.frequency);
    lfoRef.current.start();

    // Wire it all up
    delayRef.current.connect(feedbackRef.current);
    feedbackRef.current.connect(delayRef.current);
    filterRef.current.connect(delayRef.current);
    filterRef.current.connect(mainGainRef.current);
    delayRef.current.connect(mainGainRef.current);
    mainGainRef.current.connect(audioContextRef.current.destination);
  }, []);

  useEffect(() => {
    if (arp && pressedKeys.length > 0) {
      const secondsPerBeat = 60.0 / clock.tempo;
      const note = currentNote ? pressedKeys[currentNote] : pressedKeys[0];
      if (note) {
        playArpNote(note);
      }
      arpClock.current = setTimeout(() => {
        const nextNote = currentNote + 1;
        if (nextNote === pressedKeys.length) {
          setCurrentNote(0);
        } else {
          setCurrentNote(nextNote);
        }
      }, secondsPerBeat * 1000);

      return () => clearTimeout(arpClock.current);
    }

    return () => {};
  }, [pressedKeys, currentNote, arp]);

  const createOscillator = (note) => {
    console.log('Creating osc for ...', note);
    const frequency = note.frequency;
    if (!frequency) {
      return;
    }
    if (voicesRef.current[note.name]) {
      destroyOscillator(note);
    }
    const oscillator1 = audioContextRef.current.createOscillator();
    oscillator1.type = osc1.type;
    oscillator1.detune.setValueAtTime(
      osc1.detune,
      audioContextRef.current.currentTime
    );
    oscillator1.frequency.value = frequency * osc1.octave;
    if (lfo.destination === 'osc1') {
      lfoGainRef.current.connect(oscillator1.detune);
    }
    oscillator1.start();
    const oscillator2 = audioContextRef.current.createOscillator();
    oscillator2.type = osc2.type;
    oscillator2.detune.setValueAtTime(
      osc2.detune,
      audioContextRef.current.currentTime
    );
    oscillator2.frequency.value = frequency * osc2.octave;
    if (lfo.destination === 'osc2') {
      lfoGainRef.current.connect(oscillator2.detune);
    }
    oscillator2.start();
    console.log('Osc created...', osc1, osc2);
    console.log('Envelope...', envelope);
    const vca = audioContextRef.current.createGain();
    vca.gain.value = 0;
    vca.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    vca.gain.linearRampToValueAtTime(
      0.1,
      audioContextRef.current.currentTime + envelopeRef.current.attack
    );
    vca.gain.linearRampToValueAtTime(
      envelope.sustain,
      audioContextRef.current.currentTime +
        envelopeRef.current.attack +
        envelopeRef.current.decay
    );

    console.log('VCA created ...', vca);
    oscillator1.connect(vca);
    oscillator2.connect(vca);
    vca.connect(filterRef.current);
    voicesRef.current[note.name] = {vca};
  };

  const destroyOscillator = (note) => {
    console.log('destroy', note);
    console.log('currentVoices', voicesRef.current);
    if (!voicesRef.current[note.name]) {
      return;
    }
    const {vca} = voicesRef.current[note.name];
    vca.gain.cancelAndHoldAtTime(audioContextRef.current.currentTime);
    vca.gain.linearRampToValueAtTime(
      0,
      audioContextRef.current.currentTime + envelopeRef.current.release
    );
  };

  const handleLatchChange = () => {
    const newLatch = !latch;

    if (!newLatch) {
      pressedKeys.forEach((key) => stopNote(key, true));
      setPressedKeys([]);
    }

    setLatch(!latch);
  };

  const handleArpChange = () => {
    const newArpValue = !arp;
    if (newArpValue) {
      setCurrentNote(0);
      pressedKeys.forEach((key) => {
        const note = NOTES.find((n) => n.name === KEYS[key].note);
        destroyOscillator(note);
      });
    } else {
      if (latch) {
        pressedKeys.forEach((key) => {
          const note = NOTES.find((n) => n.name === KEYS[key].note);
          createOscillator(note);
        });
      }
      setCurrentNote(null);
    }
    setArp(newArpValue);
  };

  const handleLFOChange = (newLFO) => {
    if (lfo.destination !== newLFO.destination) {
      lfoGainRef.current.disconnect();

      if (newLFO.destination === 'filter') {
        lfoGainRef.current.connect(filterRef.current.frequency);
      }
    }
    if (lfoGainRef.current.gain.value !== newLFO.level) {
      lfoGainRef.current.gain.value = newLFO.level;
    }
    if (lfoRef.current.type !== newLFO.type) {
      lfoRef.current.type = newLFO.type;
    }
    if (lfoRef.current.frequency !== newLFO.frequency) {
      lfoRef.current.frequency.setValueAtTime(
        newLFO.frequency,
        audioContextRef.current.currentTime
      );
    }
    setLFO(newLFO);
  };

  const handleOsc1Change = (newOsc) => {
    setOsc1(newOsc);
  };

  const handleOsc2Change = (newOsc) => {
    setOsc2(newOsc);
  };

  const handleClockChange = (newClock) => {
    setClock(newClock);
  };

  const handleAmpChange = (newAmp) => {
    if (mainGainRef.current.gain.value !== newAmp.level) {
      mainGainRef.current.gain.value = newAmp.level;
    }
    setAmp(newAmp);
  };

  const handleFilterChange = (newFilter) => {
    if (newFilter.frequency !== filter.frequency) {
      filterRef.current.frequency.setValueAtTime(
        newFilter.frequency,
        audioContextRef.current.currentTime
      );
    }
    if (newFilter.q !== filter.q) {
      filterRef.current.Q.setValueAtTime(
        newFilter.q,
        audioContextRef.current.currentTime
      );
    }
    setFilter(newFilter);
  };

  const handleEnvelopeChange = (newEnvelope) => {
    envelopeRef.current = newEnvelope;
    setEnvelope(newEnvelope);
  };

  const handleDelayChange = (newDelay) => {
    if (newDelay.time !== delay.time) {
      delayRef.current.delayTime.value = newDelay.time;
    }
    if (newDelay.feedback !== delay.feedback) {
      feedbackRef.current.gain.value = newDelay.feedback;
    }
    setDelay(newDelay);
  };

  const playNote = (key) => {
    if (latch && pressedKeys.includes(key)) {
      stopNote(key, true);
    }

    if (pressedKeys.includes(key)) {
      return;
    }

    setPressedKeys([...pressedKeys, key]);

    if (arp) {
      return;
    }

    const note = NOTES.find((n) => n.name === KEYS[key].note);
    createOscillator(note);
  };

  const stopNote = (key, force) => {
    if (latch && !force) {
      return;
    }
    const note = NOTES.find((n) => n.name === KEYS[key].note);
    destroyOscillator(note);
    const filteredKeys = [...pressedKeys].filter((k) => k !== key);
    setPressedKeys(filteredKeys);
  };

  const handleKeyDown = (event) => {
    const key = event.key;
    if (KEYS[key]) {
      playNote(key);
    }
  };

  const handleKeyUp = (event) => {
    const key = event.key;
    if (KEYS[key]) {
      stopNote(key);
    }
  };

  const handleKeyTouchStart = (event) => {
    const key = event.target.getAttribute('data-key');
    playNote(key);
  };

  const handleKeyTouchEnd = (event) => {
    const key = event.target.getAttribute('data-key');
    stopNote(key);
  };

  const playArpNote = (key) => {
    const note = NOTES.find((n) => n.name === KEYS[key].note);
    createOscillator(note);
    const {vca} = voicesRef.current[note.name];
    vca.gain.cancelAndHoldAtTime(audioContextRef.current.currentTime + 1);
    vca.gain.linearRampToValueAtTime(
      0,
      audioContextRef.current.currentTime + envelope.release + 1
    );
  };

  return (
    <div
      id="synth"
      className="synth"
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="synth__controls">
        <Module dark>
          <div>
            <div>👋</div>
            <h1>Hello Synth</h1>
            <p>v0.1</p>
          </div>
        </Module>
        <Analyser
          audioContext={audioContextRef.current}
          inputNode={mainGainRef.current}
        />
        <Module dark>
          <div>
            <CicadaIcon className="logo" />
          </div>
        </Module>
      </div>
      <div className="synth__controls">
        <Oscillator title="OSC1" osc={osc1} onChange={handleOsc1Change} />
        <Oscillator title="OSC2" osc={osc2} onChange={handleOsc2Change} />
        <Amp title="AMP" amp={amp} onChange={handleAmpChange} />
        <Filter title="FILTER" filter={filter} onChange={handleFilterChange} />
        <Envelope
          title="ENV"
          envelope={envelope}
          onChange={handleEnvelopeChange}
        />
        <Delay title="DELAY" delay={delay} onChange={handleDelayChange} />
      </div>
      <div className="synth__controls">
        <Module title="CONTROL">
          <section className="latch-group">
            <Toggle label="LATCH" onChange={handleLatchChange} active={latch} />
            <Toggle label="ARP" onChange={handleArpChange} active={arp} />
          </section>
          <Clock title="CLK" clock={clock} onChange={handleClockChange} />
        </Module>
        <LFO title="LFO" lfo={lfo} onChange={handleLFOChange} />
      </div>
      <Keyboard
        pressedKeys={pressedKeys}
        onKeyTouchStart={handleKeyTouchStart}
        onKeyTouchEnd={handleKeyTouchEnd}
      />
      <div id="settings" className="panel">
        <Midi
          audioContext={audioContextRef.current}
          onNotePlayed={createOscillator}
          onNoteStopped={destroyOscillator}
        />
      </div>
    </div>
  );
};
