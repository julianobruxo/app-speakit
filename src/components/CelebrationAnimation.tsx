"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import { Trophy, Star } from "lucide-react"

interface CelebrationAnimationProps {
  onContinue: () => void
  nextLessonLabel?: string
  isLastLesson?: boolean
}

export function CelebrationAnimation({
  onContinue,
  nextLessonLabel = "Continuar",
  isLastLesson = false,
}: CelebrationAnimationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)

      const duration = 3 * 1000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6 border-4 border-yellow-300"
      >
        <Trophy size={64} className="text-yellow-500" />
      </motion.div>

      <h2 className="text-4xl font-extrabold text-blue-900 mb-2">
        {isLastLesson ? "🎉 Block 1 Completo!" : "Parabéns!"}
      </h2>
      <p className="text-xl text-gray-600 mb-2 font-medium">
        {isLastLesson
          ? "You finished all lessons in this block!"
          : "Lição concluída com sucesso!"}
      </p>

      {/* XP badge */}
      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded-full mb-8 text-sm border border-yellow-300">
        <Star size={16} fill="currentColor" />
        +10 XP ganhos
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-xs bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-xl py-4 rounded-2xl transition-all shadow-[0_4px_0_0_#16a34a] active:shadow-[0_0px_0_0_#16a34a] active:translate-y-1"
      >
        {nextLessonLabel}
      </button>
    </motion.div>
  )
}
