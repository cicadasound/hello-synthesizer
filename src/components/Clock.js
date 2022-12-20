import React from 'react';

import {RangeSlider} from './RangeSlider';

export function Clock({clock, title, onChange}) {
  const handleChange = (key, value) => {
    const newClock = {...clock};
    newClock[key] = value;
    onChange(newClock);
  };

  return (
    <div className="control">
      <label>SPEED</label>
      <RangeSlider
        min="20"
        max="240"
        step="1"
        value={clock.tempo}
        onChange={(value) => handleChange('tempo', value)}
      />
    </div>
  );
}
