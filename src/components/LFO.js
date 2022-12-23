import React from 'react';

import {RangeSlider} from './RangeSlider';
import {ToggleGroup} from './ToggleGroup';
import {Module} from './Module';

import {TriangleIcon, SineIcon, SquareIcon} from '../icons';

export function LFO({title, lfo, onChange}) {
  const handleChange = (key, value) => {
    const newLFO = {...lfo};
    newLFO[key] = value;
    onChange(newLFO);
  };

  const waveOptions = [
    {
      label: 'Triangle',
      value: 'triangle',
      icon: TriangleIcon,
    },
    {
      label: 'Sine',
      value: 'sine',
      icon: SineIcon,
    },
    {
      label: 'Square',
      value: 'square',
      icon: SquareIcon,
    },
  ];

  const destinationOptions = [
    {
      label: 'FLTR',
      value: 'filter',
    },
    {
      label: 'OSC1',
      value: 'osc1',
    },
    {
      label: 'OSC2',
      value: 'osc2',
    },
  ];

  return (
    <Module title={title}>
      <div className="control">
        <label>AMT</label>
        <RangeSlider
          min={0}
          max={300}
          step={1}
          minpos={0}
          maxpos={100}
          scale="log"
          value={lfo.level}
          onChange={(value) => handleChange('level', value)}
        />
      </div>
      <div className="stack">
        <div className="control">
          <label className="visually-hidden">WAVE</label>
          <ToggleGroup
            options={waveOptions}
            selected={lfo.type}
            onChange={(type) => handleChange('type', type)}
          />
        </div>
        <div className="control">
          <label className="visually-hidden">DEST</label>
          <ToggleGroup
            options={destinationOptions}
            selected={lfo.destination}
            onChange={(destination) => handleChange('destination', destination)}
          />
        </div>
      </div>
      <div className="control">
        <label>FRQ</label>
        <RangeSlider
          min={0}
          max={100}
          step={1}
          minpos={0}
          maxpos={100}
          scale="log"
          value={lfo.frequency}
          onChange={(value) => handleChange('frequency', value)}
        />
      </div>
    </Module>
  );
}
