import { useState } from "react";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";

export default function Navigation({ videoRef, setCurrentTime }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(0, videoRef.current.currentTime - 10); 
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="w-full my-4 flex justify-center gap-2 items-center">
      <div
        className="rounded-full cursor-pointer w-8 h-8 flex justify-center items-center bg-gray-950 text-white"
        onClick={handleBackward}
      >
        <FaBackward size={12}/>
      </div>
      <div
        className="rounded-full cursor-pointer w-8 h-8 flex justify-center items-center bg-gray-950 text-white"
        onClick={togglePlayPause}
      >
        {isPlaying ? <FaPause size={12}/> : <FaPlay size={12}/>}
      </div>
      <div
        className="rounded-full cursor-pointer w-8 h-8 flex justify-center items-center bg-gray-950 text-white"
        onClick={handleForward}
      >
        <FaForward size={12}/>
      </div>
    </div>
  );
}
