import React, {useEffect, useState, useRef} from 'react';

import NOTES from '../data/NOTES';

export const Midi = ({audioContext, onNotePlayed, onNoteStopped, hide}) => {
  const midiAccessRef = useRef(null);
  const [inputs, setInputs] = useState([]);
  const [selectedInput, setSelectedInput] = useState(null);

  const onMIDISuccess = (midiAccess) => {
    console.log('MIDI ready!');
    midiAccessRef.current = midiAccess;
    startMIDIInput();
  };

  const onMIDIFailure = (msg) => {
    console.error(`Failed to get MIDI access - ${msg}`);
  };

  const startMIDIInput = () => {
    const newInputs = [...midiAccessRef.current.inputs.values()];
    if (newInputs && newInputs.length > 0) {
      setInputs(newInputs);
    }

    midiAccessRef.current.onstatechange = (event) => {
      // Print information about the (dis)connected MIDI controller
      console.log(event.port.name, event.port.manufacturer, event.port.state);
    };
  };

  const handleMIDIMessage = (message) => {
    var command = message.data[0];
    var midiNote = message.data[1];
    var velocity = message.data.length > 2 ? message.data[2] : 0;
    const note = NOTES.find((n) => n.midi === midiNote);

    switch (command) {
      case 144: // noteOn
        console.log('Note on', note);
        onNotePlayed(note, true);
        break;
      case 128: // noteOff
        console.log('Note off', note);
        onNoteStopped(note);
        break;
    }
  };

  const handleInputSelectChange = (event) => {
    if (selectedInput) {
      selectedInput.removeEventListener('midimessage', handleMIDIMessage);
    }
    const newSelectedInput = inputs.find(
      (input) => input.id === event.target.value
    );
    newSelectedInput.addEventListener('midimessage', handleMIDIMessage);
    setSelectedInput(newSelectedInput);
  };

  React.useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }
  }, []);

  return (
    midiAccessRef.current && !hide && (
      <div>
        <h2>MIDI Settings</h2>
        <label>DEVICE</label>
        <select
          value={selectedInput?.id || 'all'}
          onChange={handleInputSelectChange}
        >
          <option key="all" value="all">
            All
          </option>
          {inputs.map((input) => {
            return (
              <option key={input.id} value={input.id}>
                {input.name}
              </option>
            );
          })}
        </select>
      </div>
    )
  );
};
