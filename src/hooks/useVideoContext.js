import React, { createContext, useContext, useReducer, useRef } from "react";

const initialState = {
  videoFile: null,
  videoURL: "",
  zoomBlocks: [],
  duration: 0,
  currentTime: 0,
  isPlaying: false,
};

export const VideoActionTypes = {
  SET_VIDEO_FILE: "SET_VIDEO_FILE",
  SET_VIDEO_URL: "SET_VIDEO_URL",
  SET_ZOOM_BLOCKS: "SET_ZOOM_BLOCKS",
  SET_DURATION: "SET_DURATION",
  SET_CURRENT_TIME: "SET_CURRENT_TIME",
  SET_IS_PLAYING: "SET_IS_PLAYING",
};

export const VideoActions = {
    setVideoFile: (file) => ({ type: VideoActionTypes.SET_VIDEO_FILE, payload: file }),
    setVideoURL: (url) => ({ type: VideoActionTypes.SET_VIDEO_URL, payload: url }),
    setZoomBlocks: (blocks) => ({ type: VideoActionTypes.SET_ZOOM_BLOCKS, payload: blocks }),
    setDuration: (duration) => ({ type: VideoActionTypes.SET_DURATION, payload: duration }),
    setCurrentTime: (time) => ({ type: VideoActionTypes.SET_CURRENT_TIME, payload: time }),
    setIsPlaying: (isPlaying) => ({ type: VideoActionTypes.SET_IS_PLAYING, payload: isPlaying }),
  };
  
  const videoReducer = (state, action) => {
    switch (action.type) {
      case VideoActionTypes.SET_VIDEO_FILE:
        return { ...state, videoFile: action.payload };
      case VideoActionTypes.SET_VIDEO_URL:
        return { ...state, videoURL: action.payload };
      case VideoActionTypes.SET_ZOOM_BLOCKS:
        return { ...state, zoomBlocks: action.payload };
      case VideoActionTypes.SET_DURATION:
        return { ...state, duration: action.payload };
      case VideoActionTypes.SET_CURRENT_TIME:
        return { ...state, currentTime: action.payload };
      case VideoActionTypes.SET_IS_PLAYING:
        return { ...state, isPlaying: action.payload };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };
  
  export const VideoContext = createContext();

  export const useVideoContext = () => {
    return useContext(VideoContext);
  }
  
  export const VideoProvider = ({ children }) => {
    const [state, dispatch] = useReducer(videoReducer, initialState);
    const videoRef = useRef(null);
  
    return (
      <VideoContext.Provider value={{ videoRef, ...state, dispatch, ...VideoActions }}>
        {children}
      </VideoContext.Provider>
    );
  };
  