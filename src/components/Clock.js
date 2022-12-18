import React from 'react';

import {RangeSlider} from './RangeSlider';

export function Clock({clock, title, onChange}) {
  const handleChange = (key, value) => {
    const newClock = {...clock};
    newClock[key] = value;
    onChange(newClock);
  };

  return (
    <section className="controls-section">
      <h2>{title}</h2>
      <div className="controls-section__group controls-section__group--vertical">
        <div className="control">
          <label>TEMPO</label>
          <RangeSlider
            vertical
            min="20"
            max="240"
            step="1"
            value={clock.tempo}
            onChange={(value) => handleChange('tempo', value)}
          />
        </div>
      </div>
    </section>
  );
}
