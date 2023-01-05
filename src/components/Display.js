import React, {useEffect, useState, useRef} from 'react';

import {Module} from './Module';

export const AudioSettings = () => {
  const midiAccessRef = useRef(null);
  const [outputs, setOutputs] = useState([]);
  const [selectedOutput, setSelectedOutput] = useState(null);

  return (
    <Module title="AUDIO SETTINGS">
      <label>DEVICE</label>
      <select
        value={selectedOutput?.id || 'default'}
        onChange={handleOutputSelectChange}
      >
        <option key="default" value="default">
          Default
        </option>
        {outputs.map((output) => {
          return (
            <option key={output.id} value={output.id}>
              {output.name}
            </option>
          );
        })}
      </select>
    </Module>
  );
};
