import React from 'react';

import {RangeSlider} from './RangeSlider';

export function Delay({title, delay, onChange}) {
  const handleChange = (key, value) => {
    const newDelay = {...delay};
    newDelay[key] = Number.parseFloat(value);
    onChange(newDelay);
  };

  return (
    <section className="controls-section">
      <h2>{title}</h2>
      <div className="controls-section__group">
        <div className="control">
          <label>TIME</label>
          <RangeSlider
            min="0"
            max="1"
            step="0.1"
            value={delay.time}
            onChange={(event) => handleChange('time', event.target.value)}
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
            onChange={(event) => handleChange('feedback', event.target.value)}
            vertical
          />
        </div>
      </div>
    </section>
  );
}
