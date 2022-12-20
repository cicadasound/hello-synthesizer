import React from 'react';
import classnames from 'classnames';

export function Toggle({label, active, onChange}) {
  const toggleClasses = classnames('toggle', {'toggle--active': active});
  return (
    <button className={toggleClasses} aria-label={label} onClick={onChange}>
      <span className="toggle__indicator" />
      <span className="toggle__label">{label}</span>
    </button>
  );
}
