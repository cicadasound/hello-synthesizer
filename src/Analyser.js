import React, { useRef, useEffect } from "react";

export function Analyser({ audioContext, inputNode }) {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!audioContext || !inputNode) {
      return;
    }

    analyserRef.current = audioContext.createAnalyser();
    inputNode.connect(analyserRef.current);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //Our draw come here
    visualize(context);
  }, [audioContext, inputNode]);

  function visualize(canvasCtx) {
    const WIDTH = canvasRef.current.width;
    const HEIGHT = canvasRef.current.height;

    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.fftSize;

    // We can use Float32Array instead of Uint8Array if we want higher precision
    // const dataArray = new Float32Array(bufferLength);
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = function () {
      analyserRef.current.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = "rgb(217, 229, 214)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";
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
  }

  return (
    <canvas className="analyser" ref={canvasRef} width="200" height="200" />
  );
}
