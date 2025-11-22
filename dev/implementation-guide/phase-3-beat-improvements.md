# Phase 3: Beat Improvements

This phase enhances individual story beats with more variety and depth.

## Step 3.1: Mentor Beat Enhancement

**Goal:** Add variety to mentor encounters and allow player skepticism

**Files to Create:**
- `src/systems/mentor-generator.js` - Generate varied mentor types

**Files to Modify:**
- `src/narrative/beats/hero-journey/meeting-mentor.js` - Multi-stage interaction
- `src/prompts/hero/meetingMentor.js` - Enhanced prompt with options

**Implementation Details:**
- Mentor types: Ghost ancestor, Mysterious stranger, Rival investigator, Divine fragment, Former detective, Suspect themselves
- Each type has unique knowledge and motivations
- First interaction: Mentor approaches, player can accept or question
- If player questions: Mentor provides proof/explanation
- Player can ask multiple questions before advancing
- Always provide "Trust and proceed" option to advance
- Always provide "Ask about [X]" based on context
- Skeptical path: More revelations, different relationship
- Track mentor relationship quality

**Validation:**
- Different mentors appear across playthroughs
- Player can ask 2-4 questions before advancing
- Advancing is always available but not forced
- Skeptical path feels distinct from trusting path

---

## Step 3.2: Road of Tests - Terminology Variation

**Goal:** Use terminology system for variety in investigation scenes

**Files to Modify:**
- `src/prompts/hero/roadOfTests.js` - Use terminology substitution
- `src/systems/terminology-thesaurus.js` - Expand investigation terms

**Implementation Details:**
- Add investigation-specific terms:
  - LOCATION_TYPE: "chamber", "hall", "void", "fragment", "memory"
  - INVESTIGATION_ACTION: "examine", "scrutinize", "probe", "analyze"
  - CLUE_DISCOVERY: "reveals", "uncovers", "exposes", "hints at"
- Prompt uses ${terminology:X} for varied language
- Each beat run generates new terminology context
- Helps prevent repetitive descriptions

**Validation:**
- Investigation scenes use varied vocabulary
- Same beat type feels different on repeat
- Terminology substitutions feel natural

---

## Step 3.3: Road of Tests - Specific Detail Integration

**Goal:** Use specific generated details in investigation scenes

**Files to Modify:**
- `src/narrative/beats/hero-journey/road-of-tests.js` - Pull from memory context
- `src/prompts/hero/roadOfTests.js` - Reference specific locations

**Implementation Details:**
- Prompt includes specific location from death scenario
- Reference previously mentioned NPCs, items, places
- Use memory context for continuity
- Clue descriptions reference established details
- "You return to the ${location}" vs. generic descriptions

**Validation:**
- Investigation scenes reference specific places
- Locations remain consistent across beats
- Details from earlier beats appear naturally

---

## Step 3.4: Ordeal Flexibility

**Goal:** Support multiple ordeal types beyond accusation

**Files to Modify:**
- `src/narrative/beats/hero-journey/ordeal.js` - Multiple ordeal paths
- `src/prompts/hero/ordeal.js` - Conditional ordeal types

**Implementation Details:**
- Ordeal types:
  - ACCUSATION: Player chooses killer (if 3+ clues found)
  - REVELATION: Truth revealed to player (if <2 clues found)
  - CONFRONTATION: Face killer who's already revealed
  - TRIAL: Present evidence, verdict rendered
  - ESCAPE: Reality collapsing, must act
- Selection based on:
  - Clues discovered
  - Urgency level
  - Player archetype
  - Story scope
- Each type has different prompt and outcomes
- Accusation requires 3+ clues to be available

**Validation:**
- Players with few clues get revelation instead of choice
- Players with many clues can accuse
- Different ordeal types feel distinct
- Outcomes vary by ordeal type

---

## Step 3.5: Resurrection Variety and Twists

**Goal:** Add multiple resurrection scenarios including final twists

**Files to Create:**
- `src/systems/twist-generator.js` - Generate resurrection twists

**Files to Modify:**
- `src/narrative/beats/hero-journey/resurrection.js` - Multiple resurrection paths
- `src/prompts/hero/resurrection.js` - Twist-aware prompts

**Implementation Details:**
- Resurrection twist types:
  - COMPANION_BETRAYAL: Companion was true killer
  - SELF_DEFENSE: You were the aggressor
  - NECESSARY_SACRIFICE: Murder was to save many
  - MISTAKEN_IDENTITY: Wrong target, right reason
  - DIVINE_PAWN: Gods orchestrated it all
  - NONE: Straightforward resolution
- Choose twist based on:
  - Accusation correctness
  - Story mystery twist type
  - RNG with weighted probabilities
- Twist scenarios:
  - POTION_CHOICE: Save self or loved one
  - LOVER_HIRED_KILLER: Revelation scene
  - FATHER_LEGACY: Sins of the father
  - KILLER_WAS_RIGHT: Moral ambiguity
- Twist revealed through dramatic scene
- Player choices respond to twist

**Validation:**
- Multiple playthrough show different resurrection scenes
- Twists feel foreshadowed (once implemented)
- Wrong accusation can trigger specific twists
- Resurrection variety is high

