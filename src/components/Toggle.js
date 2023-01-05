import React from 'react';
import classnames from 'classnames';

export function Toggle({label, active, primary, icon, onChange}) {
  const toggleClasses = classnames('toggle', {
    'toggle--active': active,
    'toggle--primary': primary,
    'toggle--icon': icon,
  });

  const labelMarkup = !icon ? (
    <span className="toggle__label">{label}</span>
  ) : null;
  const contentMarkup = icon ? icon : null;

  return (
    <div className={toggleClasses}>
      {labelMarkup}
      <button className="toggle__control" aria-label={label} onClick={onChange}>
        {contentMarkup}
      </button>
    </div>
  );
}
