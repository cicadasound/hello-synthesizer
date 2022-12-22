import React, {useEffect, useState, useRef} from 'react';

import {Module} from './Module';

export const AudioSettings = ({hidden, onDeviceChange}) => {
  const midiAccessRef = useRef(null);
  const [outputs, setOutputs] = useState([]);
  const [selectedOutput, setSelectedOutput] = useState(null);

  const handleOutputSelectChange = (event) => {
    const newSelectedOutput = outputs.find(
      (output) => output.id === event.target.value
    );
    
    if (!newSelectedOutput) {
        return;
    }
    
    onDeviceChange(newSelectedOutput);
    setSelectedOutput(newSelectedOutput);
  };
  
  const getOutputDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    if (devices) {
        const newOutputs = devices.filter((device) => device.kind === 'audiooutput').map((device) => {
            return {
                id: device.deviceId,
                name: device.label,
            };
        })
        setOutputs(newOutputs);
    }
  };

  React.useEffect(() => {
    getOutputDevices();
  }, []);

  return (
    !hidden && (
      <Module title="AUDIO SETTINGS">
        <label>DEVICE</label>
        <select
          value={selectedOutput?.id || 'all'}
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
    )
  );
};
