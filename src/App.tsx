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

      (mediaRecorderRef.current as any).start(3000);
      // setInterval(
      //   () => {
      //     console.log(recordedChunks);
      //     handleSend();
      //   },
      //   3000,
      //   [handleDataAvailable, recordedChunks]
      // );
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
      ({ data }: { data: any }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
          const formData = new FormData();
          const blob = new Blob([data], {
            type: "video/webm",
          });
          formData.append("video", blob, "video.webm");
          console.log(data);
          console.log(formData);
          fetch(`http://localhost:3000/lab`, {
            method: "POST",
            headers: {
              "Content-Type": "video/webm",
              // "Content-Type": "application/octet-stream",
            },
            body: formData,
            mode: "no-cors",
          }).then((res) => console.log(res));
        }
      },
      [setRecordedChunks]
    );

    const handleStopCaptureClick = React.useCallback(async () => {
      (mediaRecorderRef.current as any).stop();
      setCapturing(false);
      setRecordedChunks([]);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleSend = React.useCallback(async () => {
      setCapturing(false);
      const duration = (Date.now() - startTime) / 1000;
      const numberOfChunks = Math.ceil(duration / 3);
      console.log("duration", duration);
      console.log("numberOfChunks", numberOfChunks);

      if (recordedChunks.length) {
        // const blob = new Blob(recordedChunks);
        // console.log(recordedChunks);
        // const blobArrayBuffer = await blob.arrayBuffer();
        // const segmentSize = 3 * 1000; // convert to milliseconds
        // const chunks = [];
        // let offset = 0;
        // while (offset < blob.size) {
        //   const chunkSize = Math.min(segmentSize, blob.size - offset);
        //   const chunkBlob = blob.slice(offset, offset + chunkSize);
        //   chunks.push(chunkBlob);
        //   offset += chunkSize;
        // }
        // console.log(chunks.length);
        // // chunks.forEach((chunk) => {
        // const data = new FormData();
        // data.append("video", chunks[0], "video.mp4");
        // console.log(blobArrayBuffer);
        // fetch(`http://localhost:3000/lab`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "video/mp4",
        //     // "Content-Type": "application/octet-stream",
        //   },
        //   body: data,
        //   mode: "no-cors",
        // }).then((res) => console.log(res));
        // });
        // for (let i = 0; i < numberOfChunks; i++) {
        //   const chunk = new EncodedVideoChunk({
        //     type: "key",
        //     data: blobArrayBuffer,
        //     timestamp: i * 3,
        //     duration: 1 === numberOfChunks - 1 ? duration % 3 : 3,
        //   });
        //   const arrayBuffer = new ArrayBuffer(chunk.byteLength);
        //   chunk.copyTo(arrayBuffer);
        //   const dataBlob = new Blob([arrayBuffer]);
        //   const data = new FormData();
        //   data.append("video", dataBlob, `video${i}.mp4`);
        // }
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
        {/* {recordedChunks.length > 0 && (
          <button onClick={handleSend}>Send to server</button>
        )} */}
      </>
    );
  };

  ReactDOM.render(<WebcamStreamCapture />, document.getElementById("root"));
}

export default App;
