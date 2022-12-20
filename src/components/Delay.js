import React from 'react';

import {RangeSlider} from './RangeSlider';
import {Module} from './Module';

export function Delay({title, delay, onChange}) {
  const handleChange = (key, value) => {
    const newDelay = {...delay};
    newDelay[key] = Number.parseFloat(value);
    onChange(newDelay);
  };

  return (
    <Module title={title}>
      <div className="control">
        <label>TIME</label>
        <RangeSlider
          min="0"
          max="1"
          step="0.1"
          value={delay.time}
          onChange={(value) => handleChange('time', value)}
          vertical
        />
      </div>
      <div className="control">
        <label>FDBK</label>
        <RangeSlider
          min="0"
          max="1"
          step="0.1"
          value={delay.feedback}
          onChange={(value) => handleChange('feedback', value)}
          vertical
        />
      </div>
    </Module>
  );
}
