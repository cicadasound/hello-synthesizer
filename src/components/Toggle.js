import React from 'react';
import classnames from 'classnames';

export function Toggle({label, active, onChange}) {
  const toggleClasses = classnames('toggle', {'toggle--active': active});
  return (
    <div className={toggleClasses}>
      <button
        className="toggle__input"
        aria-label={label}
        onClick={onChange}
      ></button>
      <label className="toggle__label">{label}</label>
    </div>
  );
}
