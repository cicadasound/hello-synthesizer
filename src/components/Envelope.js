import React from 'react';

import {RangeSlider} from './RangeSlider';
import {Module} from './Module';

export function Envelope({title, envelope, onChange}) {
  const handleChange = (key, value) => {
    const newEnvelope = {...envelope};
    newEnvelope[key] = Number.parseFloat(value);
    onChange(newEnvelope);
  };

  return (
    <Module title={title}>
      <div className="control">
        <label>A</label>
        <RangeSlider
          min={0}
          max={10}
          step={1}
          minpos={0}
          maxpos={100}
          scale="log"
          value={envelope.attack}
          onChange={(value) => handleChange('attack', value)}
          vertical={true}
        />
      </div>
      <div className="control">
        <label>D</label>
        <RangeSlider
          min={0}
          max={10}
          step={1}
          minpos={0}
          maxpos={100}
          scale="log"
          value={envelope.decay}
          onChange={(value) => handleChange('decay', value)}
          vertical={true}
        />
      </div>
      <div className="control">
        <label>S</label>
        <RangeSlider
          min={0}
          max={0.65}
          step={0.5}
          minpos={0}
          maxpos={100}
          scale="log"
          value={envelope.sustain}
          onChange={(value) => handleChange('sustain', value)}
          vertical={true}
        />
      </div>
      <div className="control">
        <label>R</label>
        <RangeSlider
          min={0}
          max={10}
          step={1}
          minpos={0}
          maxpos={100}
          scale="log"
          value={envelope.release}
          onChange={(value) => handleChange('release', value)}
          vertical={true}
        />
      </div>
    </Module>
  );
}
