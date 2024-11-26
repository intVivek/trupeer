import { useVideoContext } from "@/hooks/useVideoContext";
import { useEffect, useState } from "react";
import ZoomBlocksOverlay from "./ZoomBlocksOverlay";

export default function VideoPlayer({ isPreview, setOpenBlockEditor }) {
  const [currentZoom, setCurrentZoom] = useState(null);

  const {
    videoURL,
    videoFile,
    zoomBlocks,
    setDuration,
    setCurrentTime,
    videoRef,
    width,
    height,
    dispatch,
  } = useVideoContext();

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      dispatch(setDuration(videoRef.current.duration));
    }
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      handleTimeUpdate();
    }, 50);
    return () => clearTimeout(timeout);
  }, [zoomBlocks]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;

      const activeZoom = zoomBlocks.find(
        (block) =>
          currentTime >= block.startTime && currentTime <= block.endTime
      );
      dispatch(setCurrentTime(videoRef.current.currentTime));
      setCurrentZoom(activeZoom || null);
    }
  };

  const getTransformStyle = () => {
    if (!currentZoom || !isPreview) return {};

    const { x, y, scaleFactor } = currentZoom;

    return {
      transform: `scale(${scaleFactor}) translate(${-x}px, ${-y}px)`,
      transformOrigin: "top left",
    };
  };

  return (
    <div
      className={`relative border border-gray200 rounded-md overflow-hidden w-full`}
      style={{height}}
    >
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={getTransformStyle()}
      >
        {!isPreview && (
          <ZoomBlocksOverlay setOpenBlockEditor={setOpenBlockEditor} />
        )}
        <video
          ref={videoRef}
          controls={false}
          className="w-full"
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
