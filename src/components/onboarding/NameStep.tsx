"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface NameStepProps {
  onNext: (name: string) => void
  onBack: () => void
}

export function NameStep({ onNext, onBack }: NameStepProps) {
  const [name, setName] = useState("")
  const trimmed = name.trim()

  return (
    <motion.div
      className="flex flex-col gap-8"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-4xl shadow-xl shadow-purple-300/40">
          👤
        </div>
      </div>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Qual é o seu nome?
        </h2>
        <p className="text-gray-500 text-base">
          Vamos personalizar sua jornada.
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Digite seu nome..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && trimmed.length >= 2) onNext(trimmed)
          }}
          autoFocus
          maxLength={32}
          className="
            w-full px-5 py-4 text-xl font-semibold text-gray-800
            bg-white border-2 border-gray-200 rounded-2xl
            placeholder-gray-300 outline-none
            focus:border-purple-400 focus:ring-4 focus:ring-purple-100
            transition-all
          "
        />
        {/* Character hint */}
        {name.length > 0 && name.length < 2 && (
          <p className="absolute -bottom-6 left-1 text-xs text-red-400 font-medium">
            Precisa de pelo menos 2 caracteres
          </p>
        )}
      </div>

      {/* Preview greeting */}
      {trimmed.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-50 border border-purple-200 rounded-2xl px-5 py-3 text-center"
        >
          <p className="text-purple-700 font-bold text-lg">
            👋 Hello, {trimmed}!
          </p>
          <p className="text-purple-500 text-sm">Nice to meet you!</p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="
            flex-none px-5 py-4 rounded-2xl border-2 border-gray-200
            text-gray-500 font-bold text-base
            hover:bg-gray-50 transition-all
          "
        >
          ← Voltar
        </button>
        <button
          onClick={() => { if (trimmed.length >= 2) onNext(trimmed) }}
          disabled={trimmed.length < 2}
          className="
            flex-1 py-4 rounded-2xl
            bg-gradient-to-r from-violet-500 to-purple-600
            text-white font-bold text-xl
            shadow-[0_6px_0_0_#6d28d9]
            hover:shadow-[0_3px_0_0_#6d28d9] hover:translate-y-0.5
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
