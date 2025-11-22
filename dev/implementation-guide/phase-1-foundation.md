# Phase 1: Foundation & Infrastructure

This phase establishes the foundational systems needed for enhanced narrative variation.

## Step 1.1: Story Scope System

**Goal:** Implement the 4-tier scope/grandiosity system

**Files to Modify:**
- `src/config/constants.js` - Add STORY_SCOPE enum
- `src/state/game-state.js` - Add scope to initial state
- `src/ui/components/new-game-screen.js` - Add scope selector UI

**Implementation Details:**
- Add STORY_SCOPE constant with 4 levels: INTIMATE, REGIONAL, NATIONAL, COSMIC
- Store selected scope in world state
- Each scope defines max power levels for NPCs and scale descriptors
- Pass scope to mystery and NPC generation

**Validation:**
- New game screen shows scope selector
- Selected scope persists in game state
- Mystery generation receives scope parameter

---

## Step 1.2: Enhanced Character Generation System

**Goal:** Replace hard-coded character details with randomized/generated names and traits

**Files to Create:**
- `src/systems/name-generator.js` - Random name generation by culture/type
- `src/systems/trait-library.js` - Trait/quality pool for characters

**Files to Modify:**
- `src/systems/suspect-generator.js` - Use new name/trait system
- `src/systems/npc-manager.js` - Use new name/trait system

**Implementation Details:**
- Create pools of names categorized by culture/region
- Create trait library with personality, physical, background traits
- Modify suspect/NPC generation to pull from pools
- Add method to generate character descriptions from traits
- Support AI-generated names as fallback/option

**Validation:**
- Each playthrough generates different character names
- Traits vary between characters and playthroughs
- Descriptions feel coherent and natural

---

## Step 1.3: Death Scenario Variation System

**Goal:** Support multiple death types beyond weapon-embedded corpse

**Files to Create:**
- `src/systems/death-scenario-generator.js` - Generate varied death scenarios

**Files to Modify:**
- `src/systems/mystery-generator.js` - Use death scenario generator
- `src/state/world-state.js` - Add death scenario details

**Implementation Details:**
- Define death scenario types: WEAPON_EMBEDDED, FALL, POISON, DROWNING, RITUAL, STRANGLING, etc.
- Each scenario has base visibility, required investigation level
- Some deaths hide weapon/method initially
- Generate scenario-specific clues and discovery paths
- Link scenario to mystery weapon selection

**Validation:**
- Different playthroughs show different death scenarios
- Some scenarios require investigation to reveal method
- Clues align with chosen scenario

---

## Step 1.4: Context Memory Enhancement

**Goal:** Track more specific story details for coherence and callbacks

**Files to Create:**
- `src/state/memory-context.js` - Enhanced context tracking

**Files to Modify:**
- `src/state/game-state.js` - Integrate memory context
- `src/narrative/engine/llm-service.js` - Include memory in prompts

**Implementation Details:**
- Track: locations visited, items mentioned, relationships formed
- Track: promises made, lies told, discoveries, twists foreshadowed
- Track: consequence chains (action -> effect -> callback)
- Store with timestamps and beat references
- Add retrieval methods (recent, by type, by relevance)

**Validation:**
- Context grows as story progresses
- LLM prompts include relevant memory
- Story references past events naturally

---

## Step 1.5: Consequence Tracking System

**Goal:** Enable "consequences of earlier decisions" with specific callbacks

**Files to Create:**
- `src/systems/consequence-tracker.js` - Track choice consequences

**Files to Modify:**
- `src/narrative/engine/beat-orchestrator.js` - Register consequences
- `src/systems/choice-classifier.js` - Tag choices with consequence potential

**Implementation Details:**
- When choice made, tag with potential future impacts
- Store: choice, beat, consequences (immediate and deferred)
- Track fulfillment: when deferred consequence manifests
- Add to prompt context when relevant beat arrives
- Support consequence chains (A leads to B leads to C)

**Validation:**
- Consequences appear in later beats
- Multiple consequence threads can coexist
- Player recognizes callbacks to earlier choices

