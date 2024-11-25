import { useEffect } from "react";

export default function VideoPlayer({
  videoRef,
  videoURL,
  type,
  setDuration,
  currentTime,
  setCurrentTime,
  zoomBlocks
}) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
        {zoomBlocks.map((block) => {
          const isActive =
            currentTime >= block.startTime && currentTime <= block.endTime;
          return (
            isActive && (
              <div
                key={block.id}
                className="absolute border-2 border-yellow-500 rounded-md"
                style={{
                  top: `${block.y}px`,
                  left: `${block.x}px`, 
                  width: `${600/block.scaleFactor}px`,
                  height: `${320/block.scaleFactor}px`,
                  pointerEvents: 'none', 
                  transition: 'opacity 0.3s ease-in-out', 
                }}
              ></div>
            )
          );
        })}

      <video
        ref={videoRef}
        controls
        width="600"
        className="border border-gray-600 rounded-md"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={videoURL} type={type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
