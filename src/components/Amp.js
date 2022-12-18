import React from 'react';

import {RangeSlider} from './RangeSlider';

export function Amp({title, amp, onChange}) {
  const handleChange = (key, value) => {
    const newAmp = {...amp};
    newAmp[key] = value;
    onChange(newAmp);
  };

  return (
    <section className="controls-section">
      <h2>{title}</h2>
      <div className="controls-section__group controls-section__group--vertical">
        <div className="control">
          <label>LEVEL</label>
          <RangeSlider
            vertical
            min="0"
            max="0.8"
            step="0.05"
            value={amp.level}
            onChange={(value) => handleChange('level', value)}
          />
        </div>
      </div>
    </section>
  );
}
