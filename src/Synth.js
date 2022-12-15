import React, { useEffect, useState, useRef } from "react";

import { RangeSlider } from "./RangeSlider";
import { Analyser } from "./Analyser";

const KEYS = {
  a: {
    note: "C3",
    frequency: 130.81
  },
  w: {
    note: "C#3",
    frequency: 138.59
  },
  s: {
    note: "D3",
    frequency: 146.83
  },
  e: {
    note: "D#3",
    frequency: 155.56
  },
  d: {
    note: "E3",
    frequency: 164.81
  },
  f: {
    note: "F3",
    frequency: 174.61
  },
  t: {
    note: "F#3",
    frequency: 185.0
  },
  g: {
    note: "G3",
    frequency: 196.0
  },
  y: {
    note: "G#3",
    frequency: 207.65
  },
  h: {
    note: "A3",
    frequency: 220.0
  },
  u: {
    note: "A#3",
    frequency: 233.08
  },
  j: {
    note: "B3",
    frequency: 246.94
  },
  k: {
    note: "C4",
    frequency: 261.63
  },
  o: {
    note: "C#4",
    frequency: 277.18
  },
  l: {
    note: "D4",
    frequency: 293.66
  },
  p: {
    note: "D#4",
    frequency: "311.13"
  },
  ";": {
    note: "E",
    frequency: "329.63"
  },
  "'": {
    note: "F",
    frequency: "349.23"
  }
};

export const Synth = () => {
  const audioContext = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const voices = useRef([]);
  const mainGain = useRef(null);
  const filter = useRef(null);
  const delay = useRef(null);
  const feedback = useRef(null);
  const [pressedKeys, setPressedKeys] = useState([]);
  const [filterFreq, setFilterFreq] = useState(1000);
  const [filterQ, setFilterQ] = useState(0);
  const [attack, setAttack] = useState(1);
  const [decay, setDecay] = useState(0.5);
  const [sustain, setSustain] = useState(0.2);
  const [release, setRelease] = useState(1);
  const [volume, setVolume] = useState(0.4);
  const [delayTime, setDelayTime] = useState(0.5);
  const [delayFeedback, setDelayFeedback] = useState(0.2);

  const [osc1, setOsc1] = useState({
    type: "sawtooth",
    detune: 0,
    octave: 1
  });

  const [osc2, setOsc2] = useState({
    type: "sawtooth",
    detune: 0,
    octave: 1
  });

  React.useEffect(() => {
    const synth = document.getElementById("synth");
    synth.addEventListener("blur", () => {
      document.getElementById("synth").focus();
    });
    synth.focus();
  }, []);

  useEffect(() => {
    mainGain.current = audioContext.current.createGain();
    mainGain.current.gain.value = 0.4;
    filter.current = audioContext.current.createBiquadFilter();
    filter.current.type = "lowpass";
    filter.current.frequency.setValueAtTime(
      1000,
      audioContext.current.currentTime
    );
    delay.current = audioContext.current.createDelay();
    delay.current.delayTime.value = 0.9;
    feedback.current = audioContext.current.createGain();
    feedback.current.gain.value = 0.1;

    delay.current.connect(feedback.current);
    feedback.current.connect(delay.current);
    filter.current.connect(delay.current);
    filter.current.connect(mainGain.current);
    delay.current.connect(mainGain.current);

    mainGain.current.connect(audioContext.current.destination);
  }, []);

  const handleVolumeChange = (event) => {
    const volumeValue = event.target.value;
    mainGain.current.gain.value = volume;
    setVolume(volumeValue);
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    filter.current.frequency.setValueAtTime(
      filterValue,
      audioContext.current.currentTime
    );
    setFilterFreq(filterValue);
  };

  const handleFilterQChange = (event) => {
    const value = event.target.value;
    filter.current.Q.setValueAtTime(value, audioContext.current.currentTime);
    setFilterQ(value);
  };

  const handleAttackChange = (event) => {
    const attackValue = Number.parseFloat(event.target.value);
    setAttack(attackValue);
  };

  const handleDecayChange = (event) => {
    const value = Number.parseFloat(event.target.value);
    setDecay(value);
  };

  const handleSustainChange = (event) => {
    const value = Number.parseFloat(event.target.value);
    setSustain(value);
  };

  const handleReleaseChange = (event) => {
    const value = Number.parseFloat(event.target.value);
    setRelease(value);
  };

  const handleDelayTimeChange = (event) => {
    const value = Number.parseFloat(event.target.value);
    delay.current.delayTime.value = value;
    setDelayTime(value);
  };

  const handleDelayFeedbackChange = (event) => {
    const value = Number.parseFloat(event.target.value);
    feedback.current.gain.value = value;
    setDelayFeedback(value);
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
      audioContext.current.currentTime + attack
    );
    vca.gain.linearRampToValueAtTime(
      sustain,
      audioContext.current.currentTime + attack + decay
    );
    oscillator1.connect(vca);
    oscillator2.connect(vca);
    vca.connect(filter.current);
    voices[key] = { vca };
  };

  const stopNote = (key) => {
    const { vca } = voices[key];
    vca.gain.cancelAndHoldAtTime(audioContext.current.currentTime);
    vca.gain.linearRampToValueAtTime(
      0,
      audioContext.current.currentTime + release
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
    if (!voices[key]) {
      return;
    }

    stopNote(key);
    const filteredKeys = [...pressedKeys].filter((k) => k !== key);
    setPressedKeys(filteredKeys);
  };

  const handleKeyTouchStart = (event) => {
    const key = event.target.getAttribute("data-key");
    if (!KEYS[key]) {
      return;
    }

    playNote(key);
    setPressedKeys([...pressedKeys, key]);
  };

  const handleKeyTouchEnd = (event) => {
    const key = event.target.getAttribute("data-key");
    if (!voices[key]) {
      return;
    }

    stopNote(key);
    const filteredKeys = [...pressedKeys].filter((k) => k !== key);
    setPressedKeys(filteredKeys);
  };

  const handleOsc1TypeChange = (event) => {
    const type = event.target.value;
    const newOsc = { ...osc1, type };
    setOsc1(newOsc);
  };

  const handleOsc1OctaveChange = (event) => {
    const octave = event.target.value;
    const newOsc = { ...osc1, octave };
    setOsc1(newOsc);
  };

  const handleOsc1DetuneChange = (event) => {
    const detune = event.target.value;
    const newOsc = { ...osc1, detune };
    setOsc1(newOsc);
  };

  const handleOsc2TypeChange = (event) => {
    const type = event.target.value;
    const newOsc = { ...osc2, type };
    setOsc2(newOsc);
  };

  const handleOsc2OctaveChange = (event) => {
    const octave = event.target.value;
    const newOsc = { ...osc2, octave };
    setOsc2(newOsc);
  };

  const handleOsc2DetuneChange = (event) => {
    const detune = event.target.value;
    const newOsc = { ...osc2, detune };
    setOsc2(newOsc);
  };

  const keys = Object.entries(KEYS);
  const keyboardMarkup = keys.map(([keyboardKey, key]) => {
    const keyActive = pressedKeys.includes(keyboardKey);
    const blackKeyClass = key.note.includes("#") ? ` key--black` : "";
    const keyClasses = `key${blackKeyClass}`;
    return (
      <button
        className={keyClasses}
        key={key.note}
        data-active={keyActive}
        data-key={keyboardKey}
        onMouseDown={handleKeyTouchStart}
        onMouseUp={handleKeyTouchEnd}
        onTouchStart={handleKeyTouchStart}
        onTouchEnd={handleKeyTouchEnd}
      >
        <p className="key__note">{key.note}</p>
        <p className="key__keyboard-key">{keyboardKey}</p>
      </button>
    );
  });

  return (
    <div
      id="synth"
      className="synth"
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="synth__controls">
        <section className="controls-section">
          <h2>OSC1</h2>
          <div className="controls-section__group controls-section__group--vertical">
            <div className="control">
              <label>WAVE</label>
              <select selected={osc1.type} onChange={handleOsc1TypeChange}>
                <option value="sawtooth">Sawtooth</option>
                <option value="square">Square</option>
                <option value="sine">Sine</option>
              </select>
            </div>
            <div className="control">
              <label>OCT</label>
              <select selected={osc1.octave} onChange={handleOsc1OctaveChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="control">
              <label>DETUNE</label>
              <RangeSlider
                min="-12"
                max="12"
                step="0.5"
                value={osc1.detune}
                onChange={handleOsc1DetuneChange}
              />
            </div>
          </div>
        </section>
        <section className="controls-section">
          <h2>OSC2</h2>
          <div className="controls-section__group controls-section__group--vertical">
            <div className="control">
              <label>WAVE</label>
              <select selected={osc2.type} onChange={handleOsc2TypeChange}>
                <option value="sawtooth">Sawtooth</option>
                <option value="square">Square</option>
                <option value="sine">Sine</option>
              </select>
            </div>
            <div className="control">
              <label>OCT</label>
              <select selected={osc2.octave} onChange={handleOsc2OctaveChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="control">
              <label>DETUNE</label>
              <div className="range-container">
                <RangeSlider
                  min="-12"
                  max="12"
                  step="0.5"
                  value={osc2.detune}
                  onChange={handleOsc2DetuneChange}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="controls-section">
          <h2>AMP</h2>
          <div className="controls-section__group">
            <div className="control">
              <label>LEVEL</label>
              <RangeSlider
                min="0"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                vertical={true}
              />
            </div>
          </div>
        </section>
        <section className="controls-section">
          <h2>FILTER</h2>
          <div className="controls-section__group">
            <div className="control">
              <label>FREQ</label>
              <RangeSlider
                min="0"
                max="5000"
                step="100"
                value={filterFreq}
                onChange={handleFilterChange}
                vertical={true}
              />
            </div>
            <div className="control">
              <label>RES</label>
              <RangeSlider
                min="0"
                max="10"
                step="0.5"
                value={filterQ}
                onChange={handleFilterQChange}
                vertical={true}
              />
            </div>
          </div>
        </section>
        <section className="controls-section">
          <h2>ENVELOPE</h2>
          <div className="controls-section__group">
            <div className="control">
              <label>A</label>
              <RangeSlider
                min="0"
                max="5"
                step="0.5"
                value={attack}
                onChange={handleAttackChange}
                vertical={true}
              />
            </div>
            <div className="control">
              <label>D</label>
              <RangeSlider
                min="0"
                max="5"
                step="0.5"
                value={decay}
                onChange={handleDecayChange}
                vertical={true}
              />
            </div>
            <div className="control">
              <label>S</label>
              <RangeSlider
                min="0"
                max="1"
                step="0.1"
                value={sustain}
                onChange={handleSustainChange}
                vertical={true}
              />
            </div>
            <div className="control">
              <label>R</label>
              <RangeSlider
                min="0"
                max="5"
                step="0.5"
                value={release}
                onChange={handleReleaseChange}
                vertical={true}
              />
            </div>
          </div>
        </section>
        <section className="controls-section">
          <h2>DELAY</h2>
          <div className="controls-section__group">
            <div className="control">
              <label>TIME</label>
              <RangeSlider
                min="0.1"
                max="1"
                step="0.1"
                value={delayTime}
                onChange={handleDelayTimeChange}
                vertical
              />
            </div>
            <div className="control">
              <label>FDBK</label>
              <RangeSlider
                min="0.1"
                max="1"
                step="0.1"
                value={delayFeedback}
                onChange={handleDelayFeedbackChange}
                vertical
              />
            </div>
          </div>
        </section>
      </div>
      <div className="keyboard">{keyboardMarkup}</div>
      <Analyser
        audioContext={audioContext.current}
        inputNode={mainGain.current}
      />
    </div>
  );
};
