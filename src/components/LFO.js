import React from 'react';

import {RangeSlider} from './RangeSlider';

export function LFO({title, lfo, onChange}) {
  const handleChange = (key, value) => {
    const newLFO = {...lfo};
    newLFO[key] = value;
    onChange(newLFO);
  };

  return (
    <section className="controls-section">
      <h2>{title}</h2>
      <div className="controls-section__group controls-section__group--vertical">
        <div className="control">
          <label>WAVE</label>
          <select
            selected={lfo.type}
            onChange={(event) => handleChange('type', event.target.value)}
          >
            <option value="sawtooth">Sawtooth</option>
            <option value="square">Square</option>
            <option value="sine">Sine</option>
          </select>
        </div>
        <div className="control">
          <label>DEST</label>
          <select
            selected={lfo.destination}
            onChange={(event) =>
              handleChange('destination', event.target.value)
            }
          >
            <option value="osc1">OSC1</option>
            <option value="osc2">OSC2</option>
            <option value="filter">FLTR</option>
          </select>
        </div>
        <div className="control">
          <label>FRQ</label>
          <RangeSlider
            min="20"
            max="2000"
            step="20"
            value={lfo.frequency}
            onChange={(event) => handleChange('frequency', event.target.value)}
          />
        </div>
        <div className="control">
          <label>AMT</label>
          <RangeSlider
            min="0"
            max="1"
            step="0.05"
            value={lfo.level}
            onChange={(event) => handleChange('level', event.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
