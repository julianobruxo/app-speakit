"use client"

import { useState } from "react"
import { Play, Mic, Check } from "lucide-react"
import { playAudio } from "@/lib/tts"
import { checkPronunciation } from "@/lib/speechRecognition"

export interface DialogueLine {
  speaker: "A" | "B"
  text: string
  translation?: string
}

interface DialoguePracticeProps {
  title: string
  lines: DialogueLine[]
  onComplete: () => void
}

export function DialoguePractice({ title, lines, onComplete }: DialoguePracticeProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [completedLines, setCompletedLines] = useState<Set<number>>(new Set())
  const [isRecording, setIsRecording] = useState(false)
  const [feedback, setFeedback] = useState<{ index: number; ok: boolean } | null>(null)

  const handleListen = (index: number, text: string) => {
    setActiveIndex(index)
    playAudio(text)
  }

  const handleSpeak = (index: number, text: string) => {
    setActiveIndex(index)
    setIsRecording(true)
    setFeedback(null)

    checkPronunciation(text, (score) => {
      setIsRecording(false)
      const ok = score >= 60
      setFeedback({ index, ok })
      if (ok) {
        setCompletedLines(prev => new Set(prev).add(index))
      }
      // Clear feedback after 2s
      setTimeout(() => setFeedback(null), 2000)
    })
  }

  const allCompleted = completedLines.size === lines.length

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">{title}</h2>

      <div className="w-full flex flex-col gap-4 mb-8">
        {lines.map((line, idx) => {
          const isActive = activeIndex === idx
          const isCompleted = completedLines.has(idx)
          const isA = line.speaker === "A"

          return (
            <div 
              key={idx} 
              className={`flex w-full ${isA ? "justify-start" : "justify-end"}`}
            >
              <div 
                className={`max-w-[80%] p-5 rounded-3xl relative border-2 transition-all ${
                  isA ? "bg-white border-gray-200 rounded-bl-none" : "bg-blue-50 border-blue-200 rounded-br-none text-blue-900"
                } ${isActive ? (isRecording ? "border-red-400 ring-2 ring-red-100" : "border-blue-400 ring-2 ring-blue-100") : ""}`}
              >
                <div className="font-bold text-sm mb-1 opacity-50 flex items-center justify-between">
                  <span>Personagem {line.speaker}</span>
                  {isCompleted && <Check size={16} className="text-green-500" />}
                </div>
                <p className="text-lg font-medium">{line.text}</p>
                {line.translation && <p className="text-sm opacity-60 mt-1">{line.translation}</p>}
                
                <div className="flex gap-2 mt-4 pt-3 border-t border-black/5">
                  <button 
                    onClick={() => handleListen(idx, line.text)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-black/5 hover:bg-black/10 rounded-xl font-bold text-sm transition"
                  >
                    <Play size={16} /> Ouvir
                  </button>
                  <button 
                    onClick={() => handleSpeak(idx, line.text)}
                    disabled={isRecording}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition ${
                       isRecording && isActive ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-100/50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <Mic size={16} /> {isRecording && isActive ? "Ouvindo..." : "Falar"}
                  </button>
                </div>
                {feedback?.index === idx && (
                  <p className={`text-xs font-bold mt-2 text-center ${feedback.ok ? "text-green-600" : "text-red-500"}`}>
                    {feedback.ok ? "✅ Ótimo!" : "❌ Tente novamente"}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={onComplete}
        disabled={!allCompleted}
        className={`w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xl py-4 rounded-2xl transition-all shadow-[0_4px_0_0_#2563eb] active:shadow-[0_0px_0_0_#2563eb] active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-1`}
      >
        {allCompleted ? "Continuar" : "Complete todos para avançar"}
      </button>
    </div>
  )
}
