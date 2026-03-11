"use client"

import { motion } from "framer-motion"
import type { OnboardingProfile } from "./types"

interface StartJourneyStepProps {
  profile: Pick<OnboardingProfile, "name" | "goal" | "dailyStudyTime">
  onStart: () => void
}

const GOAL_LABELS: Record<string, string> = {
  travel: "Viagem ✈️",
  work: "Trabalho 💼",
  school: "Escola 📚",
  fun: "Diversão 🎮",
}

const TIME_LABELS: Record<number, string> = {
  5: "5 min / dia ⚡",
  10: "10 min / dia 🔥",
  20: "20 min / dia 🚀",
}

export function StartJourneyStep({ profile, onStart }: StartJourneyStepProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Trophy animation */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 250, damping: 16 }}
        className="relative"
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-5xl shadow-2xl shadow-yellow-300/50">
          🗺️
        </div>
        {/* Sparkles */}
        {["top-0 -left-3", "top-0 -right-3", "-bottom-2 left-1/2 -translate-x-1/2"].map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute ${pos} text-yellow-400 text-xl`}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          >
            ✨
          </motion.div>
        ))}
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-extrabold text-gray-800">
          Você est&aacute; pronto, {profile.name.split(" ")[0]}! 🎉
        </h2>
        <p className="text-gray-500 text-base">
          Sua jornada de inglês começa agora.
        </p>
      </motion.div>

      {/* Profile summary card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full bg-white border-2 border-green-200 rounded-2xl p-5 space-y-3 shadow-sm"
      >
        <h3 className="font-bold text-gray-600 text-sm uppercase tracking-wide">
          Seu Perfil
        </h3>
        {[
          { label: "Nome", value: profile.name },
          { label: "Objetivo", value: GOAL_LABELS[profile.goal] ?? profile.goal },
          { label: "Meta diária", value: TIME_LABELS[profile.dailyStudyTime] ?? `${profile.dailyStudyTime} min` },
          { label: "Nível de início", value: "A1 – Absolute Beginner 🌱" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-400 font-medium">{row.label}</span>
            <span className="text-sm font-bold text-gray-800">{row.value}</span>
          </div>
        ))}
      </motion.div>

      {/* First lesson preview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
          🏠
        </div>
        <div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Primeira Lição</p>
          <p className="font-bold text-gray-800">Home — Greetings</p>
          <p className="text-xs text-gray-500">Hello, Hi, Good morning…</p>
        </div>
        <div className="ml-auto text-lg">→</div>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="
          w-full py-5 rounded-2xl
          bg-gradient-to-r from-green-500 to-emerald-600
          text-white font-extrabold text-2xl
          shadow-[0_8px_0_0_#047857]
          hover:shadow-[0_4px_0_0_#047857] hover:translate-y-1
          active:shadow-none active:translate-y-2
          transition-all
        "
      >
        Iniciar Jornada! 🚀
      </motion.button>
    </motion.div>
  )
}
