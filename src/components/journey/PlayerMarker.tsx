"use client"

import { motion, AnimatePresence } from "framer-motion"

interface PlayerMarkerProps {
  /** Position on the SVG canvas (percentage of container) */
  x: number
  y: number
  /** Whether to play the move animation */
  moving?: boolean
}

/**
 * PlayerMarker — the animated character that sits on the current lesson node.
 * Uses a floating bob animation when idle, and a bounce-in when first placed.
 */
export function PlayerMarker({ x, y, moving = false }: PlayerMarkerProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={`${x}-${y}`}
        className="absolute flex flex-col items-center pointer-events-none"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: "translate(-50%, -130%)",
          zIndex: 20,
        }}
        initial={{ scale: 0, y: -20, opacity: 0 }}
        animate={
          moving
            ? { scale: [1, 1.3, 1], y: [0, -12, 0], opacity: 1 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={
          moving
            ? { duration: 0.5, ease: "easeInOut" }
            : { type: "spring", stiffness: 300, damping: 18 }
        }
      >
        {/* Bob animation wrapper */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          {/* Character avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 border-4 border-white shadow-lg flex items-center justify-center text-xl">
            🧑‍🎓
          </div>

          {/* Speech bubble / label */}
          <div className="mt-1 bg-white border-2 border-blue-200 rounded-full px-2 py-0.5 shadow-sm">
            <span className="text-[10px] font-bold text-blue-600 whitespace-nowrap">
              Você está aqui
            </span>
          </div>

          {/* Tail of the speech bubble */}
          <div className="w-2 h-2 bg-white border-b-2 border-r-2 border-blue-200 rotate-45 -mt-1" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
