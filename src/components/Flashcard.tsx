"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AudioPlayer } from "./AudioPlayer"
import { RefreshCcw } from "lucide-react"

interface FlashcardProps {
  frontText: string
  backText: string
  onNext: () => void
}

export function Flashcard({ frontText, backText, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      <div 
        className="relative w-full h-[300px] cursor-pointer" 
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="w-full h-full relative"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 w-full h-full bg-white border-2 border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 shadow-md"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{frontText}</h2>
            <div onClick={(e) => e.stopPropagation()}>
               <AudioPlayer text={frontText} />
            </div>
            <p className="absolute bottom-6 text-gray-400 text-sm flex items-center gap-1 font-medium">
               <RefreshCcw size={14} /> Toque para virar
            </p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 w-full h-full bg-blue-50 border-2 border-blue-200 text-blue-900 rounded-3xl flex flex-col items-center justify-center p-6 shadow-md"
            style={{ 
              backfaceVisibility: "hidden", 
              transform: "rotateY(180deg)" 
            }}
          >
            <h2 className="text-4xl font-bold">{backText}</h2>
          </div>
        </motion.div>
      </div>

      <button
        onClick={onNext}
        className="mt-8 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xl py-4 rounded-2xl transition-all shadow-[0_4px_0_0_#2563eb] active:shadow-[0_0px_0_0_#2563eb] active:translate-y-1"
      >
        Continuar
      </button>
    </div>
  )
}
