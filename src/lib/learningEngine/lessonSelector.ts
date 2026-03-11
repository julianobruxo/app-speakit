/**
 * Learning Engine — Lesson Selector
 *
 * Decides which lesson to present next based on:
 * 1. Priority: skills due for review (spaced repetition)
 * 2. Fallback: next new/unstarted skill in dependency order
 *
 * This module is UI-independent.
 */

import type { Lesson, UserProfile } from './types'
import { scheduleReview } from './reviewScheduler'
import { getSkillsInOrder } from './skillGraph'

/**
 * getNextLesson — main entry point.
 *
 * Algorithm:
 * 1. Get list of skills due for review
 * 2. If any review skill maps to a lesson → return that lesson (not already completed)
 * 3. Otherwise → return the first unlocked, uncompleted lesson in curriculum order
 * 4. Returns undefined if all lessons are completed
 *
 * @param profile - The user's current learning profile
 * @param lessons - The full lesson catalogue to select from
 */
export function getNextLesson(
  profile: UserProfile,
  lessons: Lesson[]
): Lesson | undefined {
  const completedSet = new Set(profile.completedLessons)

  // ── Step 1: Check the review queue ──────────────────────────────────────
  const reviewSkills = scheduleReview(profile)

  if (reviewSkills.length > 0) {
    const reviewSet = new Set(reviewSkills)

    // Find the first non-completed lesson that covers at least one review skill
    const reviewLesson = lessons.find(
      (lesson) =>
        !completedSet.has(lesson.id) &&
        lesson.skills.some((s) => reviewSet.has(s))
    )

    if (reviewLesson) return reviewLesson
  }

  // ── Step 2: Select the next new lesson ──────────────────────────────────
  // Skills the user has already encountered (registered)
  const knownSkills = new Set(Object.keys(profile.skillStates))

  // Follow the canonical skill order from the skill graph
  const skillOrder = getSkillsInOrder()

  for (const skillId of skillOrder) {
    // Skip skills the user already knows
    if (knownSkills.has(skillId)) continue

    // Find a lesson that teaches this skill and hasn't been completed
    const candidate = lessons.find(
      (lesson) =>
        !completedSet.has(lesson.id) && lesson.skills.includes(skillId)
    )

    if (candidate) return candidate
  }

  // ── Step 3: Fallback — any uncompleted lesson ────────────────────────────
  // (handles lessons with skills not in the skill graph, e.g. AI conversation)
  return lessons.find((lesson) => !completedSet.has(lesson.id))
}

/**
 * Returns whether all provided lessons have been completed by the user.
 */
export function isBlockComplete(
  profile: UserProfile,
  lessons: Lesson[]
): boolean {
  const completedSet = new Set(profile.completedLessons)
  return lessons.every((lesson) => completedSet.has(lesson.id))
}
