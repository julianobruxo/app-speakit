/**
 * Learning Engine — Core Types
 * These types are UI-independent and represent the internal data model
 * for skill tracking, lesson management, and user progress.
 */

/** A skill node in the skill graph (internal grammar concept) */
export type Skill = {
  id: string
  /** CEFR-like level: 1 = A1, 2 = A2, etc. */
  level: number
  /** Current mastery strength of this skill (0.0 – 1.0) */
  strength: number
  /** Unix timestamp (ms) of the last time this skill was practiced */
  lastSeen: number
}

/** A lesson as seen by the learning engine (maps to one or more skills) */
export type Lesson = {
  id: string
  title: string
  /** Skill IDs this lesson covers */
  skills: string[]
  /** 1 = easiest, 5 = hardest */
  difficulty: number
  /** How many days before this lesson should be reviewed */
  reviewAfter: number
}

/** Per-skill state stored in a user's profile */
export type UserSkillState = {
  skillId: string
  /** Mastery strength (0.0 – 1.0). Higher = better remembered */
  strength: number
  /** Unix timestamp (ms) of last practice */
  lastSeen: number
}

/** A user's full learning profile */
export type UserProfile = {
  id: string
  /** Map of skill ID → current state */
  skillStates: Record<string, UserSkillState>
  /** IDs of lessons the user has completed */
  completedLessons: string[]
}
