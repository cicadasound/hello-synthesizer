import React, {useState, useEffect, useRef} from 'react';

import {
  UploadIcon,
  DownloadIcon,
  SettingsIcon,
  PlusIcon,
  EditIcon,
  SaveIcon,
} from '../icons';

export const Presets = ({
  editing,
  dirty,
  presets,
  selectedPreset,
  onPresetChange,
  onPresetDownload,
  onPresetUpload,
  onSettingsToggle,
  onPresetAdd,
  onPresetEdit,
  onPresetNameChange,
  onPresetSave,
}) => {
  const [presetName, setPresetName] = useState(selectedPreset.name);
  const uploadRef = useRef(null);

  useEffect(() => {
    setPresetName(selectedPreset.name);
  }, [selectedPreset]);

  const handlePresetChange = (event) => {
    const newPreset = presets.find(
      (preset) => `${preset.id}` === event.target.value
    );
    if (newPreset) {
      onPresetChange(newPreset);
    }
  };

  const handleUploadClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const handlePresetNameChange = (event) => {
    setPresetName(event.target.value);
  };

  const handlePresetNameKey = (event) => {
    event.stopPropagation();

    if (event.key === 'Enter') {
      onPresetNameChange({...selectedPreset, name: presetName});
    }
  };

  const handlePresetNameChanged = () => {
    onPresetNameChange({...selectedPreset, name: presetName});
  };

  const handleSaveClick = () => {
    if (editing) {
      handlePresetNameChanged(presetName);
    } else {
      onPresetSave();
    }
  };

  const handleUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      onPresetUpload(JSON.parse(event.target.result));
    };
  };

  const presetNameMarkup = editing ? (
    <input
      type="text"
      className="lcd-text-field"
      value={presetName}
      onChange={handlePresetNameChange}
      onKeyDown={handlePresetNameKey}
    />
  ) : (
    <select
      className="lcd-select"
      value={selectedPreset.id}
      onChange={handlePresetChange}
    >
      {presets.map((preset) => (
        <option key={preset.id} value={preset.id}>
          {preset.name} {dirty && selectedPreset.id === preset.id && `*`}
        </option>
      ))}
    </select>
  );

  return (
    <div className="presets">
      <div className="presets__selector">
        <span>{selectedPreset.id.toString().padStart(2, '0')}</span>
        {presetNameMarkup}
      </div>
      <div className="presets__controls">
        <div className="presets__control-group">
          <button
            className="lcd-button lcd-button--icon"
            onClick={handleSaveClick}
            disabled={!dirty && !editing}
          >
            <SaveIcon className="icon" />
          </button>
          <button
            className="lcd-button lcd-button--icon"
            disabled={editing}
            onClick={onPresetEdit}
          >
            <EditIcon className="icon" />
          </button>
        </div>
        <div className="presets__control-group">
          <button className="lcd-button lcd-button--icon" onClick={onPresetAdd}>
            <PlusIcon className="icon" />
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
