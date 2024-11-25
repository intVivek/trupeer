export default function Timeline({currentTime, duration, videoRef, setCurrentTime, timelineRef}) {

  const handlePlayheadDrag = (event) => {
    const timeline = timelineRef.current.getBoundingClientRect();
    const dragX = Math.min(
      Math.max(event.clientX - timeline.left, 0),
      timeline.width
    );
    const newTime = (dragX / timeline.width) * duration;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const startDragging = (event) => {
    window.addEventListener("mousemove", handlePlayheadDrag);
    window.addEventListener("mouseup", stopDragging);
  };

  const stopDragging = () => {
    window.removeEventListener("mousemove", handlePlayheadDrag);
    window.removeEventListener("mouseup", stopDragging);
  };

  
  return (
    <div
    ref={timelineRef}
      className="w-full mt-4 h-16 relative rounded-md border border-gray-600 overflow-hidden cursor-pointer"
    >
      {[...Array(11)].map((_, i) => (
        <div
        className="absolute bottom-0 h-[10px] w-[1px] bg-gray-600"
          key={i}
          style={{
            left: `${(i / 10) * 100}%`,
          }}
        />
      ))}
      <div
      className="absolute top-0 w-[2px] h-full hover:scale-x-[4] transition-transform  rounded-sm cursor-grab transform -translate-x-1/2 bg-yellow-500"
        style={{
          left: `${(currentTime / duration) * 100}%`,
        }}
        onMouseDown={startDragging}
      ></div>
    </div>
  );
}
