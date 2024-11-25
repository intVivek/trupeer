"use client"

import { useState } from "react";
import FileUpload from "./FileUpload";

export default function Editor() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");

  const handleFileChange = (file) => {
    if (file) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  return (
    <div className="">
      <FileUpload onChange={handleFileChange}/>
      {videoURL}
    </div>
  );
}
