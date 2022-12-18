import React, {useRef, useEffect} from 'react';
import classnames from 'classnames';

export function RangeSlider({value, onChange, vertical, ...rest}) {
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
      const delta = vertical ? event.deltaY : event.deltaX;
      const step = Number.parseFloat(event.target.step);
      const newValue =
        delta < 0
          ? event.target.valueAsNumber + step
          : event.target.valueAsNumber - step;
      onChange(newValue);
      event.stopPropagation();
      event.preventDefault();
    };

    if (sliderRef && sliderRef.current) {
      sliderRef.current.addEventListener('wheel', handleWheel, {
        passive: false,
      });
      return function cleanup() {
        sliderRef.current.removeEventListener('wheel', handleWheel, {
          passive: false,
        });
      };
    }
  }, []);

  const handleChange = (event) => {
    onChange(event.target.valueAsNumber);
  };

  const className = classnames('range-container', {
    'range-container--vertical': vertical,
  });

  return (
    <div className={className}>
      <input
        type="range"
        {...rest}
        value={value}
        onChange={handleChange}
        ref={sliderRef}
      />
    </div>
  );
}
