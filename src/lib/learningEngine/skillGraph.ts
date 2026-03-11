/**
 * Learning Engine — Skill Graph
 *
 * Defines the A1-level skill graph for the SpeakIT app.
 * Students never see skill names directly — these are internal grammar concepts.
 * Skills are ordered from most basic to most complex, and each skill declares
 * its prerequisites so the engine can unlock them progressively.
 */

export type SkillNode = {
  id: string
  label: string
  level: number
  /** IDs of skills that must be learned before this one */
  dependencies: string[]
}

/** All A1 skills ordered by complexity */
export const SKILL_GRAPH: SkillNode[] = [
  {
    id: 'greetings',
    label: 'Greetings',
    level: 1,
    dependencies: [],
  },
  {
    id: 'introductions',
    label: 'Introductions',
    level: 1,
    dependencies: ['greetings'],
  },
  {
    id: 'adjectives_basic',
    label: 'Basic Adjectives',
    level: 1,
    dependencies: [],
  },
  {
    id: 'describing_people',
    label: 'Describing People',
    level: 1,
    dependencies: ['adjectives_basic', 'introductions'],
  },
  {
    id: 'locations',
    label: 'Locations',
    level: 1,
    dependencies: [],
  },
  {
    id: 'countries',
    label: 'Countries',
    level: 1,
    dependencies: ['locations'],
  },
  {
    id: 'origin_questions',
    label: 'Origin Questions',
    level: 1,
    dependencies: ['countries', 'introductions'],
  },
  {
    id: 'family_vocab',
    label: 'Family Vocabulary',
    level: 1,
    dependencies: ['adjectives_basic'],
  },
  {
    id: 'family_questions',
    label: 'Family Questions',
    level: 1,
    dependencies: ['family_vocab'],
  },
  {
    id: 'action_verbs',
    label: 'Action Verbs',
    level: 1,
    dependencies: [],
  },
  {
    id: 'demonstratives',
    label: 'Demonstratives (this/that/these/those)',
    level: 1,
    dependencies: ['adjectives_basic'],
  },
  {
    id: 'articles',
    label: 'Articles (a/an/the)',
    level: 1,
    dependencies: ['adjectives_basic'],
  },
  {
    id: 'plural',
    label: 'Plural Nouns',
    level: 1,
    dependencies: ['articles'],
  },
  {
    id: 'wh_questions',
    label: 'Wh- Questions',
    level: 1,
    dependencies: ['introductions', 'action_verbs'],
  },
  {
    id: 'possessives',
    label: 'Possessives (my/your/his/her)',
    level: 1,
    dependencies: ['family_vocab'],
  },
  {
    id: 'time',
    label: 'Telling Time',
    level: 1,
    dependencies: [],
  },
  {
    id: 'prepositions_place',
    label: 'Prepositions of Place',
    level: 1,
    dependencies: ['locations'],
  },
  {
    id: 'simple_present',
    label: 'Simple Present',
    level: 1,
    dependencies: ['action_verbs', 'wh_questions'],
  },
  {
    id: 'there_is_are',
    label: 'There is / There are',
    level: 1,
    dependencies: ['plural', 'prepositions_place'],
  },
  {
    id: 'adverbs_frequency',
    label: 'Adverbs of Frequency',
    level: 1,
    dependencies: ['simple_present'],
  },
]

/** Look up a skill node by ID */
export function getSkillNode(skillId: string): SkillNode | undefined {
  return SKILL_GRAPH.find((s) => s.id === skillId)
}

/**
 * Returns the IDs of skills that are unlocked given a set of learned skill IDs.
 * A skill is unlocked when all its dependencies have been learned.
 */
export function getUnlockedSkills(learnedSkillIds: string[]): string[] {
  const learned = new Set(learnedSkillIds)
  return SKILL_GRAPH.filter(
    (s) =>
      !learned.has(s.id) &&
      s.dependencies.every((dep) => learned.has(dep))
  ).map((s) => s.id)
}

/**
 * Returns ordered skill IDs suitable for sequential curriculum delivery
 * (topological order, already baked into SKILL_GRAPH array order).
 */
export function getSkillsInOrder(): string[] {
  return SKILL_GRAPH.map((s) => s.id)
}
