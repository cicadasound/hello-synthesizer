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
        <label>Time</label>
        <RangeSlider
          min="0"
          max="1"
          step={0.05}
          value={delay.time}
          onChange={(value) => handleChange('time', value)}
          vertical
        />
      </div>
      <div className="control">
        <label>Feedback</label>
        <RangeSlider
          min="0"
          max="1"
          step={0.05}
          value={delay.feedback}
          onChange={(value) => handleChange('feedback', value)}
          vertical
        />
      </div>
    </Module>
  );
}
