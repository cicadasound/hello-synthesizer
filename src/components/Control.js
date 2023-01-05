import React from 'react';

import {RangeSlider} from './RangeSlider';
import {Module} from './Module';
import {Toggle} from './Toggle';

import {PowerIcon} from '../icons';

export function Control({control, title, onChange, poweredOn, onPowerChange}) {
  const handleChange = (key, value) => {
    const newControl = {...control};
    newControl[key] = value;
    onChange(newControl);
  };

  return (
    <Module title={title}>
      <Toggle
        label="Power"
        onChange={onPowerChange}
        active={poweredOn}
        primary
        icon={<PowerIcon />}
      />
      <div className="control">
        <label>Speed</label>
        <RangeSlider
          min="20"
          max="240"
          step="1"
          value={control.tempo}
          onChange={(value) => handleChange('tempo', value)}
        />
      </div>
      <section className="toggle-group">
        <Toggle
          label="Latch"
          onChange={() => handleChange('latch', !control.latch)}
          active={control.latch}
        />
        <Toggle
          label="Arp"
          onChange={() => handleChange('arp', !control.arp)}
          active={control.arp}
        />
      </section>
    </Module>
  );
}
