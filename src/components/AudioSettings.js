import React, {useState} from 'react';

import {Select} from './Select';

export const AudioSettings = ({hidden, onDeviceChange}) => {
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
    await navigator.mediaDevices.getUserMedia({audio: true});
    const devices = await navigator.mediaDevices.enumerateDevices();
    if (devices) {
      const newOutputs = devices
        .filter(
          (device) => device.kind === 'audiooutput' && device.label !== ''
        )
        .map((device) => {
          return {
            id: device.deviceId,
            name: device.label,
          };
        });
      setOutputs(newOutputs);
    }
  };

  React.useEffect(() => {
    getOutputDevices();
  }, []);

  return (
    !hidden && (
      <div className="lcd-input">
        <label className="lcd-input__label">AUDIO DEVICE</label>
        <Select
          wide
          value={selectedOutput?.id || 'default'}
          onChange={handleOutputSelectChange}
        >
          <Select.Option key="default" value="default">
            Default
          </Select.Option>
          {outputs.map((output) => {
            return (
              <option key={output.id} value={output.id}>
                {output.name}
              </option>
            );
          })}
        </Select>
      </div>
    )
  );
};
