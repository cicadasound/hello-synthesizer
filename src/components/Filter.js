import React from 'react';

import {RangeSlider} from './RangeSlider';
import {Module} from './Module';

export function Filter({title, filter, onChange}) {
  const handleChange = (key, value) => {
    const newFilter = {...filter};
    newFilter[key] = Number.parseFloat(value);
    onChange(newFilter);
  };

  return (
    <Module title={title}>
      <div className="control">
        <label>FREQ</label>
        <RangeSlider
          vertical
          min="0"
          max="5000"
          step="100"
          value={filter.frequency}
          onChange={(value) => handleChange('frequency', value)}
        />
      </div>
      <div className="control">
        <label>RES</label>
        <RangeSlider
          vertical
          min="0"
          max="10"
          step="0.5"
          value={filter.q}
          onChange={(value) => handleChange('q', value)}
        />
      </div>
    </Module>
  );
}
