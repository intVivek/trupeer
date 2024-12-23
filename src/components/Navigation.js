import { useVideoContext } from "@/hooks/useVideoContext";
import formatTime from "@/util/formatTime";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";


export default function Navigation({ openPreview, setOpenPreview }) {
  const { videoRef, setCurrentTime, isPlaying, setIsPlaying, currentTime, duration, dispatch } =
    useVideoContext();

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      dispatch(setIsPlaying(!isPlaying));
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
      videoRef.current.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    }
  };

  const handleBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(0, videoRef.current.currentTime - 10);
      videoRef.current.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    }
  };

  return (
    <div className="relative w-full my-4 flex justify-center gap-2 items-center">
      <div className="absolute left-0 select-none text-white text-xs">
        <span>{formatTime(currentTime)}</span> /{" "}
        <span>{formatTime(duration)}</span>
      </div>
      <div
        className="rounded-full cursor-pointer w-8 h-8 flex justify-center items-center bg-gray-950 text-white"
        onClick={handleBackward}
      >
        <FaBackward size={12} />
      </div>
      <div
        className="rounded-full cursor-pointer w-8 h-8 flex justify-center items-center bg-gray-950 text-white"
        onClick={togglePlayPause}
      >
        {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
      </div>
      <div
        className="rounded-full cursor-pointer w-8 h-8 flex justify-center items-center bg-gray-950 text-white"
        onClick={handleForward}
      >
        <FaForward size={12} />
      </div>
      <div
        className="absolute right-0 rounded-md select-none cursor-pointer text-sm font-medium p-2 flex justify-center items-center bg-gray-950 text-white"
        onClick={() => setOpenPreview((p) => !p)}
      >
        {openPreview ? "Edit" : "Preview"}
      </div>
    </div>
  );
}
