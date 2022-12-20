import React from 'react';

import {RangeSlider} from './RangeSlider';
import {Module} from './Module';
import {Toggle} from './Toggle';

export function Control({control, title, onChange}) {
  const handleChange = (key, value) => {
    const newControl = {...control};
    newControl[key] = value;
    onChange(newControl);
  };

  return (
    <Module title="CONTROL">
      <div className="control">
        <label>SPEED</label>
        <RangeSlider
          min="20"
          max="240"
          step="1"
          value={control.tempo}
          onChange={(value) => handleChange('tempo', value)}
        />
      </div>
      <section className="toggle-group">
        <Toggle label="LATCH" onChange={() => handleChange('latch', !control.latch)} active={control.latch} />
        <Toggle label="ARP" onChange={() => handleChange('arp', !control.arp)} active={control.arp} />
      </section>
    </Module>
  );
}
