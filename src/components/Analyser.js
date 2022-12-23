import React, {useRef, useEffect} from 'react';
import classnames from 'classnames';

export function Analyser({audioContext, inputNode, poweredOn}) {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!poweredOn || !audioContext || !inputNode) {
      return;
    }

    analyserRef.current = audioContext.createAnalyser();
    inputNode.connect(analyserRef.current);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    visualize(context);
  }, [audioContext, inputNode, poweredOn]);

  const visualize = (canvasCtx) => {
    const grey = getComputedStyle(document.documentElement).getPropertyValue(
      '--grey-700'
    );
    const green = getComputedStyle(document.documentElement).getPropertyValue(
      '--green'
    );
    const WIDTH = canvasRef.current.width;
    const HEIGHT = canvasRef.current.height;

    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.fftSize;

    // We can use Float32Array instead of Uint8Array if we want higher precision
    // const dataArray = new Float32Array(bufferLength);
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = () => {
      analyserRef.current.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = grey;
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 1;
      canvasCtx.strokeStyle = green;
      canvasCtx.beginPath();

      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
      canvasCtx.stroke();

      requestAnimationFrame(draw);
    };

    draw();
  };

  const canvasClassName = classnames('analyser__canvas', {
    'analyser__canvas--visible': poweredOn,
  });

  return (
    <div className="analyser">
      <canvas className={canvasClassName} ref={canvasRef} />
    </div>
  );
}
