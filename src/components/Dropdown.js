import {useState} from 'react';
import classnames from 'classnames';

import {ArrowIcon, SaveIcon, EditIcon, DeleteIcon} from '../icons';

export const Dropdown = ({
  selected,
  dirty,
  options,
  onSelectionChange,
  onNameChange,
  onDelete,
}) => {
  const [listVisible, setListVisible] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [editingOption, setEditingOption] = useState(null);

  const handleOptionSelect = (id) => {
    onSelectionChange(id);
    setListVisible(false);

    const synthNode = document.getElementById('synth');
    if (synthNode) {
      synthNode.focus();
    }
  };

  const handleEditOption = (id) => {
    const selectedOption = options.find((option) => `${option.id}` === `${id}`);

    if (selectedOption) {
      setEditingOption(selectedOption.id);
      setPresetName(selectedOption.label);
    }
  };

  const handlePresetNameChange = (event) => {
    setPresetName(event.target.value);
  };

  const handlePresetNameSaved = () => {
    setEditingOption(null);
    setPresetName('');
    onNameChange({id: editingOption, name: presetName});
  };

  const handlePresetNameKey = (event) => {
    event.stopPropagation();

    if (event.key === 'Enter') {
      handlePresetNameSaved();
    }
  };

  const toggleList = () => {
    setListVisible(!listVisible);
  };

  const dropdownClassNames = classnames('lcd-dropdown', {
    'lcd-dropdown--active': listVisible,
  });

  const selectedOption = options.find((option) => option.id === selected);
  const activeOption = selectedOption ? selectedOption : options[0];
  const activeMarkup = (
    <button className="lcd-dropdown__control" onClick={toggleList}>
      <div className="lcd-dropdown__label">
        <span className="lcd-dropdown__id">
          {activeOption.id.toString().padStart(2, '0')}
        </span>
        <span>
          {activeOption.label} {dirty && '*'}
        </span>
      </div>
      <div className="lcd-dropdown__icon">
        <ArrowIcon className="icon icon--rotate-90" />
      </div>
    </button>
  );

  const listItemsMarkup = options.map(({id, label}) => {
    const primaryActionMarkup =
      editingOption === id ? (
        <button className="lcd-option__action" onClick={handlePresetNameSaved}>
          <SaveIcon className="icon" />
        </button>
      ) : (
        <button
          className="lcd-option__action"
          onClick={() => handleEditOption(id)}
          value={id}
        >
          <EditIcon className="icon" />
        </button>
      );
    const secondaryActionMarkup = (
      <button className="lcd-option__action" onClick={() => onDelete(id)}>
        <DeleteIcon className="icon" />
      </button>
    );
    const controlMarkup =
      editingOption === id ? (
        <input
          type="text"
          className="lcd-text-field"
          value={presetName}
          onChange={handlePresetNameChange}
          onKeyDown={handlePresetNameKey}
        />
      ) : (
        <button
          onClick={() => handleOptionSelect(id)}
          className="lcd-option__control"
          value={id}
        >
          <span>{id.toString().padStart(2, '0')}</span>
          <span>{label}</span>
        </button>
      );
    return (
      <li className="lcd-dropdown__option" key={id}>
        <div className="lcd-option">
          <div className="lcd-option__actions">
            {primaryActionMarkup}
            {secondaryActionMarkup}
            {controlMarkup}
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className={dropdownClassNames}>
      {activeMarkup}
      <div className="lcd-dropdown__options">
        <ul className="lcd-dropdown__list">{listItemsMarkup}</ul>
      </div>
    </div>
  );
};
