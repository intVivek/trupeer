import { useRef, useState } from "react";
import FileUpload from "./FileUpload";
import VideoPlayer from "./videoPlayer";

export default function Editor() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
  };

  return (
    <div className="">
      {videoFile ? (
        <VideoPlayer
          videoRef={videoRef}
          videoURL={videoURL}
          type={videoFile.type}
          setDuration={setDuration}
        />
      ) : (
        <FileUpload onChange={handleFileChange} />
      )}
    </div>
  );
}
