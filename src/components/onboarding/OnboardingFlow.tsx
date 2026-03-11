"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { WelcomeScreen } from "./WelcomeScreen"
import { NameStep } from "./NameStep"
import { GoalStep } from "./GoalStep"
import { StudyTimeStep } from "./StudyTimeStep"
import { StartJourneyStep } from "./StartJourneyStep"
import {
  generateId,
  saveProfile,
  type LearningGoal,
  type DailyStudyTime,
  type OnboardingProfile,
} from "./types"

type Step = "welcome" | "name" | "goal" | "study_time" | "start"

const STEPS: Step[] = ["welcome", "name", "goal", "study_time", "start"]
const STEP_LABELS = ["Boas-vindas", "Nome", "Objetivo", "Tempo", "Iniciar"]

interface OnboardingFlowProps {
  /** Called when the user completes onboarding. Parent should hide this and show JourneyMap. */
  onComplete: (profile: OnboardingProfile) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>("welcome")
  const [name, setName] = useState("")
  const [goal, setGoal] = useState<LearningGoal | null>(null)
  const [dailyStudyTime, setDailyStudyTime] = useState<DailyStudyTime | null>(null)

  const stepIndex = STEPS.indexOf(step)

  const goBack = () => {
    const prev = STEPS[stepIndex - 1]
    if (prev) setStep(prev)
  }

  const handleNameNext = (n: string) => {
    setName(n)
    setStep("goal")
  }

  const handleGoalNext = (g: LearningGoal) => {
    setGoal(g)
    setStep("study_time")
  }

  const handleStudyTimeNext = (t: DailyStudyTime) => {
    setDailyStudyTime(t)
    setStep("start")
  }

  const handleStart = () => {
    if (!goal || !dailyStudyTime) return

    const profile: OnboardingProfile = {
      id: generateId(),
      name,
      goal,
      dailyStudyTime,
      createdAt: new Date().toISOString(),
      skillStates: {},
      completedLessons: [],
    }

    saveProfile(profile)
    onComplete(profile)
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-start justify-center overflow-y-auto">
      <div className="w-full max-w-md mx-auto px-4 pt-8 pb-12">

        {/* Progress bar + step dots */}
        {step !== "welcome" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {STEPS.slice(1).map((s, i) => {
                const sIdx = i + 1
                const isActive = STEPS.indexOf(step) >= sIdx
                return (
                  <div
                    key={s}
                    className={`
                      transition-all duration-300 rounded-full
                      ${isActive
                        ? "w-8 h-3 bg-blue-500"
                        : "w-3 h-3 bg-gray-200"
                      }
                    `}
                  />
                )
              })}
            </div>

            {/* Step label */}
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Passo {stepIndex} de {STEPS.length - 1} — {STEP_LABELS[stepIndex]}
            </p>
          </motion.div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={step}>
            {step === "welcome" && (
              <WelcomeScreen onNext={() => setStep("name")} />
            )}

            {step === "name" && (
              <NameStep onNext={handleNameNext} onBack={goBack} />
            )}

            {step === "goal" && (
              <GoalStep onNext={handleGoalNext} onBack={goBack} name={name} />
            )}

            {step === "study_time" && (
              <StudyTimeStep
                onNext={handleStudyTimeNext}
                onBack={goBack}
                name={name}
              />
            )}

            {step === "start" && goal && dailyStudyTime && (
              <StartJourneyStep
                profile={{ name, goal, dailyStudyTime }}
                onStart={handleStart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
