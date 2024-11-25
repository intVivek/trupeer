import { useRef, useState } from "react";
import FileUpload from "./FileUpload";
import VideoPlayer from "./videoPlayer";
import Timeline from "./Timeline";
import BlockEditor from "./BlockEditor";
import { useVideoContext } from "@/hooks/useVideoContext";
import Button from "./Button";
import Navigation from "./Navigation";

export default function Editor() {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [openBlockEditor, setOpenBlockEditor] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const timelineRef = useRef(null);

  const { videoFile, setVideoFile, setVideoURL } = useVideoContext();

  const handleFileChange = (file) => {
    if (!file) return;
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying); // Toggle the play state
    }
  };

  return (
    <div className="relative w-full flex items-center justify-between h-full">
      <div className="w-full flex items-center justify-center">
        {videoFile ? (
          <div className="w-[600px] m-auto">
            <VideoPlayer
              videoRef={videoRef}
              setDuration={setDuration}
              setCurrentTime={setCurrentTime}
              currentTime={currentTime}
            />
            <Navigation  videoRef={videoRef} setCurrentTime={setCurrentTime}/>
            <Timeline
              currentTime={currentTime}
              duration={duration}
              timelineRef={timelineRef}
              videoRef={videoRef}
              setCurrentTime={setCurrentTime}
              setOpenBlockEditor={setOpenBlockEditor}
            />
          </div>
        ) : (
          <FileUpload onChange={handleFileChange} />
        )}
      </div>
      {openBlockEditor !== -1 && (
        <BlockEditor
          index={openBlockEditor}
          onClose={() => setOpenBlockEditor(-1)}
          duration={duration}
          width={videoRef.current.videoWidth}
          height={videoRef.current.videoHeight}
        />
      )}
    </div>
  );
}
