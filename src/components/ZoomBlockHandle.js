import { useVideoContext } from "@/hooks/useVideoContext";
import { MdOutlineDragHandle } from "react-icons/md";

export default function ZoomBlockHandle({
  blockLeft,
  blockWidth,
  setOpenBlockEditor,
  block,
  setIsInteracting,
  timelineRef,
  i,
}) {
  const { zoomBlocks, setZoomBlocks, duration, dispatch } = useVideoContext();

  const handleResizeLeft = (event, block, i) => {
    event.preventDefault();
    event.stopPropagation();
    setIsInteracting(true);

    const initialMouseX = event.clientX;
    const initialStartTime = block.startTime;
    const initialEndTime = block.endTime;

    const onMouseMove = (e) => {
      e.stopPropagation();

      const deltaX = initialMouseX - e.clientX;

      let newStartTime = initialStartTime - (deltaX * duration) / 600;

      newStartTime = Math.min(
        Math.max(zoomBlocks[i - 1]?.endTime || 0, newStartTime),
        initialEndTime + 5
      );

      dispatch(
        setZoomBlocks(
          zoomBlocks.map((b, index) =>
            index === i ? { ...b, startTime: newStartTime } : b
          )
        )
      );
    };

    const onMouseUp = () => {
      setTimeout(() => setIsInteracting(false), 10);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleResizeRight = (event, block, i) => {
    event.preventDefault();
    event.stopPropagation();
    setIsInteracting(true);

    const initialMouseX = event.clientX;
    const initialStartTime = block.startTime;
    const initialEndTime = block.endTime;

    const onMouseMove = (e) => {
      e.preventDefault();
      const deltaX = e.clientX - initialMouseX;

      let newEndTime = initialEndTime + (deltaX * duration) / 600;

      newEndTime = Math.max(
        Math.min(zoomBlocks[i + 1]?.startTime || duration, newEndTime),
        initialStartTime + 5
      );

      dispatch(
        setZoomBlocks(
          zoomBlocks.map((b, index) =>
            index === i ? { ...b, endTime: newEndTime } : b
          )
        )
      );
    };

    const onMouseUp = () => {
      setTimeout(() => setIsInteracting(false), 10);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleZoomBlockDrag = (event, block, i) => {
    event.preventDefault();
    event.stopPropagation();
    setTimeout(() => setIsInteracting(true), 20);
    const timeline = timelineRef?.current.getBoundingClientRect();

    if (!timeline) return;

    const initialMouseX = event.clientX;
    const initialStartTime = block.startTime;
    const blockDuration = block.endTime - block.startTime;

    var isDragging=false;

    const onMouseMove = (e) => {
      const deltaX = e.clientX - initialMouseX;

      if (Math.abs(deltaX) > 5) {
        isDragging = true;
        setIsInteracting(true);
        let newStartTime = Math.min(
          Math.max(
            initialStartTime + (deltaX / timeline.width) * duration,
            zoomBlocks[i - 1]?.endTime || 0
          ),
          zoomBlocks[i + 1]?.startTime - blockDuration ||
            duration - blockDuration
        );
        let newEndTime = newStartTime + blockDuration;

        dispatch(
          setZoomBlocks(
            zoomBlocks.map((b, index) =>
              index === i
                ? { ...b, startTime: newStartTime, endTime: newEndTime }
                : b
            )
          )
        );
      }
    };

    const onMouseUp = (e) => {
      e.stopPropagation();
      setTimeout(() => {
        setIsInteracting(false);
      }, 10);

      if (!isDragging) {
        setOpenBlockEditor(block.id);
      }

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className="absolute flex h-full bg-transparentAccent border overflow-hidden border-accentColor rounded-md"
      style={{
        left: `${blockLeft}%`,
        width: `${blockWidth}%`,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-3 h-full grid place-items-center bg-accentColor200 cursor-ew-resize"
        onMouseDown={(e) => handleResizeLeft(e, block, i)}
        onClick={(e) => e.stopPropagation()}
      >
        <MdOutlineDragHandle className="text-white -translate-x-[2px]  rotate-90" />
      </div>
      <div
        className="flex-1 h-full "
        onMouseDown={(e) => handleZoomBlockDrag(e, block, i)}
      ></div>
      <div
        className="w-3 h-full flex-shrink-0 grid place-items-center bg-accentColor200 cursor-ew-resize"
        onMouseDown={(e) => handleResizeRight(e, block, i)}
        onClick={(e) => e.stopPropagation()}
      >
        <MdOutlineDragHandle className="text-white -translate-x-[2px]  rotate-90" />
      </div>
    </div>
  );
}
