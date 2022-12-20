import React from 'react';
import classnames from 'classnames';

import KEYS from '../data/KEYS';

export function Keyboard({
  pressedKeys,
  currentNote,
  onKeyTouchStart,
  onKeyTouchEnd,
}) {
  const keys = Object.entries(KEYS);
  const keyboardMarkup = keys.map(([keyboardKey, key]) => {
    const keyActive = Boolean(pressedKeys.find((n) => n.name === key.note));
    const keyCurrent =
      currentNote !== null && pressedKeys[currentNote]
        ? pressedKeys[currentNote].name === key.note
        : false;
    const keyClasses = classnames('key', {
      'key--black': key.note.includes('#'),
      'key--current': keyCurrent,
      'key--active': keyActive,
    });
    return (
      <button
        className={keyClasses}
        key={key.note}
        data-active={keyActive}
        data-key={keyboardKey}
        onMouseDown={onKeyTouchStart}
        onMouseUp={onKeyTouchEnd}
        onTouchStart={onKeyTouchStart}
        onTouchEnd={onKeyTouchEnd}
        tabIndex="-1"
      >
        <div className="key__note">{key.note}</div>
        <div className="key__keyboard-key">
          <div className="key__keyboard-key-cap">{keyboardKey}</div>
        </div>
      </button>
    );
  });

  return <div className="keyboard">{keyboardMarkup}</div>;
}
