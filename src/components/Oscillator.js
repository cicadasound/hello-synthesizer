import React from 'react';

import {RangeSlider} from './RangeSlider';
import {ToggleGroup} from './ToggleGroup';
import {Module} from './Module';

import {TriangleIcon, SineIcon, SquareIcon, SawtoothIcon} from '../icons';

export function Oscillator({title, osc, onChange}) {
  const handleChange = (key, value) => {
    const newOsc = {...osc};
    newOsc[key] = value;
    onChange(newOsc);
  };

  const waveOptions = [
    {
      label: 'Sawtooth',
      value: 'sawtooth',
      icon: SawtoothIcon,
    },
    {
      label: 'Square',
      value: 'square',
      icon: SquareIcon,
    },
    {
      label: 'Sine',
      value: 'sine',
      icon: SineIcon,
    },
    {
      label: 'Triangle',
      value: 'triangle',
      icon: TriangleIcon,
    },
  ];

  const octaveOptions = [
    {
      label: '32',
      value: 0.5,
    },
    {
      label: '16',
      value: 1,
    },
    {
      label: '8',
      value: 2,
    },
    {
      label: '4',
      value: 3,
    },
    {
      label: '2',
      value: 4,
    },
  ];

  return (
    <Module title={title} vertical>
      <div className="control">
        <label className="visually-hidden">WAVE</label>
        <ToggleGroup
          options={waveOptions}
          selected={osc.type}
          onChange={(type) => handleChange('type', type)}
        />
      </div>
      <div className="control">
        <label className="visually-hidden">OCT</label>
        <ToggleGroup
          options={octaveOptions}
          selected={osc.octave}
          onChange={(octave) => handleChange('octave', octave)}
        />
      </div>
      <div className="control">
        <label>DETUNE</label>
        <RangeSlider
          min="-120"
          max="120"
          step="1"
          value={osc.detune}
          highlightCentre
          onChange={(value) => handleChange('detune', value)}
        />
      </div>
    </Module>
  );
}
