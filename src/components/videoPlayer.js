import { useVideoContext } from "@/hooks/useVideoContext";
import { useEffect } from "react";
import ZoomBlocksOverlay from "./ZoomBlocksOverlay";

export default function VideoPlayer({
  setDuration,
  currentTime,
  setCurrentTime,
  videoRef,
}) {

  const { videoURL, videoFile } = useVideoContext();

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    <div className="relative">

      <ZoomBlocksOverlay currentTime={currentTime}/>
      <video
        ref={videoRef}
        controls={false}
        width="600"
        className="border border-gray-600 rounded-md"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={videoURL} type={videoFile?.type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
