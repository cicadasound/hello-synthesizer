import React, {useState, useEffect, useRef} from 'react';

import {Dropdown} from './Dropdown';

import {
  UploadIcon,
  DownloadIcon,
  SettingsIcon,
  PlusIcon,
  SaveIcon,
} from '../icons';

export const Presets = ({
  dirty,
  presets,
  selectedPreset,
  onPresetChange,
  onPresetDownload,
  onPresetUpload,
  onSettingsToggle,
  onPresetAdd,
  onPresetNameChange,
  onPresetSave,
  onPresetDelete,
}) => {
  const uploadRef = useRef(null);

  const handlePresetChange = (value) => {
    const newPreset = presets.find((preset) => `${preset.id}` === `${value}`);
    if (newPreset) {
      onPresetChange(newPreset);
    }
  };

  const handleUploadClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const handlePresetNameChange = ({id, name}) => {
    const newPreset = presets.find((preset) => `${preset.id}` === `${id}`);
    if (newPreset) {
      onPresetNameChange({...newPreset, name});
    }
  };

  const handlePresetDelete = (id) => {
    onPresetDelete(id);
  };

  const handleSaveClick = () => {
    onPresetSave();
  };

  const handleUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      onPresetUpload(JSON.parse(event.target.result));
    };
  };

  const presetOptions = presets.map((preset) => {
    return {
      id: preset.id,
      label: preset.name,
    };
  });

  const presetNameMarkup = (
    <Dropdown
      selected={selectedPreset.id}
      dirty={dirty}
      onSelectionChange={handlePresetChange}
      onNameChange={handlePresetNameChange}
      onDelete={handlePresetDelete}
      options={presetOptions}
    />
  );

  return (
    <div className="presets">
      <div className="presets__selector">{presetNameMarkup}</div>
      <div className="presets__controls">
        <div className="presets__control-group">
          <button
            className="lcd-button lcd-button--icon"
            onClick={handleSaveClick}
            disabled={!dirty}
          >
            <SaveIcon className="icon" />
          </button>
        </div>
        <div className="presets__control-group">
          <button className="lcd-button lcd-button--icon" onClick={onPresetAdd}>
            <PlusIcon className="icon icon--small" />
          </button>
          <button
            className="lcd-button lcd-button--icon"
            htmlFor="upload"
            onClick={handleUploadClick}
          >
            <UploadIcon className="icon" />
          </button>
          <input
            className="file-input"
            type="file"
            id="upload"
            ref={uploadRef}
            onChange={handleUpload}
          />
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
    </div>
  );
};
