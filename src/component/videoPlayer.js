export default function VideoPlayer({ videoRef, videoURL, type, setDuration }) {

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return (
    <video
      ref={videoRef}
      controls
      width="600"
      style={{ marginTop: "20px", border: "1px solid #ccc" }}
      onLoadedMetadata={handleLoadedMetadata}
    >
      <source src={videoURL} type={type} />
      Your browser does not support the video tag.
    </video>
  );
}
