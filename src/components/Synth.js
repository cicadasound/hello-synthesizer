import React, {useEffect, useState, useRef} from 'react';
import classnames from 'classnames';
const {
  uniqueNamesGenerator,
  adjectives,
  animals,
} = require('unique-names-generator');
import 'cancelandholdattime-polyfill';

import {Analyser} from './Analyser';
import {AudioSettings} from './AudioSettings';
import {Oscillator} from './Oscillator';
import {Amp} from './Amp';
import {Filter} from './Filter';
import {Envelope} from './Envelope';
import {Delay} from './Delay';
import {Keyboard} from './Keyboard';
import {Control} from './Control';
import {LFO} from './LFO';
import {Module} from './Module';
import {CicadaIcon, LogoIcon} from '../icons';
import {Midi} from './Midi';
import {Presets} from './Presets';

import {FACTORY_PRESETS, KEYS, NOTES} from '../data';

const LOCAL_STORAGE_KEY = 'HelloSynth-PresetListData';

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function downloadObjectAsJson(exportObj, exportName) {
  var dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // needed for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

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
};

export const Synth = () => {
  const audioContextRef = useRef(null);
  const audioRef = useRef(null);
  const destinationRef = useRef(null);
  const voicesRef = useRef([]);
  const mainGainRef = useRef(null);
  const filterRef = useRef(null);
  const delayRef = useRef(null);
  const feedbackRef = useRef(null);
  const envelopeRef = useRef(DEFAULTS.envelope);
  const lfoRef = useRef(null);
  const lfoGainRef = useRef(null);
  const arpClockRef = useRef(null);

  const [presets, setPresets] = useState(FACTORY_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState(FACTORY_PRESETS[0]);
  const [poweredOn, setPoweredOn] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [pressedKeys, setPressedKeys] = useState([]);
  const [osc1, setOsc1] = useState(DEFAULTS.osc1);
  const [osc2, setOsc2] = useState(DEFAULTS.osc2);
  const [lfo, setLFO] = useState(DEFAULTS.lfo);
  const [amp, setAmp] = useState(DEFAULTS.amp);
  const [filter, setFilter] = useState(DEFAULTS.filter);
  const [envelope, setEnvelope] = useState(DEFAULTS.envelope);
  const [delay, setDelay] = useState(DEFAULTS.delay);
  const [control, setControl] = useState(DEFAULTS.control);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setupAudioContext();
    loadStoredPresets();
    setTimeout(() => powerOn(), 300);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (key === 'Escape') {
        pressedKeys.forEach((note) => {
          stopNote(note, true);
        });
        setPressedKeys([]);
        return;
      } else if (key === 'M' && event.shiftKey) {
        setSettingsVisible(!settingsVisible);
        return;
      } else if (key === ' ') {
        toggleArp();
      } else if (key === 's' && event.metaKey) {
        event.preventDefault();
        savePreset();
        return;
      }

      if (!KEYS[key]) {
        return;
      }

      const note = NOTES.find((n) => n.name === KEYS[key].note);

      if (note && poweredOn) {
        playNote(note);
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key;

      if (!KEYS[key]) {
        return;
      }

      const note = NOTES.find((n) => n.name === KEYS[key].note);
      if (note) {
        stopNote(note);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [poweredOn, pressedKeys]);

  useEffect(() => {
    const currentSettings = {
      id: selectedPreset.id,
      name: selectedPreset.name,
      lfo,
      osc1,
      osc2,
      amp,
      filter,
      delay,
      control,
      envelope,
    };
    setDirty(
      JSON.stringify(currentSettings) !== JSON.stringify(selectedPreset)
    );
  }, [lfo, osc1, osc2, amp, filter, delay, control, envelope, selectedPreset]);

  const loadStoredPresets = () => {
    const savedPresets = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!savedPresets) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(FACTORY_PRESETS));
      handlePresetChange(FACTORY_PRESETS[0]);
      return;
    }

    const presets = JSON.parse(savedPresets);
    handlePresetsChange(presets);
  };

  const handlePresetsChange = (presets) => {
    const newPresets = presets.map((preset, index) => {
      return {...preset, id: index + 1};
    });
    setPresets(newPresets);
    if (newPresets && newPresets.length > 0) {
      handlePresetChange(newPresets[0]);
    }
  };

  const handlePresetAdd = () => {
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      length: 2,
      separator: ' ',
      style: 'capital',
    });

    const presetSettings = {
      id: presets.length + 1,
      name: randomName,
      lfo,
      osc1,
      osc2,
      amp,
      filter,
      delay,
      control,
      envelope,
    };

    const newPresets = [...presets, presetSettings];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPresets));
    setPresets(newPresets);
    handlePresetChange(presetSettings);
  };

  const handlePresetDelete = (id) => {
    const newPresets = presets.filter((preset) => preset.id !== id);
    if (selectedPreset.id === id) {
      setSelectedPreset(presets[0]);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPresets));
    setPresets(newPresets);
  };

  const savePreset = (newName) => {
    const {id, name} = selectedPreset;
    const newPresetSettings = {
      id,
      name: newName ? newName : name,
      lfo,
      osc1,
      osc2,
      amp,
      filter,
      delay,
      control,
      envelope,
    };
    const newPresets = presets.map((preset) => {
      return preset.id === selectedPreset.id ? newPresetSettings : preset;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPresets));
    setPresets(newPresets);
    setSelectedPreset(newPresetSettings);
  };

  const handlePresetNameChange = (newPreset) => {
    const newPresets = presets.map((preset) => {
      return preset.id === newPreset.id ? newPreset : preset;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPresets));
    setPresets(newPresets);
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);

    const {name, lfo, osc1, osc2, amp, filter, delay, control, envelope} =
      preset;
    handleLFOChange(lfo);
    handleOsc1Change(osc1);
    handleOsc2Change(osc2);
    handleAmpChange(amp);
    handleFilterChange(filter);
    handleDelayChange(delay);
    handleControlChange(control);
    handleEnvelopeChange(envelope);
  };

  const handlePresetDownload = () => {
    const presetSettings = {
      name: selectedPreset.name,
      lfo,
      osc1,
      osc2,
      amp,
      filter,
      delay,
      control,
      envelope,
    };
    downloadObjectAsJson(presetSettings, slugify(presetSettings.name));
  };

  const handlePresetUpload = (newPreset) => {
    newPreset.id = presets.length + 1;
    const newPresets = [...presets, newPreset];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPresets));
    setPresets(newPresets);
    handlePresetChange(newPreset);
  };

  useEffect(() => {
    if (control.arp && pressedKeys.length > 0) {
      const secondsPerBeat = 60.0 / control.tempo;
      const note = currentNote ? pressedKeys[currentNote] : pressedKeys[0];
      if (note) {
        playArpNote(note);
      }
      arpClockRef.current = setTimeout(() => {
        const nextNote = currentNote + 1;
        if (nextNote === pressedKeys.length) {
          setCurrentNote(0);
        } else {
          setCurrentNote(nextNote);
        }
      }, secondsPerBeat * 1000);

      return () => clearTimeout(arpClockRef.current);
    }

    return () => {};
  }, [pressedKeys, currentNote, control.arp]);

  const setupAudioContext = () => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();

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
  };

  const destroyAudioContext = () => {
    audioContextRef.current = null;
    voicesRef.current = [];
    mainGainRef.current = null;
    filterRef.current = null;
    delayRef.current = null;
    feedbackRef.current = null;
    lfoRef.current = null;
    lfoGainRef.current = null;
    arpClockRef.current = null;
  };

  const handleDestinationDeviceChange = (newAudioDevice) => {
    destinationRef.current =
      audioContextRef.current.createMediaStreamDestination();
    mainGainRef.current.disconnect();
    mainGainRef.current.connect(destinationRef.current);
    audioRef.current = new Audio();
    audioRef.current.srcObject = destinationRef.current.stream;
    audioRef.current.play();
    audioRef.current.setSinkId(newAudioDevice.id);
  };

  const createOscillator = (note) => {
    if (!poweredOn) {
      return;
    }
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

    oscillator1.connect(vca);
    oscillator2.connect(vca);
    vca.connect(filterRef.current);
    voicesRef.current[note.name] = {
      vca,
      osc1: oscillator1,
      osc2: oscillator2,
      baseFrequency: frequency,
    };
  };

  const destroyOscillator = (note) => {
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

  const handleLFOChange = (newLFO) => {
    if (lfo.destination !== newLFO.destination) {
      lfoGainRef.current.disconnect();

      if (newLFO.destination === 'filter') {
        lfoGainRef.current.connect(filterRef.current.frequency);
      }
    }
    if (lfoGainRef.current.gain.value !== newLFO.level) {
      const scaledLevel =
        newLFO.destination === filter ? newLFO.level * 2 : newLFO.level;

      lfoGainRef.current.gain.setValueAtTime(
        scaledLevel,
        audioContextRef.current.currentTime
      );
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

  const handleOscChange = (newOsc, oldOsc, oscKey) => {
    if (newOsc.detune !== oldOsc.detune) {
      Object.keys(voicesRef.current).forEach((key) => {
        voicesRef.current[key][oscKey].detune.setValueAtTime(
          newOsc.detune,
          audioContextRef.current.currentTime
        );
      });
    }
    if (newOsc.octave !== oldOsc.octave) {
      Object.keys(voicesRef.current).forEach((key) => {
        const frequency = voicesRef.current[key].baseFrequency;
        voicesRef.current[key][oscKey].frequency.setValueAtTime(
          frequency * newOsc.octave,
          audioContextRef.current.currentTime
        );
      });
    }
    if (newOsc.type !== oldOsc.type) {
      Object.keys(voicesRef.current).forEach((key) => {
        const frequency = voicesRef.current[key].baseFrequency;
        voicesRef.current[key][oscKey].type = newOsc.type;
      });
    }
  };

  const handleOsc1Change = (newOsc) => {
    handleOscChange(newOsc, osc1, 'osc1');
    setOsc1(newOsc);
  };

  const handleOsc2Change = (newOsc) => {
    handleOscChange(newOsc, osc2, 'osc2');
    setOsc2(newOsc);
  };

  const powerOff = () => {
    pressedKeys.forEach((note) => {
      destroyOscillator(note);
    });
    setPressedKeys([]);
    setPoweredOn(false);
  };

  const powerOn = () => {
    setPoweredOn(true);
  };

  const handlePowerChange = () => {
    if (poweredOn) {
      powerOff();
    } else {
      powerOn();
    }
  };

  const handleControlChange = (newControl) => {
    if (control.latch !== newControl.latch && !newControl.latch) {
      pressedKeys.forEach((note) => stopNote(note, true));
      setPressedKeys([]);
    }

    if (newControl.arp && newControl.arp !== control.arp) {
      setCurrentNote(0);
      pressedKeys.forEach((note) => {
        destroyOscillator(note);
      });
    } else if (newControl.arp !== control.arp) {
      if (newControl.latch) {
        pressedKeys.forEach((note) => {
          createOscillator(note);
        });
      }
      setCurrentNote(null);
    }

    setControl(newControl);
  };

  const toggleArp = () => {
    const newControl = {...control, arp: !control.arp};
    handleControlChange(newControl);
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

  const playNote = (note) => {
    const notePressed = pressedKeys.find((n) => n.name === note.name);
    if (control.latch && notePressed) {
      stopNote(note, true);
    }

    if (notePressed) {
      return;
    }

    setPressedKeys([...pressedKeys, note]);

    if (control.arp) {
      return;
    }

    createOscillator(note);
  };

  const stopNote = (note, force) => {
    if (control.latch && !force) {
      return;
    }
    destroyOscillator(note);
    const filteredKeys = [...pressedKeys].filter((n) => n.name !== note.name);
    setPressedKeys(filteredKeys);
  };

  const handleKeyTouchStart = (event) => {
    const key = event.target.getAttribute('data-key');
    if (!KEYS[key]) {
      return;
    }
    const note = NOTES.find((n) => n.name === KEYS[key].note);
    playNote(note);
  };

  const handleKeyTouchEnd = (event) => {
    const key = event.target.getAttribute('data-key');
    if (!KEYS[key]) {
      return;
    }
    const note = NOTES.find((n) => n.name === KEYS[key].note);
    stopNote(note);
  };

  const playArpNote = (note) => {
    createOscillator(note);
    const {vca} = voicesRef.current[note.name];
    vca.gain.cancelAndHoldAtTime(audioContextRef.current.currentTime + 1);
    vca.gain.linearRampToValueAtTime(
      0,
      audioContextRef.current.currentTime + envelope.release + 1
    );
  };

  const handleSettingsToggle = () => {
    setSettingsVisible(!settingsVisible);
  };

  const synthClassNames = classnames('synth', {'synth--disabled': !poweredOn});
  const flipPanelClasses = classnames('flip-panel vertical', {
    'flip-panel--flipped': settingsVisible,
  });

  return (
    <div id="synth" className={synthClassNames} tabIndex={0}>
      <div className="synth__controls">
        <Module dark>
          <div className="header">
            <h1 className="visually-hidden">Hello Synth</h1>
            <LogoIcon className="logo" />
          </div>
        </Module>
        <div className={flipPanelClasses}>
          <div className="flip-panel__flipper">
            <div className="flip-panel__front">
              <div className="screen">
                <div className="screen__top">
                  <Analyser
                    audioContext={audioContextRef.current}
                    inputNode={mainGainRef.current}
                    poweredOn={poweredOn}
                  />
                </div>
                <div className="screen__bottom">
                  <Presets
                    presets={presets}
                    dirty={dirty}
                    selectedPreset={selectedPreset}
                    onPresetChange={handlePresetChange}
                    onPresetDownload={handlePresetDownload}
                    onPresetUpload={handlePresetUpload}
                    onPresetNameChange={handlePresetNameChange}
                    onSettingsToggle={handleSettingsToggle}
                    onPresetAdd={handlePresetAdd}
                    onPresetSave={savePreset}
                    onPresetDelete={handlePresetDelete}
                  />
                </div>
              </div>
            </div>
            <div className="flip-panel__back">
              <div className="screen">
                <div className="screen__top">
                  <div className="settings-panel">
                    <Midi
                      hidden={!settingsVisible}
                      audioContext={audioContextRef.current}
                      onNotePlayed={createOscillator}
                      onNoteStopped={destroyOscillator}
                    />
                    <AudioSettings
                      hidden={!settingsVisible}
                      onDeviceChange={handleDestinationDeviceChange}
                    />
                  </div>
                </div>
                <div className="screen__bottom">
                  <div className="settings-panel settings-panel--bottom">
                    <button
                      className="lcd-button"
                      onClick={handleSettingsToggle}
                    >
                      BACK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Module dark>
          <a href="https://cicadasound.ca">
            <CicadaIcon className="cicada" />
          </a>
        </Module>
      </div>
      <div className="synth__controls">
        <Control
          control={control}
          title="CONTROL"
          onChange={handleControlChange}
          poweredOn={poweredOn}
          onPowerChange={handlePowerChange}
        />
        <LFO title="LFO" lfo={lfo} onChange={handleLFOChange} />
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
      <Keyboard
        pressedKeys={pressedKeys}
        onKeyTouchStart={handleKeyTouchStart}
        onKeyTouchEnd={handleKeyTouchEnd}
        currentNote={currentNote}
        poweredOn={poweredOn}
      />
    </div>
  );
};
