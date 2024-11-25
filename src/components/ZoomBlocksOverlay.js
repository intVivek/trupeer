import { useVideoContext } from "@/hooks/useVideoContext";

export default function ZoomBlocksOverlay() {
  const { zoomBlocks, currentTime } = useVideoContext();

  return (
    <>
      {zoomBlocks && zoomBlocks?.map((block) => {
        const isActive =
          currentTime >= block.startTime && currentTime <= block.endTime;
        return (
          isActive && (
            <div
              key={block.id}
              className="absolute z-10 border-2 border-accentColor rounded-md pointer-events-none"
              style={{
                top: `${block.y}px`,
                left: `${block.x}px`,
                width: `${600 / block.scaleFactor}px`,
                height: `${320 / block.scaleFactor}px`,
                transition: "opacity 0.3s ease-in-out",
              }}
            ></div>
          )
        );
      })}
    </>
  );
}
