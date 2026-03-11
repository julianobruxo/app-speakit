"use client"

import { useState } from "react"
import { LessonWizard } from "@/components/LessonWizard"
import { Flashcard } from "@/components/Flashcard"
import { MCQExercise } from "@/components/MCQExercise"
import { PronunciationRecorder } from "@/components/PronunciationRecorder"
import { DialoguePractice } from "@/components/DialoguePractice"
import { AIConversation } from "@/components/AIConversation"
import { CelebrationAnimation } from "@/components/CelebrationAnimation"
import { useRouter } from "next/navigation"

interface LessonClientProps {
  id: string
  initialData: any
}

// Ordered list of all Block 1 lessons
const LESSON_ORDER = [
  'greetings',
  'vocabulary',
  'to_be',
  'asking_names',
  'dialogue',
  'ai_conversation',
]

const STORAGE_KEY = 'speakit_completed_lessons'

function markLessonComplete(id: string) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const completed: string[] = saved ? JSON.parse(saved) : []
    if (!completed.includes(id)) {
      completed.push(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
      // Notify same-tab listeners (window.storage only fires cross-tab)
      window.dispatchEvent(new CustomEvent('lessonCompleted', { detail: { id } }))
    }
  } catch {}
}

function getNextLesson(currentId: string): string | null {
  const idx = LESSON_ORDER.indexOf(currentId)
  if (idx === -1 || idx === LESSON_ORDER.length - 1) return null
  return LESSON_ORDER[idx + 1]
}

// Vocabulary steps
const VOCABULARY_STEPS = [
  { type: "flashcard", front: "Hello", back: "Olá" },
  { type: "flashcard", front: "Good morning", back: "Bom dia" },
  { type: "flashcard", front: "Good evening", back: "Boa tarde" },
  { type: "mcq", question: "Como se diz \"Olá\"?", options: ["Goodbye", "Hello", "Thanks", "Sorry"], answer: "Hello" },
  { type: "mcq", question: "Como se diz \"Bom dia\"?", options: ["Good night", "Good evening", "Good morning", "Hello"], answer: "Good morning" },
  { type: "pronunciation", text: "Good morning" },
  { type: "pronunciation", text: "Hello" },
]

const DIALOGUE_DATA = [
  { speaker: "A" as "A", text: "Hello! What is your name?", translation: "Olá! Qual é o seu nome?" },
  { speaker: "B" as "B", text: "Hi! My name is Anna.", translation: "Oi! Meu nome é Anna." },
  { speaker: "A" as "A", text: "Nice to meet you, Anna.", translation: "Prazer em conhecê-la, Anna." },
  { speaker: "B" as "B", text: "Nice to meet you too.", translation: "Prazer em conhecê-lo também." },
]

export function LessonClient({ id, initialData }: LessonClientProps) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const nextLesson = getNextLesson(id)

  const handleComplete = () => {
    markLessonComplete(id)
    setIsCompleted(true)
  }

  const handleNextStep = () => {
    if (id === 'vocabulary' && stepIndex < VOCABULARY_STEPS.length - 1) {
      setStepIndex(stepIndex + 1)
    } else {
      handleComplete()
    }
  }

  const handleContinue = () => {
    if (nextLesson) {
      router.push(`/lesson/${nextLesson}`)
    } else {
      router.push("/")
    }
  }

  if (isCompleted) {
    return (
      <CelebrationAnimation
        onContinue={handleContinue}
        nextLessonLabel={nextLesson ? "Próxima Lição →" : "Voltar ao Início"}
        isLastLesson={!nextLesson}
      />
    )
  }

  // JSON-driven lessons
  if (initialData) {
    return <LessonWizard slides={initialData.slides} onComplete={handleComplete} />
  }

  // Vocabulary custom lesson
  if (id === "vocabulary") {
    const currentStep = VOCABULARY_STEPS[stepIndex]

    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px]">
        <div className="mb-8 text-center w-full max-w-xl">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-1">Vocabulary Practice</h1>
          <p className="text-gray-500 font-medium">Passo {stepIndex + 1} de {VOCABULARY_STEPS.length}</p>
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-3">
            {VOCABULARY_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i < stepIndex ? 'bg-green-400' : i === stepIndex ? 'bg-blue-500 scale-125' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {currentStep.type === "flashcard" && (
          <Flashcard key={stepIndex} frontText={currentStep.front!} backText={currentStep.back!} onNext={handleNextStep} />
        )}
        {currentStep.type === "mcq" && (
          <MCQExercise key={stepIndex} question={currentStep.question!} options={currentStep.options!} correctAnswer={currentStep.answer!} onSuccess={handleNextStep} />
        )}
        {currentStep.type === "pronunciation" && (
          <PronunciationRecorder key={stepIndex} expectedText={currentStep.text!} onSuccess={handleNextStep} />
        )}
      </div>
    )
  }

  if (id === "dialogue") {
    return <DialoguePractice title="Nice to meet you!" lines={DIALOGUE_DATA} onComplete={handleComplete} />
  }

  if (id === "ai_conversation") {
    return <AIConversation onComplete={handleComplete} />
  }

  return <div>Unknown Lesson</div>
}
