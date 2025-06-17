import React, { useRef } from "react";
import Image from "next/image";

export default function BentoCard({ title, description, mediaUrl, mediaType = "image", scale = "110" }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (mediaType === "video" && videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (mediaType === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden group bg-gray-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {mediaType === "image" && mediaUrl && (
        <Image
          src={mediaUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className={`absolute transition-transform duration-500 group-hover:scale-110 scale-${scale}`}
          priority={false}
        />
      )}

      {mediaType === "video" && mediaUrl && (
        <video
          ref={videoRef}
          src={mediaUrl}
          className={`absolute w-full h-full object-cover scale-${scale}`}
          muted
          loop
          preload="metadata"
          playsInline
          controls={false}
        />
      )}

      {mediaUrl && (
        <>
          <div className="absolute inset-0 z-10 bg-black/30 transition-all group-hover:bg-black/10 scale-110" />
          <div className="absolute bottom-0 w-full h-[100%] bg-gradient-to-t scale-110 from-black via-transparent to-transparent shadow-[0_16px_40px_rgba(0,0,0,0.5)]" />
        </>
      )}

      <div className="absolute bottom-0 left-2 z-20 flex flex-col gap-1 transition-all duration-300 group-hover:translate-y-[-1.5rem] p-4">
        <div className="text-xl font-semibold text-white">{title}</div>
        <div className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </div>
      </div>
    </div>
  );
}
