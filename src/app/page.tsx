"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Lock, Star, MessageCircle, BookOpen, Mic, Users, Bot } from 'lucide-react'

const LESSONS = [
  {
    id: 'greetings',
    title: 'Greetings',
    subtitle: 'Hello, Hi, Good morning',
    icon: Star,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary Practice',
    subtitle: 'Flashcards & pronunciation',
    icon: BookOpen,
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    iconColor: 'text-violet-500',
  },
  {
    id: 'to_be',
    title: 'Verb To Be',
    subtitle: 'I am, You are, She is…',
    icon: BookOpen,
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'asking_names',
    title: 'Asking Names',
    subtitle: 'What is your name?',
    icon: MessageCircle,
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    iconColor: 'text-orange-500',
  },
  {
    id: 'dialogue',
    title: 'Dialogue Practice',
    subtitle: 'Nice to meet you!',
    icon: Users,
    color: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    iconColor: 'text-pink-500',
  },
  {
    id: 'ai_conversation',
    title: 'AI Conversation',
    subtitle: 'Chat with your AI tutor',
    icon: Bot,
    color: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    iconColor: 'text-cyan-500',
  },
]

const STORAGE_KEY = 'speakit_completed_lessons'

export default function Home() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCompleted(new Set(JSON.parse(saved)))
    } catch {}
  }, [])

  const completedCount = completed.size
  const totalCount = LESSONS.length
  const progressPct = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="w-full flex flex-col gap-8 mt-4 pb-12">
      {/* Header */}
      <header className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight"
        >
          Block 1: <span className="text-blue-600">Introductions</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-500 font-medium"
        >
          Learn to introduce yourself in English – A1 Level
        </motion.p>
      </header>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-700 text-sm">Your progress</span>
          <span className="text-sm font-bold text-blue-600">{completedCount}/{totalCount} lessons</span>
        </div>
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        {completedCount === totalCount && (
          <p className="text-center text-green-600 font-bold mt-3 text-sm">
            🎉 Block 1 complete! Parabéns!
          </p>
        )}
      </motion.div>

      {/* Lesson Cards */}
      <div className="flex flex-col gap-4">
        {LESSONS.map((lesson, index) => {
          const isDone = completed.has(lesson.id)
          const isUnlocked = index === 0 || completed.has(LESSONS[index - 1].id)
          const isLocked = !isUnlocked
          const Icon = lesson.icon

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.07 }}
            >
              {isLocked ? (
                <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed`}>
                  <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Lock size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-400 text-lg">{lesson.title}</p>
                    <p className="text-sm text-gray-400">{lesson.subtitle}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-200 px-3 py-1 rounded-full">Bloqueado</span>
                </div>
              ) : (
                <Link href={`/lesson/${lesson.id}`}>
                  <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${isDone ? 'border-green-300 bg-green-50' : `${lesson.border} ${lesson.bg}`} shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lesson.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Icon size={26} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-lg leading-tight">{lesson.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{lesson.subtitle}</p>
                    </div>
                    {isDone ? (
                      <CheckCircle2 size={28} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${lesson.color} text-white flex-shrink-0`}>
                        {index === 0 || completed.has(LESSONS[index - 1].id) ? 'Começar' : ''}
                      </span>
                    )}
                  </div>
                </Link>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
