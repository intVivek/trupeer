import { useRef, useState } from "react";
import FileUpload from "./FileUpload";
import VideoPlayer from "./videoPlayer";
import Timeline from "./Timeline";

export default function Editor() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const timelineRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
  };

  return (
    <div className="">
      {videoFile ? (
        <div>
          <VideoPlayer
            videoRef={videoRef}
            videoURL={videoURL}
            type={videoFile.type}
            setDuration={setDuration}
            setCurrentTime={setCurrentTime}
          />
          <Timeline
            currentTime={currentTime}
            duration={duration}
            timelineRef={timelineRef}
            videoRef={videoRef}
            setCurrentTime={setCurrentTime}
          />
        </div>
      ) : (
        <FileUpload onChange={handleFileChange} />
      )}
    </div>
  );
}
