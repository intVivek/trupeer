import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import VideoPlayer from "./videoPlayer";
import Timeline from "./Timeline";
import BlockEditor from "./BlockEditor";
import { useVideoContext } from "@/hooks/useVideoContext";
import Navigation from "./Navigation";

export default function Editor() {
  const [openBlockEditor, setOpenBlockEditor] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const { videoRef, videoFile, dispatch, setVideoFile, setIsPlaying, setVideoURL } = useVideoContext();

  const handleFileChange = (file) => {
    if (!file) return;
    dispatch(setVideoFile(file));
    dispatch(setVideoURL(URL.createObjectURL(file)));
  };

  useEffect(()=>{
    if(openBlockEditor){
      dispatch(setIsPlaying(false));
      videoRef.current.pause();
    }
  }, [openBlockEditor])

  const handleCloseSidebar = () => {
    setOpenBlockEditor(null)
    dispatch(setIsPlaying(true));
    videoRef.current.play();
  }

  return (
    <div className="relative w-full flex items-center justify-between h-full">
      <div className="w-full flex items-center justify-center">
        {videoFile ? (
          <div className="w-[600px] m-auto">
            <VideoPlayer
              isPreview={openPreview}
            />
            <Navigation
              openPreview={openPreview}
              setOpenPreview={setOpenPreview}
            />
            <Timeline
              setOpenBlockEditor={setOpenBlockEditor}
              isPreview={openPreview}
            />
          </div>
        ) : (
          <FileUpload onChange={handleFileChange} />
        )}
      </div>
      {openBlockEditor && (
        <BlockEditor
          id={openBlockEditor}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
}
