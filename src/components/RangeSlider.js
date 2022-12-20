import React, {useRef, useEffect} from 'react';
import classnames from 'classnames';

export function RangeSlider({value, onChange, vertical, highlightCentre, ...rest}) {
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

  const ticks = [...Array(9).keys()];

  const createTicks = (second) => {
    return ticks.map((tick) => {
      const even = (tick + 1) % 2 == 0;
      const size = even ? 10 : 40;
      const firstOffset = even ? 5 : -10;
      const secondOffset = even ? 0 : -10;
      const offset = second ? secondOffset : firstOffset;

      const tickClassName = classnames('range-ticks__tick', {
        'range-ticks__tick--centre': tick === 4 && highlightCentre,
      });

      return vertical ? (
        <rect
          key={tick}
          className={tickClassName}
          x={offset}
          y={`${(tick / ticks.length) * 100}%`}
          width={size}
          height="1"
        ></rect>
      ) : (
        <rect
          key={tick}
          className={tickClassName}
          x={`${(tick / ticks.length) * 100}%`}
          y={offset}
          width="1"
          height={size}
        ></rect>
      );
    });
  };

  const firstTicks = createTicks(false);
  const secondTicks = createTicks(true);

  const orient = vertical ? {orient: 'vertical'} : {};

  return (
    <div className={className}>
      <svg role="presentation" className="range-ticks">
        {firstTicks}
      </svg>
      <svg role="presentation" className="range-ticks range-ticks--bottom">
        {secondTicks}
      </svg>
      <input
        type="range"
        {...orient}
        className="range-container__input"
        {...rest}
        value={value}
        onChange={handleChange}
        ref={sliderRef}
      />
    </div>
  );
}
