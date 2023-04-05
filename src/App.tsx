import "./App.css";
import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import Webcam from "react-webcam";

function App() {
  const WebcamStreamCapture = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const recordingInterval: any = useRef();
    let chunks: any[] = [];
    const [startTime, setStartTime] = useState(0);
    const [duration, setDuration] = useState(0);

    function startRecording() {
      setCapturing(true);
      (mediaRecorderRef.current as any) = new MediaRecorder(
        (webcamRef.current as any).stream,
        {
          mimeType: "video/webm",
        }
      );

      (mediaRecorderRef.current as any).addEventListener(
        "dataavailable",
        (e: any) => {
          console.log("dataavailable");
          chunks.push(e.data);
        }
      );
      (mediaRecorderRef.current as any).addEventListener("stop", (e: any) =>
        sendData(chunks)
      );
      setStartTime(Date.now());
      (mediaRecorderRef.current as any).start();

      recordingInterval.current = setInterval(() => {
        (mediaRecorderRef.current as any).stop();
        (mediaRecorderRef.current as any) = new MediaRecorder(
          (webcamRef.current as any).stream,
          {
            mimeType: "video/webm",
          }
        );
        (mediaRecorderRef.current as any).addEventListener(
          "dataavailable",
          (e: any) => {
            chunks.push(e.data);
          }
        );
        (mediaRecorderRef.current as any).addEventListener("stop", (e: any) =>
          sendData(chunks)
        );
        chunks = [];
        (mediaRecorderRef.current as any).start();
      }, 3000);
    }

    function sendData(chunks: any[]) {
      const blob = new Blob(chunks, {
        type: "video/webm",
      });

      const formData = new FormData();
      formData.append("video", blob, "video.webm");

      fetch(`http://localhost:3000/lab`, {
        method: "POST",
        headers: {
          "Content-Type": "video/webm",
        },
        body: formData,
        mode: "no-cors",
      }).then((res) => console.log(res));
    }

    function stopRecording() {
      const duration = Date.now() - startTime;
      const timeRemainder = duration % 3000;
      console.log("duration", duration);
      console.log("timeRemainder", timeRemainder);
      setCapturing(false);
      if (timeRemainder !== 0) {
        setTimeout(
          () => clearInterval(recordingInterval.current),
          3100 - timeRemainder
        );
      } else {
        clearInterval(recordingInterval.current);
      }
    }

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
          <button onClick={stopRecording}>Stop Capture</button>
        ) : (
          <button onClick={startRecording}>Start Capture</button>
        )}
      </>
    );
  };

  ReactDOM.render(<WebcamStreamCapture />, document.getElementById("root"));
}

export default App;
