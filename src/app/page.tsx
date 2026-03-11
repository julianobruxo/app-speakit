"use client"

import { useEffect, useState } from "react"
import { JourneyMap } from "@/components/journey/JourneyMap"
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow"
import { loadProfile, type OnboardingProfile } from "@/components/onboarding/types"

type AppState = "loading" | "onboarding" | "journey"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("loading")

  useEffect(() => {
    const profile = loadProfile()
    setAppState(profile ? "journey" : "onboarding")
  }, [])

  const handleOnboardingComplete = (_profile: OnboardingProfile) => {
    setAppState("journey")
  }

  // ── Loading: avoid flash of wrong screen ─────────────────────────────────
  if (appState === "loading") {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 animate-pulse" />
          <span className="text-sm font-medium">Carregando…</span>
        </div>
      </div>
    )
  }

  // ── Onboarding: full-screen overlay ──────────────────────────────────────
  if (appState === "onboarding") {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  // ── Journey Map ───────────────────────────────────────────────────────────
  return (
    <div className="w-full mt-4 pb-12">
      <JourneyMap />
    </div>
  )
}

