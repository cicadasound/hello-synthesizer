import React from 'react';

import {RangeSlider} from './RangeSlider';

export function Oscillator({title, osc, onChange}) {
  const handleChange = (key, value) => {
    const newOsc = {...osc};
    newOsc[key] = value;
    onChange(newOsc);
  };

  const waveOptions = [
    {
      name: 'Sawtooth',
      value: 'sawtooth',
    },
    {
      name: 'Square',
      value: 'square',
    },
    {
      name: 'Sine',
      value: 'sine',
    },
    {
      name: 'Triangle',
      value: 'triangle',
    },
  ];

  const octaveOptions = [
    {
      name: '1',
      value: '1',
    },
    {
      name: '2',
      value: '2',
    },
    {
      name: '3',
      value: '3',
    },
    {
      name: '4',
      value: '4',
    },
  ];

  return (
    <section className="controls-section">
      <h2>{title}</h2>
      <div className="controls-section__group controls-section__group--vertical">
        <div className="control">
          <label>WAVE</label>
          <select
            value={osc.type}
            onChange={(event) => handleChange('type', event.target.value)}
          >
            {waveOptions.map(({value, name}) => {
              return (
                <option key={value} value={value}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="control">
          <label>OCT</label>
          <select
            value={osc.octave}
            onChange={(event) => handleChange('octave', event.target.value)}
          >
            {octaveOptions.map(({value, name}) => {
              return (
                <option key={value} value={value}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="control">
          <label>DETUNE</label>
          <RangeSlider
            min="-12"
            max="12"
            step="0.5"
            value={osc.detune}
            onChange={(value) => handleChange('detune', value)}
          />
        </div>
      </div>
    </section>
  );
}
