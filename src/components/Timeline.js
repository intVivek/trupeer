import { useVideoContext } from "@/hooks/useVideoContext";
import { useRef, useState } from "react";
import ZoomBlockHandle from "./ZoomBlockHandle";
import { twMerge } from "tailwind-merge";
import formatTime from "@/util/formatTime";

export default function Timeline({ setOpenBlockEditor, isPreview }) {
  const {
    setZoomBlocks,
    zoomBlocks,
    currentTime,
    duration,
    videoRef,
    dispatch,
    setCurrentTime,
  } = useVideoContext();

  const [isInteracting, setIsInteracting] = useState(false);
  const timelineRef = useRef(null);

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
    dispatch(setCurrentTime(newTime));
  };

  const startDragging = () => {
    setIsInteracting(true);
    window.addEventListener("mousemove", handlePlayheadDrag);
    window.addEventListener("mouseup", stopDragging);
  };

  const stopDragging = () => {
    setTimeout(() => setIsInteracting(false), 10);
    window.removeEventListener("mousemove", handlePlayheadDrag);
    window.removeEventListener("mouseup", stopDragging);
  };

  const handleAddZoom = (event) => {
    if (isInteracting) return;

    const blockSize = duration / 10;

    event.stopPropagation();
    const timeline = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - timeline.left;
    const startTime = (clickX / timeline.width) * duration;

    if (isPreview) {
      if (videoRef?.current) {
        videoRef.current.currentTime = startTime;
      }
      return dispatch(setCurrentTime(startTime));
    }

    const newZoomBlock = {
      id: Math.floor(Math.random() * 100000),
      startTime: Math.round(startTime),
      endTime: Math.round(Math.min(startTime + blockSize, duration)),
      x: 0,
      y: 0,
      scaleFactor: 2,
    };

    const overlappingBlock = zoomBlocks.find(
      (block) =>
        (startTime >= block.startTime && startTime < block.endTime) ||
        (startTime + blockSize > block.startTime &&
          startTime + blockSize <= block.endTime)
    );

    if (overlappingBlock) {
      console.log("Already exists or overlaps with an existing block.");
      return;
    }

    const insertIndex = zoomBlocks.findIndex(
      (block) => block.startTime > newZoomBlock.startTime
    );

    const updatedZoomBlocks =
      insertIndex === -1
        ? [...zoomBlocks, newZoomBlock]
        : [
            ...zoomBlocks.slice(0, insertIndex),
            newZoomBlock,
            ...zoomBlocks.slice(insertIndex),
          ];

    dispatch(setZoomBlocks(updatedZoomBlocks));
  };

  return (
    <div className={twMerge("w-full mt-4 h-16 relative")}>
      <div
        ref={timelineRef}
        className={twMerge(
          "w-full h-full relative rounded-md border border-gray200 transition-all cursor-pointer",
          isPreview && "h-2"
        )}
        onClick={handleAddZoom}
      >
        {!isPreview &&
          [...Array(11)].map((_, i) => (
            <div
              className="absolute flex select-none bottom-0 h-[12px] w-[1px] bg-gray-600"
              key={i}
              style={{
                left: `${(i / 10) * 95 + 1}%`,
              }}
            >
              <span className="text-[8px] ml-[6px] text-white">
                {formatTime((duration * i) / 11)}
              </span>
            </div>
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
            className={twMerge(
              "absolute top-[-6px] left-1/2 w-[12px] h-[12px] bg-accentColor rounded-full cursor-pointer transform -translate-x-1/2",
              isPreview && "top-[-3px]"
            )}
            style={{
              cursor: "grab",
            }}
          ></div>
        </div>
        {!isPreview &&
          zoomBlocks &&
          zoomBlocks.map((block, i) => {
            const blockWidth =
              ((block.endTime - block.startTime) / duration) * 100;
            const blockLeft = (block.startTime / duration) * 100;
            return (
              <ZoomBlockHandle
                key={block.id}
                blockWidth={blockWidth}
                setOpenBlockEditor={setOpenBlockEditor}
                blockLeft={blockLeft}
                timelineRef={timelineRef}
                i={i}
                block={block}
                setIsInteracting={setIsInteracting}
              />
            );
          })}
      </div>
    </div>
  );
}
