"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
}

export const MusicPlayer = ({ src }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // 0번째 playlist의 정적경로 삽입.
    // audioRef.current!.src = src;

    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        clearTimeout(delay);
      } catch (error) {}
    };

    // Simulate user interaction by waiting for a short time
    const delay = setInterval(() => {
      playAudio();
    }, 1000);

    return () => clearTimeout(delay);
  }, [src]);

  return (
    <>
      <audio autoPlay loop ref={audioRef}>
        <source src={""} type={"audio/mp3"} />
      </audio>
    </>
  );
};
