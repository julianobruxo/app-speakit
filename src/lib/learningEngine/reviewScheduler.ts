/**
 * Learning Engine — Review Scheduler
 *
 * Implements a simplified spaced-repetition algorithm.
 * Skills are scheduled for review based on their current strength
 * and how long ago they were last seen.
 */

import type { UserProfile, UserSkillState } from './types'

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Thresholds that determine how soon a skill should be reviewed */
const REVIEW_THRESHOLDS = {
  /**
   * Weak skills (strength < 0.5) should be reviewed within 1 day.
   * The user hasn't mastered this yet.
   */
  WEAK: { maxStrength: 0.5, reviewAfterDays: 1 },

  /**
   * Intermediate skills (0.5 ≤ strength < 0.8) reviewed every 3 days.
   * Good progress but needs reinforcement.
   */
  INTERMEDIATE: { maxStrength: 0.8, reviewAfterDays: 3 },

  /**
   * Strong skills (strength ≥ 0.8) reviewed every 7 days.
   * Well memorised, light maintenance review.
   */
  STRONG: { maxStrength: 1.0, reviewAfterDays: 7 },
}

/**
 * Returns the number of days after which a skill should be reviewed,
 * based on its current strength.
 */
function getReviewIntervalDays(strength: number): number {
  if (strength < REVIEW_THRESHOLDS.WEAK.maxStrength) {
    return REVIEW_THRESHOLDS.WEAK.reviewAfterDays
  }
  if (strength < REVIEW_THRESHOLDS.INTERMEDIATE.maxStrength) {
    return REVIEW_THRESHOLDS.INTERMEDIATE.reviewAfterDays
  }
  return REVIEW_THRESHOLDS.STRONG.reviewAfterDays
}

/**
 * Returns true if a skill is due for review right now.
 */
function isDue(skillState: UserSkillState, now: number): boolean {
  const daysSinceLastSeen = (now - skillState.lastSeen) / MS_PER_DAY
  const intervalDays = getReviewIntervalDays(skillState.strength)
  return daysSinceLastSeen >= intervalDays
}

/**
 * scheduleReview — main entry point.
 *
 * Scans all skill states in the user profile and returns the IDs of
 * skills that are currently due for review, sorted by urgency:
 * weakest + longest unseen first.
 */
export function scheduleReview(profile: UserProfile): string[] {
  const now = Date.now()

  const dueSkills = Object.values(profile.skillStates).filter((s) =>
    isDue(s, now)
  )

  // Sort: weakest first, then earliest lastSeen (most overdue first)
  dueSkills.sort((a, b) => {
    if (a.strength !== b.strength) return a.strength - b.strength
    return a.lastSeen - b.lastSeen
  })

  return dueSkills.map((s) => s.skillId)
}

/**
 * Returns the review interval (in days) for a given skill strength.
 * Exported for testing and UI display purposes.
 */
export function getReviewInterval(strength: number): number {
  return getReviewIntervalDays(strength)
}
