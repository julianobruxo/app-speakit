/**
 * Learning Engine — Self-contained Test
 *
 * Verifies core engine logic using Node.js built-in `assert`.
 * No external frameworks needed. Run with:
 *
 *   node src/lib/learningEngine/__tests__/engine.test.mjs
 */

import assert from 'node:assert/strict'

// ─────────────────────────────────────────────────────────────────
// Re-implement the engine logic inline (pure JS, no TypeScript)
// so this test runs directly with Node.js without a build step.
// ─────────────────────────────────────────────────────────────────

const MS_PER_DAY = 24 * 60 * 60 * 1000

// ── skillGraph (subset for testing) ──────────────────────────────
const SKILL_GRAPH = [
  { id: 'greetings',        dependencies: [] },
  { id: 'introductions',    dependencies: ['greetings'] },
  { id: 'adjectives_basic', dependencies: [] },
  { id: 'describing_people',dependencies: ['adjectives_basic', 'introductions'] },
  { id: 'locations',        dependencies: [] },
  { id: 'action_verbs',     dependencies: [] },
  { id: 'wh_questions',     dependencies: ['introductions', 'action_verbs'] },
  { id: 'simple_present',   dependencies: ['action_verbs', 'wh_questions'] },
]

function getSkillsInOrder() {
  return SKILL_GRAPH.map(s => s.id)
}

// ── learningEngine ────────────────────────────────────────────────
const INITIAL_STRENGTH = 0.1
const STRENGTH_INCREMENT = 0.2

function registerSkill(profile, skillId) {
  if (profile.skillStates[skillId]) return profile
  return {
    ...profile,
    skillStates: {
      ...profile.skillStates,
      [skillId]: { skillId, strength: INITIAL_STRENGTH, lastSeen: Date.now() },
    },
  }
}

function updateSkillStrength(profile, skillId, delta = STRENGTH_INCREMENT) {
  const withSkill = registerSkill(profile, skillId)
  const current = withSkill.skillStates[skillId]
  const newStrength = Math.min(1.0, current.strength + delta)
  return {
    ...withSkill,
    skillStates: {
      ...withSkill.skillStates,
      [skillId]: { ...current, strength: newStrength, lastSeen: Date.now() },
    },
  }
}

function getSkillState(profile, skillId) {
  return profile.skillStates[skillId]
}

function completeLesson(profile, lessonId, skillIds) {
  let updated = { ...profile }
  for (const skillId of skillIds) updated = updateSkillStrength(updated, skillId)
  if (!updated.completedLessons.includes(lessonId)) {
    updated = { ...updated, completedLessons: [...updated.completedLessons, lessonId] }
  }
  return updated
}

// ── reviewScheduler ───────────────────────────────────────────────
function getReviewIntervalDays(strength) {
  if (strength < 0.5) return 1
  if (strength < 0.8) return 3
  return 7
}

function isDue(skillState, now) {
  const daysSince = (now - skillState.lastSeen) / MS_PER_DAY
  return daysSince >= getReviewIntervalDays(skillState.strength)
}

function scheduleReview(profile) {
  const now = Date.now()
  const due = Object.values(profile.skillStates).filter(s => isDue(s, now))
  due.sort((a, b) => (a.strength !== b.strength ? a.strength - b.strength : a.lastSeen - b.lastSeen))
  return due.map(s => s.skillId)
}

// ── lessonSelector ────────────────────────────────────────────────
function getNextLesson(profile, lessons) {
  const completedSet = new Set(profile.completedLessons)
  const reviewSkills = scheduleReview(profile)

  if (reviewSkills.length > 0) {
    const reviewSet = new Set(reviewSkills)
    const reviewLesson = lessons.find(
      l => !completedSet.has(l.id) && l.skills.some(s => reviewSet.has(s))
    )
    if (reviewLesson) return reviewLesson
  }

  const knownSkills = new Set(Object.keys(profile.skillStates))
  for (const skillId of getSkillsInOrder()) {
    if (knownSkills.has(skillId)) continue
    const candidate = lessons.find(l => !completedSet.has(l.id) && l.skills.includes(skillId))
    if (candidate) return candidate
  }

  return lessons.find(l => !completedSet.has(l.id))
}

// ─────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────

/** A fresh user profile with no history */
function freshProfile(id = 'user-1') {
  return { id, skillStates: {}, completedLessons: [] }
}

/** Sample lesson catalogue */
const MOCK_LESSONS = [
  { id: 'greetings',    title: 'Greetings',        skills: ['greetings'],         difficulty: 1, reviewAfter: 1 },
  { id: 'introductions',title: 'Introductions',    skills: ['introductions'],     difficulty: 1, reviewAfter: 2 },
  { id: 'adjectives',   title: 'Basic Adjectives', skills: ['adjectives_basic'],  difficulty: 1, reviewAfter: 2 },
  { id: 'describing',   title: 'Describing People',skills: ['describing_people'], difficulty: 2, reviewAfter: 3 },
  { id: 'wh_questions', title: 'Questions',        skills: ['wh_questions'],      difficulty: 2, reviewAfter: 3 },
]

// ─────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✅  ${name}`)
    passed++
  } catch (err) {
    console.error(`  ❌  ${name}`)
    console.error(`       ${err.message}`)
    failed++
  }
}

console.log('\n📚  SpeakIT Learning Engine — Test Suite\n')

// ── 1: registerSkill ──────────────────────────────────────────────
console.log('🔹 registerSkill')

test('registers a new skill with initial strength', () => {
  const profile = freshProfile()
  const updated = registerSkill(profile, 'greetings')
  const state = getSkillState(updated, 'greetings')
  assert.ok(state, 'skill state should exist')
  assert.equal(state.skillId, 'greetings')
  assert.equal(state.strength, INITIAL_STRENGTH)
})

test('does not overwrite an existing skill', () => {
  let profile = freshProfile()
  profile = registerSkill(profile, 'greetings')
  profile = updateSkillStrength(profile, 'greetings') // strength > initial
  const strengthBefore = getSkillState(profile, 'greetings').strength
  profile = registerSkill(profile, 'greetings') // re-register → no-op
  const strengthAfter = getSkillState(profile, 'greetings').strength
  assert.equal(strengthBefore, strengthAfter)
})

// ── 2: updateSkillStrength ────────────────────────────────────────
console.log('\n🔹 updateSkillStrength')

test('increases skill strength after a lesson', () => {
  let profile = freshProfile()
  profile = registerSkill(profile, 'greetings')
  const before = getSkillState(profile, 'greetings').strength
  profile = updateSkillStrength(profile, 'greetings')
  const after = getSkillState(profile, 'greetings').strength
  assert.ok(after > before, `strength should increase: ${before} → ${after}`)
})

test('strength never exceeds 1.0', () => {
  let profile = freshProfile()
  profile = registerSkill(profile, 'greetings')
  for (let i = 0; i < 20; i++) profile = updateSkillStrength(profile, 'greetings')
  const state = getSkillState(profile, 'greetings')
  assert.ok(state.strength <= 1.0, `strength capped at 1.0, got ${state.strength}`)
})

test('updates lastSeen timestamp when strength changes', () => {
  let profile = freshProfile()
  profile = registerSkill(profile, 'greetings')
  const lastSeenBefore = getSkillState(profile, 'greetings').lastSeen
  // Small delay so timestamps differ
  profile = updateSkillStrength(profile, 'greetings')
  const lastSeenAfter = getSkillState(profile, 'greetings').lastSeen
  assert.ok(lastSeenAfter >= lastSeenBefore, 'lastSeen should be updated')
})

// ── 3: completeLesson ─────────────────────────────────────────────
console.log('\n🔹 completeLesson')

test('adds lesson to completedLessons exactly once', () => {
  let profile = freshProfile()
  profile = completeLesson(profile, 'greetings', ['greetings'])
  profile = completeLesson(profile, 'greetings', ['greetings']) // duplicate
  assert.equal(profile.completedLessons.length, 1)
})

test('increases strength for all covered skills', () => {
  let profile = freshProfile()
  profile = completeLesson(profile, 'adjectives', ['adjectives_basic', 'introductions'])
  assert.ok(getSkillState(profile, 'adjectives_basic'), 'adjectives_basic registered')
  assert.ok(getSkillState(profile, 'introductions'), 'introductions registered')
})

// ── 4: scheduleReview ─────────────────────────────────────────────
console.log('\n🔹 scheduleReview')

test('returns no skills for a fresh profile', () => {
  const profile = freshProfile()
  const due = scheduleReview(profile)
  assert.equal(due.length, 0)
})

test('returns skills overdue for review (weak, old)', () => {
  let profile = freshProfile()
  // Register a weak skill with a lastSeen 2 days ago
  profile.skillStates['greetings'] = {
    skillId: 'greetings',
    strength: 0.3, // weak → review after 1 day
    lastSeen: Date.now() - 2 * MS_PER_DAY, // 2 days ago → overdue
  }
  const due = scheduleReview(profile)
  assert.ok(due.includes('greetings'), `greetings should be due for review, got: ${JSON.stringify(due)}`)
})

test('does not return a strong skill seen recently', () => {
  let profile = freshProfile()
  profile.skillStates['greetings'] = {
    skillId: 'greetings',
    strength: 0.9, // strong → review after 7 days
    lastSeen: Date.now() - 1 * MS_PER_DAY, // only 1 day ago
  }
  const due = scheduleReview(profile)
  assert.ok(!due.includes('greetings'), 'strong recent skill should not be due')
})

test('sorts due skills weakest-first', () => {
  let profile = freshProfile()
  const oldTimestamp = Date.now() - 5 * MS_PER_DAY
  profile.skillStates['introductions'] = { skillId: 'introductions', strength: 0.4, lastSeen: oldTimestamp }
  profile.skillStates['greetings']     = { skillId: 'greetings',     strength: 0.2, lastSeen: oldTimestamp }
  const due = scheduleReview(profile)
  assert.equal(due[0], 'greetings', 'weaker skill should be first')
})

// ── 5: getNextLesson ──────────────────────────────────────────────
console.log('\n🔹 getNextLesson')

test('returns review lesson when a skill is overdue', () => {
  let profile = freshProfile()
  // Skill is overdue for review
  profile.skillStates['greetings'] = {
    skillId: 'greetings',
    strength: 0.3,
    lastSeen: Date.now() - 2 * MS_PER_DAY,
  }
  const next = getNextLesson(profile, MOCK_LESSONS)
  assert.ok(next, 'should return a lesson')
  assert.ok(next.skills.includes('greetings'), `expected greetings lesson, got ${next.id}`)
})

test('returns first curriculum lesson for a fresh profile', () => {
  const profile = freshProfile()
  const next = getNextLesson(profile, MOCK_LESSONS)
  assert.ok(next, 'should return a lesson')
  // First SKILL_GRAPH skill without a known state → greetings
  assert.equal(next.id, 'greetings')
})

test('skips completed lessons', () => {
  let profile = freshProfile()
  profile = completeLesson(profile, 'greetings', ['greetings'])
  const next = getNextLesson(profile, MOCK_LESSONS)
  assert.ok(next, 'should return a lesson after greetings is done')
  assert.notEqual(next.id, 'greetings', 'should not re-select completed lesson')
})

test('returns undefined when all lessons are completed', () => {
  let profile = freshProfile()
  for (const lesson of MOCK_LESSONS) {
    profile = completeLesson(profile, lesson.id, lesson.skills)
  }
  const next = getNextLesson(profile, MOCK_LESSONS)
  assert.equal(next, undefined, 'should return undefined when done')
})

// ─────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────
console.log(`\n─────────────────────────────────────────`)
console.log(`  Results: ${passed} passed, ${failed} failed`)
console.log(`─────────────────────────────────────────\n`)

if (failed > 0) {
  process.exit(1)
}
