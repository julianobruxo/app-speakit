"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Star, Flame } from "lucide-react"
import { MapNodeBubble } from "./MapNode"
import { PathConnector } from "./PathConnector"
import { PlayerMarker } from "./PlayerMarker"
import type { JourneyNode } from "./types"

// ─── Storage keys (must match existing app) ──────────────────────────────────
const STORAGE_KEY = "speakit_completed_lessons"

// ─── Journey Map Data ─────────────────────────────────────────────────────────
/**
 * Each node represents a thematic block on the journey.
 * `lessons` contains the IDs of lessons from the existing lesson system.
 * `position` is in % of the canvas (x: left-right, y: top-bottom).
 *
 * The path winds left → right → left to create a snake/trail effect.
 */
const JOURNEY_NODES: Omit<JourneyNode, "status">[] = [
  {
    id: "greetings",
    title: "Home",
    icon: "🏠",
    lessons: ["greetings"],
    position: { x: 20, y: 88 },
    block: "Block 1",
  },
  {
    id: "vocabulary",
    title: "Meet People",
    icon: "👋",
    lessons: ["vocabulary"],
    position: { x: 50, y: 75 },
    block: "Block 1",
  },
  {
    id: "to_be",
    title: "Language",
    icon: "💬",
    lessons: ["to_be"],
    position: { x: 80, y: 62 },
    block: "Block 1",
  },
  {
    id: "asking_names",
    title: "Names",
    icon: "🪪",
    lessons: ["asking_names"],
    position: { x: 50, y: 49 },
    block: "Block 1",
  },
  {
    id: "dialogue",
    title: "City",
    icon: "🏙️",
    lessons: ["dialogue"],
    position: { x: 20, y: 36 },
    block: "Block 1",
  },
  {
    id: "ai_conversation",
    title: "Social Life",
    icon: "🤖",
    lessons: ["ai_conversation"],
    position: { x: 50, y: 20 },
    block: "Block 1",
  },
  {
    id: "finish",
    title: "Graduation",
    icon: "🎓",
    lessons: [],
    position: { x: 80, y: 8 },
    block: "Block 1",
  },
]

// ─── Helper ───────────────────────────────────────────────────────────────────
function computeNodeStatuses(
  nodes: Omit<JourneyNode, "status">[],
  completedLessons: Set<string>
): JourneyNode[] {
  let foundCurrent = false

  return nodes.map((node, i) => {
    // The finish node is special — unlocked when all real lessons are done
    if (node.id === "finish") {
      const allDone = nodes
        .filter((n) => n.id !== "finish")
        .every((n) => n.lessons.every((l) => completedLessons.has(l)))
      return { ...node, status: allDone ? "current" : "locked" }
    }

    const isCompleted = node.lessons.every((l) => completedLessons.has(l))

    if (isCompleted) {
      return { ...node, status: "completed" }
    }

    // First uncompleted node after all completed ones = current
    if (!foundCurrent) {
      // previous node must be completed (or it's the very first)
      const prevDone =
        i === 0 ||
        nodes[i - 1].lessons.every((l) => completedLessons.has(l))
      if (prevDone) {
        foundCurrent = true
        return { ...node, status: "current" }
      }
    }

    return { ...node, status: "locked" }
  })
}

// ─── Component ────────────────────────────────────────────────────────────────
export function JourneyMap() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [playerMoving, setPlayerMoving] = useState(false)
  const [prevPlayerIndex, setPrevPlayerIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })

  // ── Load completion state from localStorage ───────────────────────────────
  const loadCompleted = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: string[] = JSON.parse(saved)
        setCompleted((prev) => {
          const next = new Set(parsed)
          // Detect if player advanced to trigger movement animation
          const prevSize = prev.size
          if (prevSize > 0 && next.size > prevSize) {
            setPlayerMoving(true)
            setTimeout(() => setPlayerMoving(false), 600)
          }
          return next
        })
      }
    } catch {}
  }, [])

  useEffect(() => {
    loadCompleted()
    window.addEventListener("storage", loadCompleted)
    window.addEventListener("lessonCompleted", loadCompleted)
    return () => {
      window.removeEventListener("storage", loadCompleted)
      window.removeEventListener("lessonCompleted", loadCompleted)
    }
  }, [loadCompleted])

  // ── Canvas size observer ──────────────────────────────────────────────────
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setCanvasSize({ w: el.offsetWidth, h: el.offsetHeight })
    })
    observer.observe(el)
    setCanvasSize({ w: el.offsetWidth, h: el.offsetHeight })
    return () => observer.disconnect()
  }, [])

  // ── Compute node statuses ─────────────────────────────────────────────────
  const nodes = computeNodeStatuses(JOURNEY_NODES, completed)
  const playerNodeIndex = nodes.findLastIndex(
    (n) => n.status === "current" || n.status === "completed"
  )
  const playerNode = nodes[Math.max(0, playerNodeIndex)]

  const xp = completed.size * 10
  const completedCount = completed.size

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header stats bar ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-extrabold text-blue-900 leading-tight">
            Block 1 <span className="text-blue-500">· A1</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium">Introductions</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5">
            <Star size={14} className="text-yellow-500" fill="currentColor" />
            <span className="text-sm font-bold text-yellow-700">{xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5">
            <Flame size={14} className="text-orange-500" fill="currentColor" />
            <span className="text-sm font-bold text-orange-600">
              {completedCount}/{JOURNEY_NODES.filter((n) => n.id !== "finish").length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${Math.round(
              (completedCount /
                JOURNEY_NODES.filter((n) => n.id !== "finish").length) *
                100
            )}%`,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>

      {/* ── Journey Canvas ───────────────────────────────────────────── */}
      <motion.div
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="
          relative w-full rounded-3xl overflow-hidden
          bg-gradient-to-b from-sky-100 via-green-50 to-emerald-100
          border-2 border-green-200 shadow-inner
        "
        style={{ height: "520px" }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <span className="absolute text-4xl opacity-20" style={{ top: "5%", left: "5%" }}>☁️</span>
          <span className="absolute text-3xl opacity-20" style={{ top: "8%", right: "10%" }}>☁️</span>
          <span className="absolute text-2xl opacity-15" style={{ top: "30%", left: "8%" }}>🌳</span>
          <span className="absolute text-2xl opacity-15" style={{ top: "55%", right: "6%" }}>🌳</span>
          <span className="absolute text-xl opacity-20" style={{ bottom: "12%", left: "45%" }}>🌸</span>
          <span className="absolute text-xl opacity-20" style={{ bottom: "5%", right: "15%" }}>🌿</span>
        </div>

        {/* SVG Paths */}
        {canvasSize.w > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {nodes.slice(0, -1).map((node, i) => {
              const next = nodes[i + 1]
              const isCompleted =
                node.status === "completed" && next.status !== "locked"
              return (
                <PathConnector
                  key={`path-${node.id}`}
                  from={node.position}
                  to={next.position}
                  completed={isCompleted}
                  canvasWidth={canvasSize.w}
                  canvasHeight={canvasSize.h}
                />
              )
            })}
          </svg>
        )}

        {/* Player marker */}
        <PlayerMarker
          x={playerNode.position.x}
          y={playerNode.position.y}
          moving={playerMoving}
        />

        {/* Node bubbles */}
        {nodes.map((node, i) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: `${node.position.x}%`,
              top: `${node.position.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <MapNodeBubble
              node={node}
              index={i}
              isPlayerHere={i === playerNodeIndex}
            />
          </div>
        ))}
      </motion.div>

      {/* ── Next step CTA ─────────────────────────────────────────────── */}
      {playerNode && playerNode.status === "current" && playerNode.lessons.length > 0 && (
        <motion.a
          href={`/lesson/${playerNode.lessons[0]}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="
            flex items-center justify-center gap-2
            w-full py-4 rounded-2xl
            bg-gradient-to-r from-blue-500 to-indigo-600
            text-white font-bold text-lg
            shadow-[0_6px_0_0_#3730a3]
            hover:shadow-[0_3px_0_0_#3730a3] hover:translate-y-0.5
            active:shadow-none active:translate-y-1
            transition-all
          "
        >
          <span>Continuar: {playerNode.title}</span>
          <span className="text-xl">{playerNode.icon}</span>
        </motion.a>
      )}

      {/* ── Block complete banner ─────────────────────────────────────── */}
      {completedCount ===
        JOURNEY_NODES.filter((n) => n.id !== "finish").length && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-extrabold text-xl py-4 rounded-2xl shadow-lg"
        >
          🎉 Block 1 Completo! Parabéns!
        </motion.div>
      )}
    </div>
  )
}
