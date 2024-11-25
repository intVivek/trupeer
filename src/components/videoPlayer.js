export default function VideoPlayer({ videoRef, videoURL, type, setDuration, setCurrentTime }) {

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
  );
}
