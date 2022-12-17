import React from 'react';
import classnames from 'classnames';

export function Toggle({label, active, onChange}) {
  const toggleClasses = classnames('toggle', {'toggle--active': active});
  return (
    <div className={toggleClasses}>
      <label className="toggle__label">{label}</label>
      <button
        className="toggle__input"
        aria-label={label}
        onClick={onChange}
      ></button>
    </div>
  );
}
