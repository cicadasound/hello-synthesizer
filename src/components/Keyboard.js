import React from 'react';
import classnames from 'classnames';

import KEYS from '../data/KEYS';

export function Keyboard({pressedKeys, onKeyTouchStart, onKeyTouchEnd}) {
  const keys = Object.entries(KEYS);
  const keyboardMarkup = keys.map(([keyboardKey, key]) => {
    const keyActive = pressedKeys.includes(keyboardKey);
    const keyClasses = classnames('key', {
      'key--black': key.note.includes('#'),
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
