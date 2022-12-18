import React from 'react';

import {RangeSlider} from './RangeSlider';

export function LFO({title, lfo, onChange}) {
  const handleChange = (key, value) => {
    const newLFO = {...lfo};
    newLFO[key] = value;
    onChange(newLFO);
  };

  const waveOptions = [
    {
      name: 'Triangle',
      value: 'triangle',
    },
    {
      name: 'Sine',
      value: 'sine',
    },
    {
      name: 'Square',
      value: 'square',
    },
  ];

  const destinationOptions = [
    {
      name: 'FLTR',
      value: 'filter',
    },
    {
      name: 'OSC1',
      value: 'osc1',
    },
    {
      name: 'OSC2',
      value: 'osc2',
    },
  ];

  return (
    <section className="controls-section">
      <h2>{title}</h2>
      <div className="controls-section__group controls-section__group--vertical">
        <div className="control">
          <label>WAVE</label>
          <select
            value={lfo.type}
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
          <label>DEST</label>
          <select
            value={lfo.destination}
            onChange={(event) =>
              handleChange('destination', event.target.value)
            }
          >
            {destinationOptions.map(({value, name}) => {
              return (
                <option key={value} value={value}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="control">
          <label>FRQ</label>
          <RangeSlider
            min="0.1"
            max="20"
            step="0.1"
            value={lfo.frequency}
            onChange={(value) => handleChange('frequency', value)}
          />
        </div>
        <div className="control">
          <label>AMT</label>
          <RangeSlider
            min="0"
            max="10000"
            step="100"
            value={lfo.level}
            onChange={(value) => handleChange('level', value)}
          />
        </div>
      </div>
    </section>
  );
}
