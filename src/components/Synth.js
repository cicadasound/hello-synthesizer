import React, {useEffect, useState, useRef} from 'react';

import {Analyser} from './Analyser';
import {Oscillator} from './Oscillator';
import {Amp} from './Amp';
import {Filter} from './Filter';
import {Envelope} from './Envelope';
import {Delay} from './Delay';
import {Keyboard} from './Keyboard';
import {Toggle} from './Toggle';
import {Clock} from './Clock';

import KEYS from '../data/KEYS';

const DEFAULTS = {
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
};

export const Synth = () => {
  const audioContext = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const voicesRef = useRef([]);
  const mainGainRef = useRef(null);
  const filterRef = useRef(null);
  const delayRef = useRef(null);
  const feedbackRef = useRef(null);

  const [currentNote, setCurrentNote] = useState(null);
  const arpClock = useRef(null);
  const [pressedKeys, setPressedKeys] = useState([]);
  const [latch, setLatch] = useState(false);
  const [arp, setArp] = useState(false);

  const [osc1, setOsc1] = useState({
    type: 'sawtooth',
    detune: 0,
    octave: 1,
  });

  const [osc2, setOsc2] = useState({
    type: 'sawtooth',
    detune: 0,
    octave: 1,
  });

  const [amp, setAmp] = useState(DEFAULTS.amp);
  const [filter, setFilter] = useState(DEFAULTS.filter);
  const [envelope, setEnvelope] = useState({
    attack: 0,
    decay: 0.5,
    sustain: 0.2,
    release: 0,
  });
  const [delay, setDelay] = useState(DEFAULTS.delay);
  const [clock, setClock] = useState(DEFAULTS.clock);

  React.useEffect(() => {
    const synth = document.getElementById('synth');
    synth.focus();
  }, []);

  useEffect(() => {
    mainGainRef.current = audioContext.current.createGain();
    mainGainRef.current.gain.value = DEFAULTS.amp.level;
    filterRef.current = audioContext.current.createBiquadFilter();
    filterRef.current.type = 'lowpass';
    filterRef.current.frequency.setValueAtTime(
      DEFAULTS.filter.frequency,
      audioContext.current.currentTime
    );
    filterRef.current.Q.setValueAtTime(
      DEFAULTS.filter.q,
      audioContext.current.currentTime
    );
    delayRef.current = audioContext.current.createDelay();
    delayRef.current.delayTime.value = DEFAULTS.delay.time;
    feedbackRef.current = audioContext.current.createGain();
    feedbackRef.current.gain.value = DEFAULTS.delay.feedback;
    delayRef.current.connect(feedbackRef.current);
    feedbackRef.current.connect(delayRef.current);
    filterRef.current.connect(delayRef.current);
    filterRef.current.connect(mainGainRef.current);
    delayRef.current.connect(mainGainRef.current);
    mainGainRef.current.connect(audioContext.current.destination);
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

  const handleLatchChange = () => {
    const newLatch = !latch;

    if (!newLatch) {
      console.log(pressedKeys);
      pressedKeys.forEach((key) => stopNote(key, true));
      setPressedKeys([]);
    }

    setLatch(!latch);
  };

  const handleArpChange = () => {
    const newArpValue = !arp;
    if (newArpValue) {
      setCurrentNote(0);
      pressedKeys.forEach((key) => destroyOscillator(key));
    } else {
      if (latch) {
        pressedKeys.forEach((key) => createOscillator(key));
      }
      setCurrentNote(null);
    }
    setArp(newArpValue);
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
        audioContext.current.currentTime
      );
    }
    if (newFilter.q !== filter.q) {
      filterRef.current.Q.setValueAtTime(
        newFilter.q,
        audioContext.current.currentTime
      );
    }
    setFilter(newFilter);
  };

  const handleEnvelopeChange = (newEnvelope) => {
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

  const createOscillator = (key) => {
    const frequency = KEYS[key].frequency;
    if (!frequency) {
      return;
    }
    const oscillator1 = audioContext.current.createOscillator();
    oscillator1.type = osc1.type;
    oscillator1.detune.setValueAtTime(
      osc1.detune,
      audioContext.current.currentTime
    );
    oscillator1.frequency.value = frequency * osc1.octave;
    oscillator1.start();
    const oscillator2 = audioContext.current.createOscillator();
    oscillator2.type = osc2.type;
    oscillator2.detune.setValueAtTime(
      osc2.detune,
      audioContext.current.currentTime
    );
    oscillator2.frequency.value = frequency * osc2.octave;
    oscillator2.start();
    const vca = audioContext.current.createGain();
    vca.gain.value = 0;
    vca.gain.setValueAtTime(0, audioContext.current.currentTime);
    vca.gain.linearRampToValueAtTime(
      1,
      audioContext.current.currentTime + envelope.attack
    );
    vca.gain.linearRampToValueAtTime(
      envelope.sustain,
      audioContext.current.currentTime + envelope.attack + envelope.decay
    );
    oscillator1.connect(vca);
    oscillator2.connect(vca);
    vca.connect(filterRef.current);
    voicesRef.current[key] = {vca};
  };

  const destroyOscillator = (key) => {
    if (!voicesRef.current[key]) {
      return;
    }
    const {vca} = voicesRef.current[key];
    vca.gain.cancelAndHoldAtTime(audioContext.current.currentTime);
    vca.gain.linearRampToValueAtTime(
      0,
      audioContext.current.currentTime + envelope.release
    );
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

    createOscillator(key);
  };

  const stopNote = (key, force) => {
    if (latch && !force) {
      return;
    }
    destroyOscillator(key);
    const filteredKeys = [...pressedKeys].filter((k) => k !== key);
    setPressedKeys(filteredKeys);
  };

  const handleKeyDown = (event) => {
    if (!KEYS[event.key]) {
      return;
    }
    const key = event.key;
    playNote(key);
  };

  const handleKeyUp = (event) => {
    const key = event.key;
    if (!voicesRef.current[key]) {
      return;
    }

    stopNote(key);
  };

  const handleKeyTouchStart = (event) => {
    const key = event.target.getAttribute('data-key');
    if (!KEYS[key]) {
      return;
    }

    playNote(key);
  };

  const handleKeyTouchEnd = (event) => {
    const key = event.target.getAttribute('data-key');
    if (!voicesRef.current[key]) {
      return;
    }

    stopNote(key);
  };

  const playArpNote = (key) => {
    createOscillator(key);
    const {vca} = voicesRef.current[key];
    vca.gain.cancelAndHoldAtTime(audioContext.current.currentTime + 1);
    vca.gain.linearRampToValueAtTime(
      0,
      audioContext.current.currentTime + envelope.release + 1
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
        <Clock title="CLK" clock={clock} onChange={handleClockChange} />
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
      <Keyboard
        pressedKeys={pressedKeys}
        onKeyTouchStart={handleKeyTouchStart}
        onKeyTouchEnd={handleKeyTouchEnd}
      />
      <Toggle label="LATCH" onChange={handleLatchChange} active={latch} />
      <Toggle label="ARP" onChange={handleArpChange} active={arp} />
      <Analyser
        audioContext={audioContext.current}
        inputNode={mainGainRef.current}
      />
    </div>
  );
};
