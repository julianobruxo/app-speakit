"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, CheckCircle2, Circle, MessageSquare, Mic, Trophy, Star } from "lucide-react"
import { useEffect, useState } from "react"

const STORAGE_KEY = 'speakit_completed_lessons'

const LESSONS = [
  { id: "greetings",       title: "Greetings",          icon: BookOpen },
  { id: "vocabulary",      title: "Vocabulary Practice", icon: MessageSquare },
  { id: "to_be",           title: "Verb To Be",          icon: BookOpen },
  { id: "asking_names",    title: "Asking Names",        icon: Circle },
  { id: "dialogue",        title: "Dialogue",            icon: Mic },
  { id: "ai_conversation", title: "AI Conversation",     icon: Trophy },
]

export function Sidebar() {
  const pathname = usePathname()
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) setCompleted(new Set(JSON.parse(saved)))
      } catch {}
    }
    load()
    // storage fires cross-tab; lessonCompleted fires same-tab
    window.addEventListener("storage", load)
    window.addEventListener("lessonCompleted", load)
    return () => {
      window.removeEventListener("storage", load)
      window.removeEventListener("lessonCompleted", load)
    }
  }, [])

  const xp = completed.size * 10

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-screen fixed hidden md:flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            🇧🇷 SpeakIT
          </h2>
        </Link>
        <p className="text-sm text-gray-500 font-medium mt-0.5">Block 1 – A1 Level</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto w-full">
        {LESSONS.map((lesson, index) => {
          const isActive = pathname.includes(lesson.id)
          const isDone = completed.has(lesson.id)
          const Icon = lesson.icon

          return (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.id}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : isDone
                  ? "text-green-700 bg-green-50/60 hover:bg-green-50"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {isDone ? (
                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
              ) : (
                <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />
              )}
              <span className="truncate text-sm">{index + 1}. {lesson.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm font-semibold text-gray-600">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-yellow-500" fill="currentColor" />
          <span>{xp} XP</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-orange-500">🔥</span>
          <span className="text-orange-600">{completed.size} done</span>
        </div>
      </div>
    </aside>
  )
}
