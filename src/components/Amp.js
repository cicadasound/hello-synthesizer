import React from 'react';

import {RangeSlider} from './RangeSlider';
import {Module} from './Module';

export function Amp({title, amp, onChange}) {
  const handleChange = (key, value) => {
    const newAmp = {...amp};
    newAmp[key] = value;
    onChange(newAmp);
  };

  return (
    <Module title={title} vertical>
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
    </Module>
  );
}
