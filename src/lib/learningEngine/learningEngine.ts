/**
 * Learning Engine — Core Skill Tracking
 *
 * Handles registering skills, updating mastery strength,
 * and querying a user's current skill state.
 * All functions are pure (no side effects outside the profile object).
 */

import type { UserProfile, UserSkillState } from './types'

/** Initial strength applied when a skill is first registered */
const INITIAL_STRENGTH = 0.1

/** How much strength increases per successful lesson completion */
const STRENGTH_INCREMENT = 0.2

/** Strength ceiling */
const MAX_STRENGTH = 1.0

/**
 * Registers a skill on the user profile if it doesn't already exist.
 * Returns the (possibly mutated) profile.
 */
export function registerSkill(
  profile: UserProfile,
  skillId: string
): UserProfile {
  if (profile.skillStates[skillId]) {
    return profile // already registered, no-op
  }

  const newState: UserSkillState = {
    skillId,
    strength: INITIAL_STRENGTH,
    lastSeen: Date.now(),
  }

  return {
    ...profile,
    skillStates: {
      ...profile.skillStates,
      [skillId]: newState,
    },
  }
}

/**
 * Increases the mastery strength for a skill and updates lastSeen.
 * If the skill isn't registered yet, it is registered first.
 *
 * @param delta - Optional custom increment (defaults to STRENGTH_INCREMENT)
 */
export function updateSkillStrength(
  profile: UserProfile,
  skillId: string,
  delta: number = STRENGTH_INCREMENT
): UserProfile {
  // Auto-register if needed
  const withSkill = registerSkill(profile, skillId)

  const current = withSkill.skillStates[skillId]
  const newStrength = Math.min(MAX_STRENGTH, current.strength + delta)

  return {
    ...withSkill,
    skillStates: {
      ...withSkill.skillStates,
      [skillId]: {
        ...current,
        strength: newStrength,
        lastSeen: Date.now(),
      },
    },
  }
}

/**
 * Returns the current state of a skill for the given user.
 * Returns undefined if the skill hasn't been registered yet.
 */
export function getSkillState(
  profile: UserProfile,
  skillId: string
): UserSkillState | undefined {
  return profile.skillStates[skillId]
}

/**
 * Marks a lesson as completed on the user profile.
 * Also bumps skill strength for each skill covered by the lesson.
 */
export function completeLesson(
  profile: UserProfile,
  lessonId: string,
  skillIds: string[]
): UserProfile {
  let updated = { ...profile }

  // Increase strength for every skill the lesson covers
  for (const skillId of skillIds) {
    updated = updateSkillStrength(updated, skillId)
  }

  // Record the lesson as completed (deduplicated)
  if (!updated.completedLessons.includes(lessonId)) {
    updated = {
      ...updated,
      completedLessons: [...updated.completedLessons, lessonId],
    }
  }

  return updated
}
