"use client"

import { PlayCircle } from "lucide-react";
import { playAudio } from "@/lib/tts";

interface AudioPlayerProps {
  text: string;
}

export function AudioPlayer({ text }: AudioPlayerProps) {
  return (
    <button
      onClick={() => playAudio(text)}
      className="text-blue-500 hover:text-blue-700 transition flex items-center gap-2 font-medium"
      title="Listen"
      aria-label="Play audio"
    >
      <PlayCircle size={28} />
    </button>
  );
}
