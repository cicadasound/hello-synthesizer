import React, { useRef } from "react";
import classnames from "classnames";

export function RangeSlider({ value, onChange, vertical, ...rest }) {
  const hovered = useRef(false);
  const className = classnames("range-container", {
    "range-container--vertical": vertical
  });

  const handleMouseEnter = (event) => {
    hovered.current = true;
  };

  const handleMouseLeave = (event) => {
    hovered.current = false;
  };

  const handleWheel = (event) => {
    const step = Number.parseFloat(event.target.step);
    if (event.deltaY < 0) {
      event.target.valueAsNumber += step;
    } else {
      event.target.valueAsNumber -= step;
    }
    event.preventDefault();
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <input
        type="range"
        {...rest}
        value={value}
        onChange={onChange}
        onWheel={handleWheel}
      />
    </div>
  );
}
