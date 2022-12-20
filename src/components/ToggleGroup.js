import classnames from 'classnames';

export function ToggleGroup({options, onChange, selected}) {
  return (
    <div className="toggle-group">
      {options.map((option) => {
        const toggleClasses = classnames('toggle-group__toggle', {
          'toggle-group__toggle--active': selected === option.value,
        });

        const OptionIcon = option.icon;

        const toggleContent = option.icon ? (
          <span className="toggle__icon">
            <OptionIcon />
          </span>
        ) : (
          <span className="toggle-group__toggle-label">{option.label}</span>
        );

        return (
          <button
            key={option.value}
            className={toggleClasses}
            aria-label={option.label}
            onClick={() => onChange(option.value)}
          >
            {toggleContent}
          </button>
        );
      })}
    </div>
  );
}
