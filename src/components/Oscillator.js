import React from 'react';

import {RangeSlider} from './RangeSlider';

export function Oscillator({title, osc, onChange}) {
  const handleChange = (key, value) => {
    const newOsc = {...osc};
    newOsc[key] = value;
    onChange(newOsc);
  };

  return (
    <section className="controls-section">
      <h2>{title}</h2>
      <div className="controls-section__group controls-section__group--vertical">
        <div className="control">
          <label>WAVE</label>
          <select
            selected={osc.type}
            onChange={(event) => handleChange('type', event.target.value)}
          >
            <option value="sawtooth">Sawtooth</option>
            <option value="square">Square</option>
            <option value="sine">Sine</option>
          </select>
        </div>
        <div className="control">
          <label>OCT</label>
          <select
            selected={osc.octave}
            onChange={(event) => handleChange('octave', event.target.value)}
          >
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
            value={osc.detune}
            onChange={(event) => handleChange('detune', event.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
