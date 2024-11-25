"use client";
import Editor from "@/components/Editor";
import { VideoProvider } from "@/hooks/useVideoContext";

export default function Home() {
  return (
    <div className="w-screen h-screen flex items-center bg-gray900 justify-center">
      <VideoProvider>
        <Editor />
      </VideoProvider>
    </div>
  );
}
