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

  const {
    videoRef,
    videoFile,
    dispatch,
    setVideoFile,
    setIsPlaying,
    setVideoURL,
    resetState,
  } = useVideoContext();

  const handleFileChange = (file) => {
    dispatch(resetState());
    dispatch(setVideoFile(file));
    dispatch(setVideoURL(URL.createObjectURL(file)));
  };

  useEffect(() => {
    if (openBlockEditor) {
      dispatch(setIsPlaying(false));
      videoRef.current.pause();
    }
  }, [openBlockEditor]);

  const handleCloseSidebar = () => {
    setOpenBlockEditor(null);
    dispatch(setIsPlaying(true));
    videoRef.current.play();
  };

  return (
    <div className="relative w-full flex items-center justify-between overflow-hidden h-full">
      <div className="w-full flex items-center flex-col justify-center">
        <div className="w-max max-w-[90%] h-max min-w-[800px] m-4">
          <FileUpload onChange={handleFileChange} file={videoFile} />
          {videoFile && (
            <>
              <VideoPlayer
                isPreview={openPreview}
                setOpenBlockEditor={setOpenBlockEditor}
              />
              <Navigation
                openPreview={openPreview}
                setOpenPreview={setOpenPreview}
              />
              <Timeline
                setOpenBlockEditor={setOpenBlockEditor}
                isPreview={openPreview}
              />
            </>
          )}
        </div>
      </div>
      {openBlockEditor && (
        <BlockEditor id={openBlockEditor} onClose={handleCloseSidebar} />
      )}
    </div>
  );
}
