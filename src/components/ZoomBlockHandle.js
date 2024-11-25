import { useVideoContext } from "@/hooks/useVideoContext";
import { MdOutlineDragHandle } from "react-icons/md";

export default function ZoomBlockHandle({
  blockLeft,
  blockWidth,
  setIsResizing,
  setOpenBlockEditor,
  block,
  duration,
  i
}) {

    const { zoomBlocks, setZoomBlocks } = useVideoContext();
    
  const handleResizeLeft = (event, block, i) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);

    const initialMouseX = event.clientX;
    const initialStartTime = block.startTime;

    const onMouseMove = (e) => {
      e.stopPropagation();

      const deltaX = initialMouseX - e.clientX;

      let newStartTime = initialStartTime - deltaX / 4.5;

      newStartTime = Math.max(0, newStartTime);

      const overlappingBlock = zoomBlocks.find(
        (b, index) =>
          index !== i && newStartTime < b.endTime && newStartTime >= b.startTime
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

      let newEndTime = initialEndTime + deltaX / 4.5;

      newEndTime = Math.min(duration, newEndTime);

      const overlappingBlock = zoomBlocks.find(
        (b, index) =>
          index !== i && newEndTime > b.startTime && newEndTime <= b.endTime
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
      className="absolute flex h-full bg-transparentYellow border overflow-hidden border-yellow-500 rounded-md"
      style={{
        left: `${blockLeft}%`,
        width: `${blockWidth}%`,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-3 h-full grid place-items-center bg-yellow-600 cursor-ew-resize"
        onMouseDown={(e) => handleResizeLeft(e, block, i)}
        onClick={(e) => e.stopPropagation()}
      >
        <MdOutlineDragHandle className="text-white -translate-x-[2px]  rotate-90" />
      </div>
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
      >
        <MdOutlineDragHandle className="text-white -translate-x-[2px]  rotate-90" />
      </div>
    </div>
  );
}
