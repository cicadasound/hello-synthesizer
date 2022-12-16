import React, {useEffect, useState, useRef} from 'react';

import {Analyser} from './Analyser';
import {Oscillator} from './Oscillator';
import {Amp} from './Amp';
import {Filter} from './Filter';
import {Envelope} from './Envelope';
import {Delay} from './Delay';
import {Keyboard} from './Keyboard';

import KEYS from '../data/KEYS';

export const Synth = () => {
  const audioContext = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const voicesRef = useRef([]);
  const mainGainRef = useRef(null);
  const filterRef = useRef(null);
  const delayRef = useRef(null);
  const feedbackRef = useRef(null);

  const [pressedKeys, setPressedKeys] = useState([]);
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
  const [amp, setAmp] = useState({
    level: 0.4,
  });
  const [filter, setFilter] = useState({
    frequency: 1000,
    q: 0,
  });
  const [envelope, setEnvelope] = useState({
    attack: 1,
    decay: 0.5,
    sustain: 0.2,
    release: 1,
  });
  const [delay, setDelay] = useState({
    time: 0.3,
    feedback: 0.2,
  });

  React.useEffect(() => {
    const synth = document.getElementById('synth');
    // synth.addEventListener('blur', () => {
    //   document.getElementById('synth').focus();
    // });
    synth.focus();
  }, []);

  useEffect(() => {
    mainGainRef.current = audioContext.current.createGain();
    mainGainRef.current.gain.value = 0.4;
    filterRef.current = audioContext.current.createBiquadFilter();
    filterRef.current.type = 'lowpass';
    filterRef.current.frequency.setValueAtTime(
      1000,
      audioContext.current.currentTime
    );
    delayRef.current = audioContext.current.createDelay();
    delayRef.current.delayTime.value = 0.9;
    feedbackRef.current = audioContext.current.createGain();
    feedbackRef.current.gain.value = 0.1;
    delayRef.current.connect(feedbackRef.current);
    feedbackRef.current.connect(delayRef.current);
    filterRef.current.connect(delayRef.current);
    filterRef.current.connect(mainGainRef.current);
    delayRef.current.connect(mainGainRef.current);

    mainGainRef.current.connect(audioContext.current.destination);
  }, []);

  const handleOsc1Change = (newOsc) => {
    setOsc1(newOsc);
  };

  const handleOsc2Change = (newOsc) => {
    setOsc2(newOsc);
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
      filterRef.current.q.setValueAtTime(
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

  const playNote = (key) => {
    const frequency = KEYS[key].frequency;
    if (pressedKeys.includes(key) || !frequency) {
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

  const stopNote = (key) => {
    const {vca} = voicesRef.current[key];
    vca.gain.cancelAndHoldAtTime(audioContext.current.currentTime);
    vca.gain.linearRampToValueAtTime(
      0,
      audioContext.current.currentTime + envelope.release
    );
  };

  const handleKeyDown = (event) => {
    if (!KEYS[event.key]) {
      return;
    }
    const key = event.key;
    playNote(key);
    setPressedKeys([...pressedKeys, key]);
  };

  const handleKeyUp = (event) => {
    const key = event.key;
    if (!voicesRef.current[key]) {
      return;
    }

    stopNote(key);
    const filteredKeys = [...pressedKeys].filter((k) => k !== key);
    setPressedKeys(filteredKeys);
  };

  const handleKeyTouchStart = (event) => {
    const key = event.target.getAttribute('data-key');
    if (!KEYS[key]) {
      return;
    }

    playNote(key);
    setPressedKeys([...pressedKeys, key]);
  };

  const handleKeyTouchEnd = (event) => {
    const key = event.target.getAttribute('data-key');
    if (!voicesRef.current[key]) {
      return;
    }

    stopNote(key);
    const filteredKeys = [...pressedKeys].filter((k) => k !== key);
    setPressedKeys(filteredKeys);
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
      <Analyser
        audioContext={audioContext.current}
        inputNode={mainGainRef.current}
      />
    </div>
  );
};
