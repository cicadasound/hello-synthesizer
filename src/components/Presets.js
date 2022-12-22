import React, {useEffect, useState, useRef} from 'react';

import {Module} from './Module';

export const Presets = ({hidden, onPresetChange, onPresetDownload}) => {
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handlePresetChange = (event) => {
    const newSelectedPreset = presets.find(
      (preset) => preset.id === event.target.value
    );
    
    if (!newSelectedPreset) {
        return;
    }
    setSelectedPreset(newSelectedPreset);
  };
  
  const handleChange = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      const preset = JSON.parse(e.target.result);
      console.log("e.target.result", preset);
      onPresetChange(preset);
    };
  };

  return (
    !hidden && (
      <Module title="PRESETS">
        <label>UPLOAD</label>
        <input type="file" onChange={handleChange} />
        <button onClick={onPresetDownload}>DOWNLOAD</button>
      </Module>
    )
  );
};
