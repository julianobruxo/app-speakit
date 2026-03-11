"use client"

import { useState } from "react"
import { Mic, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { checkPronunciation } from "@/lib/speechRecognition"
import { AudioPlayer } from "./AudioPlayer"
import { motion } from "framer-motion"

interface PronunciationRecorderProps {
  expectedText: string
  onSuccess?: () => void
}

export function PronunciationRecorder({ expectedText, onSuccess }: PronunciationRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [result, setResult] = useState<{ score: number, recognizedText: string } | null>(null)

  const handleStartRecording = () => {
    setIsRecording(true)
    setResult(null)
    
    checkPronunciation(expectedText, (score, recognizedText) => {
      setIsRecording(false)
      setResult({ score, recognizedText })
      
      if (score > 80 && onSuccess) {
        setTimeout(() => onSuccess(), 1500)
      }
    })
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 p-6 bg-white border-2 border-gray-100 rounded-3xl shadow-sm">
      <div className="text-center mb-4">
        <p className="text-gray-500 font-medium text-sm mb-2">PRATIQUE A PRONÚNCIA</p>
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">{expectedText}</h2>
          <AudioPlayer text={expectedText} />
        </div>
      </div>

      <div className="relative">
        {isRecording && (
          <motion.div 
            className="absolute inset-0 bg-red-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className={`relative z-10 p-6 rounded-full transition-all flex items-center justify-center ${
            isRecording 
              ? "bg-red-500 text-white" 
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          <Mic size={48} />
        </button>
      </div>
      
      <p className="text-gray-500 font-medium">
        {isRecording ? "Ouvindo..." : "Toque para falar"}
      </p>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full p-4 rounded-xl flex flex-col items-center border-2 ${
            result.score > 80 
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-orange-50 border-orange-200 text-orange-800"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-lg mb-2">
            {result.score > 80 ? (
              <><CheckCircle className="text-green-500" /> Ótimo trabalho!</>
            ) : (
              <><XCircle className="text-orange-500" /> Quase lá!</>
            )}
          </div>
          <p className="text-sm opacity-80 mb-2">Você disse: "{result.recognizedText || '...'}"</p>
          
          {result.score <= 80 && (
            <button 
              onClick={() => setResult(null)} 
              className="mt-2 text-sm font-bold flex items-center gap-1 opacity-80 hover:opacity-100"
            >
              <RotateCcw size={14} /> Tentar Novamente
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
