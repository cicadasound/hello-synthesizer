import React from 'react';
import classnames from 'classnames';

export function Toggle({label, active, onChange}) {
  const toggleClasses = classnames('toggle', {'toggle--active': active});
  return (
    <div className={toggleClasses}>
      <span className="toggle__label">{label}</span>
      <button className="toggle__control" aria-label={label} onClick={onChange}></button>
    </div>
  );
}
