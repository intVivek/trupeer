import { useState } from "react";
import { MdOutlineDragHandle } from "react-icons/md";

export default function Timeline({
  currentTime,
  duration,
  videoRef,
  setCurrentTime,
  timelineRef,
  zoomBlocks,
  setZoomBlocks,
  setOpenBlockEditor,
}) {

  const [isResizing, setIsResizing] = useState(false);
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
    if(isResizing) return;
    event.stopPropagation()
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

  const handleResizeLeft = (event, block, i) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
  
    const initialMouseX = event.clientX;
    const initialStartTime = block.startTime;
  
    const onMouseMove = (e) => {
      e.stopPropagation();
  
      const deltaX = initialMouseX - e.clientX; 
  
      let newStartTime = initialStartTime - (deltaX / 4.5);
  
      newStartTime = Math.max(0, newStartTime);
  
      const overlappingBlock = zoomBlocks.find(
        (b, index) =>
          index !== i && 
          newStartTime < b.endTime && newStartTime >= b.startTime
      );
      if (overlappingBlock) {
        newStartTime = overlappingBlock.endTime; 
      }
  
      setZoomBlocks((prev) =>
        prev.map((b, index) =>
          index === i ? { ...b, startTime: newStartTime } : b
        )
      );
    };
  
    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  
  

  const handleResizeRight = (event, block, i) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
  
    const initialMouseX = event.clientX;
    const initialEndTime = block.endTime;
  
    const onMouseMove = (e) => {
      e.stopPropagation();
  
      const deltaX = e.clientX - initialMouseX;
  
      let newEndTime = initialEndTime + (deltaX / 4.5);
  
      newEndTime = Math.min(duration, newEndTime);
  
      const overlappingBlock = zoomBlocks.find(
        (b, index) =>
          index !== i && 
          newEndTime > b.startTime && newEndTime <= b.endTime
      );
  
      if (overlappingBlock) {
        newEndTime = overlappingBlock.startTime;
      }
  
      setZoomBlocks((prev) =>
        prev.map((b, index) =>
          index === i ? { ...b, endTime: newEndTime } : b
        )
      );
    };
  
    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
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
            left: `${(i / 10) * 95 + 1}%`,
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
        zoomBlocks.map((block, i) => {
          const blockWidth =
            ((block.endTime - block.startTime) / duration) * 100;
          const blockLeft = (block.startTime / duration) * 100;
          return (
            <div
              key={block.id}
              className="absolute flex h-full bg-transparentYellow border overflow-hidden border-yellow-500 rounded-md"
              style={{
                left: `${blockLeft}%`,
                width: `${blockWidth}%`,
              }}
              onMouseDown={e=>e.stopPropagation()}
              onClick={e=>e.stopPropagation()}
            >
                <div
                className="w-3 h-full grid place-items-center bg-yellow-600 cursor-ew-resize"
                onMouseDown={(e) => handleResizeLeft(e, block, i)}
                onClick={(e) => e.stopPropagation()}
              ><MdOutlineDragHandle className="text-white -translate-x-[2px]  rotate-90"/></div>
              <div
                className="flex-1 h-full "
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenBlockEditor(i);
                }}
              ></div>
              <div
                className="w-3 h-full flex-shrink-0 grid place-items-center bg-yellow-600 cursor-ew-resize"
                onMouseDown={(e) => handleResizeRight(e, block, i)}
                onClick={(e) => e.stopPropagation()}
              ><MdOutlineDragHandle className="text-white -translate-x-[2px]  rotate-90"/></div>
            </div>
          );
        })}
    </div>
  );
}
