"use client"

import { motion } from "framer-motion"

interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center gap-8 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo / hero */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 18 }}
        className="relative"
      >
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-400/40">
          <span className="text-5xl">🇧🇷</span>
        </div>
        {/* Orbiting star */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2"
        >
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-md text-base">
            ⭐
          </div>
        </motion.div>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Welcome to SpeakIT
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
          Learn English naturally.<br />One lesson at a time.
        </p>
      </motion.div>

      {/* Feature badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {[
          { icon: "🗺️", label: "Journey Map" },
          { icon: "🤖", label: "AI Tutor" },
          { icon: "🎙️", label: "Speaking" },
          { icon: "🏆", label: "XP & Rewards" },
        ].map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
          >
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="
          w-full max-w-xs py-4 rounded-2xl
          bg-gradient-to-r from-blue-500 to-indigo-600
          text-white font-bold text-xl
          shadow-[0_6px_0_0_#3730a3]
          hover:shadow-[0_3px_0_0_#3730a3] hover:translate-y-0.5
          active:shadow-none active:translate-y-1
          transition-all
        "
      >
        Vamos começar! 🚀
      </motion.button>

      <p className="text-xs text-gray-400 font-medium">
        Grátis · Sem conta necessária
      </p>
    </motion.div>
  )
}
