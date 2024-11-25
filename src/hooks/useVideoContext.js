import React, { createContext, useState, useContext } from "react";
const VideoContext = createContext();

export const useVideoContext = () => {
  return useContext(VideoContext);
};

export const VideoProvider = ({ children }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [zoomBlocks, setZoomBlocks] = useState([]);

  return (
    <VideoContext.Provider
      value={{
        videoFile,
        setVideoFile,
        videoURL,
        setVideoURL,
        zoomBlocks,
        setZoomBlocks,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
