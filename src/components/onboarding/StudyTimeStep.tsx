"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { DailyStudyTime } from "./types"

interface StudyTimeStepProps {
  onNext: (minutes: DailyStudyTime) => void
  onBack: () => void
  name: string
}

const OPTIONS: { minutes: DailyStudyTime; icon: string; label: string; desc: string; tag?: string }[] = [
  {
    minutes: 5,
    icon: "⚡",
    label: "5 minutos",
    desc: "Rápido e consistente — ideal para iniciantes",
    tag: "Recomendado",
  },
  {
    minutes: 10,
    icon: "🔥",
    label: "10 minutos",
    desc: "Ritmo sólido para progresso real",
  },
  {
    minutes: 20,
    icon: "🚀",
    label: "20 minutos",
    desc: "Para quem quer aprender mais rápido",
    tag: "Intensivo",
  },
]

export function StudyTimeStep({ onNext, onBack, name }: StudyTimeStepProps) {
  const [selected, setSelected] = useState<DailyStudyTime | null>(null)

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
          Quanto tempo por dia?
        </h2>
        <p className="text-gray-500 text-base">
          Consistência é mais importante que duração. 😊
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {OPTIONS.map((option, i) => {
          const isSelected = selected === option.minutes
          return (
            <motion.button
              key={option.minutes}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(option.minutes)}
              className={`
                relative flex items-center gap-4 p-5 rounded-2xl border-2
                text-left font-semibold transition-all
                ${isSelected
                  ? "bg-gradient-to-r from-orange-400 to-amber-500 border-transparent text-white shadow-lg shadow-orange-300/40"
                  : "bg-white border-gray-200 text-gray-700 hover:border-orange-200 hover:bg-orange-50"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
                  ${isSelected ? "bg-white/20" : "bg-orange-50"}
                `}
              >
                {option.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                    {option.label}
                  </span>
                  {option.tag && (
                    <span
                      className={`
                        text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${isSelected ? "bg-white/30 text-white" : "bg-orange-100 text-orange-600"}
                      `}
                    >
                      {option.tag}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-0.5 ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                  {option.desc}
                </p>
              </div>

              {/* Check */}
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-orange-500 font-black">✓</span>
                </div>
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
            bg-gradient-to-r from-orange-400 to-amber-500
            text-white font-bold text-xl
            shadow-[0_6px_0_0_#b45309]
            hover:shadow-[0_3px_0_0_#b45309] hover:translate-y-0.5
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
