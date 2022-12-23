import React from 'react';

import {ArrowIcon, UploadIcon, DownloadIcon, SettingsIcon} from '../icons';

export const Presets = ({
  presets,
  selectedPreset,
  onPresetChange,
  onPresetDownload,
  onPresetUpload,
  onSettingsToggle,
}) => {
  let currentPresetIndex;
  presets.forEach((preset, index) => {
    if (preset.name === selectedPreset.name) {
      currentPresetIndex = index;
    }
  });

  const handlePrevPreset = () => {
    const newSelectedPreset =
      currentPresetIndex === 0
        ? presets[presets.length - 1]
        : presets[currentPresetIndex - 1];
    onPresetChange(newSelectedPreset);
  };

  const handleNextPreset = () => {
    const newSelectedPreset =
      currentPresetIndex === presets.length - 1
        ? presets[0]
        : presets[currentPresetIndex + 1];
    onPresetChange(newSelectedPreset);
  };

  return (
    <div className="presets">
      <div className="presets__selector">
        <button
          className="lcd-button lcd-button--icon"
          onClick={handlePrevPreset}
        >
          <ArrowIcon className="icon icon--flip" />
        </button>
        <div className="selected-preset">
          <div className="selected-preset__index">
            PRESET {(currentPresetIndex + 1).toString().padStart(2, '0')}
          </div>
          <div className="selected-preset__name">{selectedPreset.name}</div>
        </div>
        <button
          className="lcd-button lcd-button--icon"
          onClick={handleNextPreset}
        >
          <ArrowIcon className="icon" />
        </button>
      </div>
      <div className="presets__controls">
        <label className="lcd-button lcd-button--icon" htmlFor="upload">
          <UploadIcon className="icon" />
          <input
            className="file-input"
            type="file"
            id="upload"
            onChange={onPresetUpload}
          />
        </label>
        <button
          className="lcd-button lcd-button--icon"
          onClick={onPresetDownload}
        >
          <DownloadIcon className="icon" />
        </button>
        <button
          className="lcd-button lcd-button--icon"
          onClick={onSettingsToggle}
        >
          <SettingsIcon className="icon" />
        </button>
      </div>
    </div>
  );
};
