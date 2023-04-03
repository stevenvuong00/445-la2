import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import Webcam from "react-webcam";

function App() {
  const WebcamStreamCapture = () => {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [startTime, setStartTime] = React.useState(0);

    const handleStartCaptureClick = React.useCallback(() => {
      setCapturing(true);
      setStartTime(Date.now());
      (mediaRecorderRef.current as any) = new MediaRecorder(
        (webcamRef.current as any).stream,
        {
          mimeType: "video/webm",
        }
      );

      (mediaRecorderRef.current as any).addEventListener(
        "dataavailable",
        handleDataAvailable
      );

      (mediaRecorderRef.current as any).start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
      ({ data }: { data: any }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      },
      [setRecordedChunks]
    );

    // function handleChunk(chunk: any, metadata: any) {
    //   if (metadata.decoderConfig) {
    //     // Decoder needs to be configured (or reconfigured) with new parameters
    //     // when metadata has a new decoderConfig.
    //     // Usually it happens in the beginning or when the encoder has a new
    //     // codec specific binary configuration. (VideoDecoderConfig.description).
    //     fetch("/upload_extra_data", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/octet-stream" },
    //       body: metadata.decoderConfig.description,
    //     });
    //   }

    const handleStopCaptureClick = React.useCallback(async () => {
      (mediaRecorderRef.current as any).stop();

      setRecordedChunks([]);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleSend = React.useCallback(async () => {
      setCapturing(false);

      const duration = (Date.now() - startTime) / 1000;
      const numberOfChunks = Math.ceil(duration / 3);
      console.log("duration", duration);
      console.log("numberOfChunks", numberOfChunks);

      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/mp4; codecs=h264",
        });

        const blobArrayBuffer = await blob.arrayBuffer();
        const segmentedChunks = [];
        for (let i = 0; i < numberOfChunks; i++) {
          const chunk = new EncodedVideoChunk({
            type: "key",
            data: blobArrayBuffer,
            timestamp: i * 3,
            duration: 1 === numberOfChunks - 1 ? duration % 3 : 3,
          });
          const chunkData = new Uint8Array(chunk.byteLength);
          segmentedChunks.push(chunkData);
          fetch(`http://labs445-1.encs.concordia.ca/home/team18/public_html`, {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
            },
            body: chunkData,
            mode: "no-cors",
          }).then((res) => console.log(res));
        }
      }
      setRecordedChunks([]);
    }, [recordedChunks]);

    return (
      <>
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored
          videoConstraints={{
            width: 1280,
            height: 720,
            framerate: 30,
          }}
        />
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleSend}>Send to server</button>
        )}
      </>
    );
  };

  ReactDOM.render(<WebcamStreamCapture />, document.getElementById("root"));
}

export default App;
