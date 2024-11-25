import { useVideoContext } from "@/hooks/useVideoContext";
import { useState } from "react";
import ZoomBlockHandle from "./ZoomBlockHandle";

export default function Timeline({
  currentTime,
  duration,
  videoRef,
  setCurrentTime,
  timelineRef,
  setOpenBlockEditor,
}) {
  const { setZoomBlocks, zoomBlocks } = useVideoContext();
  const [isResizing, setIsResizing] = useState(false);
  const handlePlayheadDrag = (event) => {
    const timeline = timelineRef?.current.getBoundingClientRect();
    const dragX = Math.min(
      Math.max(event.clientX - timeline.left, 0),
      timeline.width
    );
    const newTime = (dragX / timeline.width) * duration;

    if (videoRef?.current) {
      videoRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const startDragging = () => {
    window.addEventListener("mousemove", handlePlayheadDrag);
    window.addEventListener("mouseup", stopDragging);
  };

  const stopDragging = () => {
    window.removeEventListener("mousemove", handlePlayheadDrag);
    window.removeEventListener("mouseup", stopDragging);
  };

  const handleAddZoom = (event) => {
    if (isResizing) return;
    event.stopPropagation();
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
        startTime: Math.round(startTime),
        endTime: Math.round(Math.min(startTime + 10, duration)),
        x: 0,
        y: 0,
        scaleFactor: 2,
      };
      setZoomBlocks((prev) => [...prev, newZoomBlock]);
    }
  };

  return (
    <div
      ref={timelineRef}
      className="w-full mt-4 h-16 relative rounded-md border border-gray200  cursor-pointer"
      onClick={handleAddZoom}
    >
      {[...Array(11)].map((_, i) => (
        <div
          className="absolute bottom-0 h-[10px] w-[1px] bg-gray-600"
          key={i}
          style={{
            left: `${(i / 10) * 95 + 1}%`,
          }}
        />
      ))}
      <div
        className="absolute z-10 top-0 w-[1px] h-full  rounded-sm cursor-grab transform -translate-x-1/2 bg-accentColor"
        style={{
          left: `${(currentTime / duration) * 100}%`,
        }}
        onMouseDown={startDragging}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute top-[-6px] left-1/2 w-[12px] h-[12px] bg-accentColor rounded-full cursor-pointer transform -translate-x-1/2"
          style={{
            cursor: "grab",
          }}
        ></div>
      </div>
      {zoomBlocks &&
        zoomBlocks.map((block, i) => {
          const blockWidth =
            ((block.endTime - block.startTime) / duration) * 100;
          const blockLeft = (block.startTime / duration) * 100;
          return (
            <ZoomBlockHandle
              key={block.id}
              blockWidth={blockWidth}
              setIsResizing={setIsResizing}
              setOpenBlockEditor={setOpenBlockEditor}
              blockLeft={blockLeft}
              i={i}
              block={block}
              duration={duration}
            />
          );
        })}
    </div>
  );
}
