"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Lock } from "lucide-react"
import Link from "next/link"
import type { JourneyNode } from "./types"

interface MapNodeProps {
  node: JourneyNode
  index: number
  isPlayerHere: boolean
}

const STATUS_STYLES = {
  completed: {
    ring: "ring-4 ring-green-400 ring-offset-2",
    bg: "bg-gradient-to-br from-green-400 to-emerald-500",
    shadow: "shadow-[0_6px_0_0_#059669]",
    label: "text-green-700 font-bold",
  },
  current: {
    ring: "ring-4 ring-blue-400 ring-offset-2 ring-offset-sky-50",
    bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    shadow: "shadow-[0_6px_0_0_#3730a3]",
    label: "text-blue-700 font-bold",
  },
  locked: {
    ring: "ring-2 ring-gray-200 ring-offset-1",
    bg: "bg-gradient-to-br from-gray-200 to-gray-300",
    shadow: "shadow-[0_4px_0_0_#9ca3af]",
    label: "text-gray-400 font-medium",
  },
}

export function MapNodeBubble({ node, index, isPlayerHere }: MapNodeProps) {
  const styles = STATUS_STYLES[node.status]
  const isLocked = node.status === "locked"

  const bubble = (
    <motion.div
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={isLocked ? {} : { scale: 1.1 }}
      whileTap={isLocked ? {} : { scale: 0.95 }}
    >
      {/* Pulse ring for current node */}
      {node.status === "current" && !isPlayerHere && (
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-blue-400/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Main bubble */}
      <div
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          text-2xl select-none transition-transform
          ${styles.bg} ${styles.ring} ${styles.shadow}
          ${isLocked ? "opacity-50 grayscale" : ""}
        `}
      >
        {isLocked ? (
          <Lock size={22} className="text-gray-400" />
        ) : node.status === "completed" ? (
          <>
            <span className="absolute text-xl">{node.icon}</span>
            <CheckCircle2
              size={18}
              className="absolute -bottom-1 -right-1 text-white bg-green-500 rounded-full"
            />
          </>
        ) : (
          <span className="text-2xl">{node.icon}</span>
        )}
      </div>

      {/* Label */}
      <span
        className={`
          text-xs text-center max-w-[80px] leading-tight
          ${styles.label}
          ${isLocked ? "opacity-50" : ""}
        `}
      >
        {node.title}
      </span>

      {/* XP badge on completed */}
      {node.status === "completed" && (
        <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-300">
          ✅ Done
        </span>
      )}

      {/* Locked badge */}
      {isLocked && (
        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          bloqueado
        </span>
      )}
    </motion.div>
  )

  if (isLocked) return <div className="relative">{bubble}</div>

  return (
    <Link href={`/lesson/${node.lessons[0]}`} className="relative block">
      {bubble}
    </Link>
  )
}
