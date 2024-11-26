import { useVideoContext } from "@/hooks/useVideoContext";
import { useRef } from "react";
import { MdOutlineDelete, MdOutlineSettings  } from "react-icons/md";

export default function ZoomBlocksOverlay({setOpenBlockEditor}) {
  const { zoomBlocks, setZoomBlocks, currentTime, dispatch } =
    useVideoContext();
  const overlayRef = useRef(null);

  const handleZoomOverlayDrag = (event, block, i) => {
    event.preventDefault();
    event.stopPropagation();
    const overlay = overlayRef?.current.getBoundingClientRect();

    if (!overlay) return;

    const blockWidth = 600 / block.scaleFactor;
    const blockHeight = 320 / block.scaleFactor;
    let isDragging = false;

    const onMouseMove = (e) => {
      const deltaX = e.clientX - event.clientX;
      const deltaY = e.clientY - event.clientY;

      let updatedX = Math.max(block.x + deltaX, 0);
      let updatedY = Math.max(block.y + deltaY, 0);
      updatedX = Math.min(updatedX, 600 - blockWidth);
      updatedY = Math.min(updatedY, 320 - blockHeight);

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        isDragging = true;

        const updatedBlocks = zoomBlocks.map((b) =>
          b.id === block.id ? { ...b, x: updatedX, y: updatedY } : b
        );

        dispatch(setZoomBlocks(updatedBlocks));
      }
    };

    const onMouseUp = (e) => {
      e.stopPropagation();

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleDelete = (blockId) => {
    dispatch(setZoomBlocks(zoomBlocks.filter((b) => b.id !== blockId)));
  };

  return (
    <div ref={overlayRef} className="w-full absolute h-full bg-transparent">
      {zoomBlocks?.map((block, i) => {
        const isActive =
          currentTime >= block.startTime && currentTime <= block.endTime;

        return (
          isActive && (
            <div
              key={block.id}
              className="absolute z-10 border-2 group border-accentColor rounded-md cursor-move"
              style={{
                top: `${block.y}px`,
                left: `${block.x}px`,
                width: `${600 / block.scaleFactor}px`,
                height: `${320 / block.scaleFactor}px`,
                transition: "opacity 0.3s ease-in-out",
              }}
              onMouseDown={(e) => handleZoomOverlayDrag(e, block, i)}
            >
              <div className="absolute top-0 right-0 flex items-center justify-end space-x-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <MdOutlineSettings
                 size={16}
                  className="text-white p-[2px]  bg-accentColor rounded-full hover:bg-accentColor200 cursor-pointer"
                  onClick={() => setOpenBlockEditor(block.id)}
                />
                <MdOutlineDelete 
                size={16}
                  className="text-white p-[2px] bg-accentColor rounded-full hover:bg-accentColor200 cursor-pointer"
                  onClick={() => handleDelete(block.id)}
                />
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}
