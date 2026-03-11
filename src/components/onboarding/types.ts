/**
 * Onboarding Wizard — Shared Types
 *
 * NOTE: The `UserProfile` here is the onboarding/UI profile.
 * It is intentionally separate from the Learning Engine's internal UserProfile
 * to avoid coupling the UI layer to the engine.
 */

export type LearningGoal = 'travel' | 'work' | 'school' | 'fun'
export type DailyStudyTime = 5 | 10 | 20

export type OnboardingProfile = {
  /** Unique ID — generated once on first save */
  id: string
  /** User's display name */
  name: string
  /** Why they are learning English */
  goal: LearningGoal
  /** Minutes per day they plan to study */
  dailyStudyTime: DailyStudyTime
  /** ISO timestamp of when onboarding was completed */
  createdAt: string
  /** Internal skill states — starts empty, populated by the learning engine */
  skillStates: Record<string, unknown>
  /** Lesson IDs the user has completed */
  completedLessons: string[]
}

/** localStorage key for the onboarding profile */
export const PROFILE_STORAGE_KEY = 'speakit_user_profile'

/** Generate a simple unique ID */
export function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/** Load profile from localStorage. Returns null if not found. */
export function loadProfile(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OnboardingProfile
  } catch {
    return null
  }
}

/** Persist profile to localStorage */
export function saveProfile(profile: OnboardingProfile): void {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}
