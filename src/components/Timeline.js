import { useState } from "react";

export default function Timeline({
  currentTime,
  duration,
  videoRef,
  setCurrentTime,
  timelineRef,
  zoomBlocks,
  setZoomBlocks,
}) {
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

  const handleAddZoom = (event) => {
    const timeline = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - timeline.left;
    const startTime = (clickX / timeline.width) * duration;

    const overlappingBlock = zoomBlocks.find(
      (block) =>
        (startTime >= block.startTime && startTime < block.endTime) ||
        (startTime + 10 > block.startTime && startTime + 10 <= block.endTime)
    );

    if (overlappingBlock) {
      console.log("Already exists or overlaps with an existing block.");
    } else {
      const newZoomBlock = {
        id: Math.floor(Math.random() * 100000),
        startTime,
        endTime: Math.min(startTime + 10, duration),
        x: 0,
        y: 0,
        factor: 2,
      };
      setZoomBlocks((prev) => [...prev, newZoomBlock]);
    }
  };

  return (
    <div
      ref={timelineRef}
      className="w-full mt-4 h-16 relative rounded-md border border-gray-600  cursor-pointer"
      onClick={handleAddZoom}
    >
      {[...Array(11)].map((_, i) => (
        <div
          className="absolute bottom-0 h-[10px] w-[1px] bg-gray-600"
          key={i}
          style={{
            left: `${((i / 10) * 95) +1}%`,
          }}
        />
      ))}
      <div
        className="absolute z-10 top-0 w-[1px] h-full  rounded-sm cursor-grab transform -translate-x-1/2 bg-yellow-500"
        style={{
          left: `${(currentTime / duration) * 100}%`,
        }}
        onMouseDown={startDragging}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute top-[-6px] left-1/2 w-[12px] h-[12px] bg-yellow-500 rounded-full cursor-pointer transform -translate-x-1/2"
          style={{
            cursor: "grab",
          }}
        ></div>
      </div>
      {zoomBlocks &&
        zoomBlocks.map((block) => {
          const blockWidth =
            ((block.endTime - block.startTime) / duration) * 100;
          const blockLeft = (block.startTime / duration) * 100;
          return (
            <div
              key={block.id}
              className="absolute h-full bg-transparentYellow border border-gray-600 rounded-md"
              style={{
                left: `${blockLeft}%`,
                width: `${blockWidth}%`,
              }}
            />
          );
        })}
    </div>
  );
}
