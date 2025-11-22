# Phase 5: Polish & Integration

This phase ensures all systems work together cohesively.

## Step 5.1: Cross-System Integration Testing

**Goal:** Verify all new systems interact correctly

**Files to Modify:**
- All modified systems (integration passes)

**Implementation Details:**
- Test death scenarios with all scopes
- Test foreshadowing with all twist types
- Test consequence tracking across full playthrough
- Test clue-based choices with red herrings
- Test investigation progression in each beat
- Verify memory context includes all relevant data
- Ensure LLM prompts contain complete context

**Validation:**
- No system conflicts or null references
- Data flows correctly between systems
- Playthroughs feel coherent start to finish
- No obvious bugs or inconsistencies

---

## Step 5.2: Prompt Refinement

**Goal:** Ensure AI receives optimal context and instructions

**Files to Modify:**
- All prompt files in `src/prompts/hero/`
- `src/prompts/systemPrompt.js`

**Implementation Details:**
- Include foreshadowing instructions
- Include memory context format
- Include consequence callbacks
- Include scope-specific guidance
- Add examples of good vs bad outputs
- Clarify when to advance vs stay in beat
- Specify clue integration expectations
- Add red herring guidance

**Validation:**
- AI generates varied, coherent narratives
- Foreshadowing appears naturally
- Consequences callback correctly
- Scope respected in generated content

---

## Step 5.3: Balance Tuning

**Goal:** Adjust difficulty, pacing, and challenge

**Files to Modify:**
- `src/config/constants.js` - Tuning values
- `src/systems/clue-generator.js` - Clue distribution
- `src/systems/mystery-generator.js` - Difficulty curves

**Implementation Details:**
- Adjust clue counts per difficulty
- Balance red herring ratio
- Tune urgency threshold accumulation
- Adjust investigation depth limits
- Test solvability at each scope
- Ensure 3-4 hours average playthrough
- Prevent player getting stuck

**Validation:**
- Mysteries feel solvable but challenging
- Pacing feels natural, not rushed or slow
- Red herrings mislead but don't break game
- All scopes are enjoyable to play

---

## Step 5.4: Save/Load Compatibility

**Goal:** Ensure new state structures serialize correctly

**Files to Modify:**
- `src/core/persistence.js` - Handle new state fields

**Implementation Details:**
- Add serialization for:
  - Memory context
  - Consequence tracker
  - Foreshadowing state
  - Death scenario details
  - Story scope
- Test save/load mid-playthrough
- Clear save on version change if needed
- Add version migration if maintaining saves

**Validation:**
- Save includes all new state
- Load restores game correctly
- No data loss on save/load cycle
- Mid-playthrough saves work

---

## Step 5.5: Final Testing & Documentation

**Goal:** Comprehensive testing and dev documentation

**Files to Create:**
- `dev/TESTING_CHECKLIST.md` - QA checklist
- `dev/SYSTEMS_OVERVIEW.md` - System documentation

**Implementation Details:**
- Test each story scope fully
- Test each death scenario
- Test each ordeal type
- Test each resurrection path
- Test all twist combinations
- Test consequences spanning many beats
- Test foreshadowing placement
- Document all new systems
- Document configuration options
- Create troubleshooting guide

**Validation:**
- All features working as designed
- No critical bugs
- Performance acceptable
- Developer can understand systems

