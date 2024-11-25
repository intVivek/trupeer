import { useVideoContext } from "@/hooks/useVideoContext";
import { useState } from "react";
import ZoomBlocksOverlay from "./ZoomBlocksOverlay";

export default function VideoPlayer({
  setDuration,
  currentTime,
  setCurrentTime,
  videoRef,
  isPreview,
}) {
  const [currentZoom, setCurrentZoom] = useState(null);

  const { videoURL, videoFile, zoomBlocks } = useVideoContext();

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;

      const activeZoom = zoomBlocks.find(
        (block) =>
          currentTime >= block.startTime && currentTime <= block.endTime
      );
      setCurrentTime(videoRef.current.currentTime);
      setCurrentZoom(activeZoom || null);
    }
  };

  const getTransformStyle = () => {
    if (!currentZoom||!isPreview) return {};

    const { x, y, scaleFactor } = currentZoom;

    return {
      transform: `scale(${scaleFactor}) translate(${-x}px, ${-y}px)`,
      transformOrigin: "top left",
    };
  };

  return (
    <div className="relative border border-gray200 rounded-md overflow-hidden w-[600px] h-[320px]">
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={getTransformStyle()}
      >
        {!isPreview && <ZoomBlocksOverlay currentTime={currentTime} />}
        <video
          ref={videoRef}
          controls={false}
          width="600"
          className=""
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={videoURL} type={videoFile?.type} />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
