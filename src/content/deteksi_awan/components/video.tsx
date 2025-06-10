'use client';
import { useRef, useState, useEffect } from 'react';
import getVideoUrl from '@/utils/satelite'; 

type Props = {
  onClose: () => void;
  refreshTrigger: number;
};

export default function Video({ onClose, refreshTrigger }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoUrl, setVideoUrl] = useState(getVideoUrl());

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Refresh video URL when refreshTrigger changes
  useEffect(() => {
    setVideoUrl(getVideoUrl());
  }, [refreshTrigger]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="relative bg-white rounded-xl p-6 w-[90%] max-w-xl shadow-xl">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-pink-600 hover:text-pink-800"
        >
          ❌
        </button>

        <div className="flex flex-col items-center gap-4 mt-6">
          {/* Video Player */}
          <video
            ref={videoRef}
            src={videoUrl}
            className="rounded w-full max-w-[500px] mx-auto"
            autoPlay
            loop
            muted
          />

          <button
            onClick={togglePlay}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
}
