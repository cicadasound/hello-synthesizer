import React, {useEffect, useState, useRef} from 'react';

import {Module} from './Module';

export const Presets = ({hidden, presets, selectedPreset, onPresetChange, onPresetDownload, onPresetUpload}) => {
  const handlePresetChange = (event) => {
    const newPreset = presets.find((preset) => preset.name === event.target.value);
    if (!newPreset) {
      return;
    }
    onPresetChange(newPreset);
  };
  
  const handlePrevPreset = () => {
    let currentPresetIndex;
    presets.forEach((preset, index) => {
      if (preset.name === selectedPreset.name) {
        currentPresetIndex = index;
      }
    });
    const newSelectedPreset = currentPresetIndex === 0 ? presets[presets.length] : presets[currentPresetIndex - 1];
    onPresetChange(newSelectedPreset);
  }
  
  const handleNextPreset = () => {
    let currentPresetIndex;
    presets.forEach((preset, index) => {
      if (preset.name === selectedPreset.name) {
        currentPresetIndex = index;
      }
    });
    const newSelectedPreset = currentPresetIndex === presets.length - 1 ? presets[0] : presets[currentPresetIndex + 1];
    onPresetChange(newSelectedPreset);
  }
  
  const handleFileSelect = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      const preset = JSON.parse(e.target.result);
      onPresetUpload(preset);
    };
  };

  return (
    !hidden && (
      <Module title="PRESETS">
        <label>UPLOAD</label>
        <input type="file" onChange={handleFileSelect} />
        <button onClick={handlePrevPreset}>PREV</button>
        <div>{selectedPreset.name}</div>
        <button onClick={handleNextPreset}>NEXT</button>
        <button onClick={onPresetDownload}>DOWNLOAD</button>
      </Module>
    )
  );
};
