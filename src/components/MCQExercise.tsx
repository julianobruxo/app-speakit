"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

interface MCQExerciseProps {
  question: string
  options: string[]
  correctAnswer: string
  onSuccess: () => void
}

export function MCQExercise({ question, options, correctAnswer, onSuccess }: MCQExerciseProps) {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSelect = (option: string) => {
    if (selectedOpt !== null && isCorrect) return; // Prevent changing after correct answer
    
    setSelectedOpt(option)
    const correct = option === correctAnswer
    setIsCorrect(correct)
    
    // Auto advance after correct answer on a slight delay for feedback
    if (correct) {
      setTimeout(() => {
        onSuccess()
      }, 1500)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">{question}</h2>

      <div className="w-full flex flex-col gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedOpt === option
          
          let bgColor = "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
          let borderColor = ""
          
          if (isSelected) {
             if (isCorrect) {
                 bgColor = "bg-green-100 border-green-500 text-green-800"
             } else {
                 bgColor = "bg-red-100 border-red-500 text-red-800"
                 // Light shake animation could be added here
             }
          } else if (selectedOpt !== null && isCorrect && option === correctAnswer) {
              // Highlight the correct one if they picked wrong originally (Wait, Duolingo usually forces you to pick right eventually)
              bgColor = "bg-green-100 border-green-500 text-green-800 opacity-50"
          } else if (selectedOpt !== null && isCorrect) {
              bgColor = "bg-white border-gray-200 text-gray-400 opacity-50" // Fade out others when correct
          }

          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option)}
              className={`w-full p-4 rounded-2xl border-2 text-lg font-medium transition-colors text-left flex justify-between items-center ${bgColor}`}
            >
              {option}
              {isSelected && isCorrect && <Check className="text-green-600" />}
              {isSelected && !isCorrect && <X className="text-red-600" />}
            </motion.button>
          )
        })}
      </div>
      
      {isCorrect === true && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 bg-green-100 text-green-800 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
             <Check size={24} /> Resposta Correta!
          </motion.div>
      )}
      
      {isCorrect === false && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 bg-red-100 text-red-800 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
             <X size={24} /> Tente novamente
          </motion.div>
      )}
    </div>
  )
}
