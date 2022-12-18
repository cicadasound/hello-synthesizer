import React from 'react';

import {RangeSlider} from './RangeSlider';

export function Envelope({title, envelope, onChange}) {
  const handleChange = (key, value) => {
    const newEnvelope = {...envelope};
    newEnvelope[key] = Number.parseFloat(value);
    onChange(newEnvelope);
  };

  return (
    <section className="controls-section">
      <h2>{title}</h2>
      <div className="controls-section__group">
        <div className="control">
          <label>A</label>
          <RangeSlider
            min="0"
            max="5"
            step="0.5"
            value={envelope.attack}
            onChange={(value) => handleChange('attack', value)}
            vertical={true}
          />
        </div>
        <div className="control">
          <label>D</label>
          <RangeSlider
            min="0"
            max="5"
            step="0.5"
            value={envelope.decay}
            onChange={(value) => handleChange('decay', value)}
            vertical={true}
          />
        </div>
        <div className="control">
          <label>S</label>
          <RangeSlider
            min="0"
            max="1"
            step="0.1"
            value={envelope.sustain}
            onChange={(value) => handleChange('sustain', value)}
            vertical={true}
          />
        </div>
        <div className="control">
          <label>R</label>
          <RangeSlider
            min="0"
            max="5"
            step="0.5"
            value={envelope.release}
            onChange={(value) => handleChange('release', value)}
            vertical={true}
          />
        </div>
      </div>
    </section>
  );
}
