/**
 * Journey Map — Shared Types
 * Used by all journey components. UI-only types, separate from Learning Engine.
 */

export type JourneyNodeStatus = 'completed' | 'current' | 'locked'

export type JourneyNode = {
  /** Unique identifier — matches lesson ID in the existing lesson system */
  id: string
  /** Display label on the map */
  title: string
  /** Emoji icon shown inside the node bubble */
  icon: string
  /** Lesson IDs that belong to this map node */
  lessons: string[]
  /** SVG canvas position (percentage of container width/height) */
  position: { x: number; y: number }
  /** Computed at runtime from localStorage completion data */
  status: JourneyNodeStatus
  /** CEFR-ish block label */
  block: string
}

export type MapTheme = {
  nodeCompleted: string
  nodeCurrent: string
  nodeLocked: string
  pathCompleted: string
  pathPending: string
}
