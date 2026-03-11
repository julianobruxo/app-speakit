"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { LearningGoal } from "./types"

interface GoalStepProps {
  onNext: (goal: LearningGoal) => void
  onBack: () => void
  name: string
}

const GOALS: { id: LearningGoal; icon: string; label: string; desc: string; color: string }[] = [
  {
    id: "travel",
    icon: "✈️",
    label: "Travel",
    desc: "Viajar para países de língua inglesa",
    color: "from-sky-400 to-cyan-500",
  },
  {
    id: "work",
    icon: "💼",
    label: "Work",
    desc: "Avançar na carreira e negócios",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "school",
    icon: "📚",
    label: "School",
    desc: "Estudar em escola ou universidade",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "fun",
    icon: "🎮",
    label: "Fun",
    desc: "Filmes, músicas, jogos e cultura",
    color: "from-pink-500 to-rose-600",
  },
]

export function GoalStep({ onNext, onBack, name }: GoalStepProps) {
  const [selected, setSelected] = useState<LearningGoal | null>(null)

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      {/* Heading */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Por que aprender inglês, {name.split(" ")[0]}?
        </h2>
        <p className="text-gray-500 text-base">
          Escolha seu objetivo principal.
        </p>
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-2 gap-3">
        {GOALS.map((goal, i) => {
          const isSelected = selected === goal.id
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(goal.id)}
              className={`
                relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2
                text-center font-semibold transition-all
                ${isSelected
                  ? `bg-gradient-to-br ${goal.color} border-transparent text-white shadow-lg scale-[1.03]`
                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50"
                }
              `}
            >
              <span className="text-3xl">{goal.icon}</span>
              <span className={`text-base font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                {goal.label}
              </span>
              <span className={`text-xs leading-tight ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                {goal.desc}
              </span>
              {isSelected && (
                <motion.div
                  layoutId="goal-check"
                  className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                >
                  <span className="text-xs text-green-600 font-black">✓</span>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-none px-5 py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all"
        >
          ← Voltar
        </button>
        <button
          onClick={() => { if (selected) onNext(selected) }}
          disabled={!selected}
          className="
            flex-1 py-4 rounded-2xl
            bg-gradient-to-r from-blue-500 to-indigo-600
            text-white font-bold text-xl
            shadow-[0_6px_0_0_#3730a3]
            hover:shadow-[0_3px_0_0_#3730a3] hover:translate-y-0.5
            active:shadow-none active:translate-y-1
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0
            transition-all
          "
        >
          Continuar →
        </button>
      </div>
    </motion.div>
  )
}
