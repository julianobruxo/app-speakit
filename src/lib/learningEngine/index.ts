/**
 * Learning Engine — Public API
 *
 * Import from '@/lib/learningEngine' to access all engine functionality.
 */

// Types
export type { Skill, Lesson, UserSkillState, UserProfile } from './types'

// Skill Graph
export {
  SKILL_GRAPH,
  getSkillNode,
  getUnlockedSkills,
  getSkillsInOrder,
} from './skillGraph'
export type { SkillNode } from './skillGraph'

// Skill Tracking (Learning Engine core)
export {
  registerSkill,
  updateSkillStrength,
  getSkillState,
  completeLesson,
} from './learningEngine'

// Review Scheduler
export { scheduleReview, getReviewInterval } from './reviewScheduler'

// Lesson Selector
export { getNextLesson, isBlockComplete } from './lessonSelector'
