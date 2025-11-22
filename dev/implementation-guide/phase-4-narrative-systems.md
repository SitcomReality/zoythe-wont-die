# Phase 4: Advanced Narrative Systems

This phase implements sophisticated narrative features.

## Step 4.1: Foreshadowing System

**Goal:** Track and inject foreshadowing for twists and reveals

**Files to Create:**
- `src/systems/foreshadowing-tracker.js` - Foreshadowing management

**Files to Modify:**
- `src/narrative/engine/llm-service.js` - Include foreshadowing in prompts
- `src/systems/twist-generator.js` - Define foreshadowing needs

**Implementation Details:**
- When twist/reveal selected, register required foreshadowing
- Foreshadowing types: SUBTLE, MODERATE, OBVIOUS
- Distribution: Place foreshadowing across earlier beats
- Track: What was foreshadowed, when, how
- Prompt injection: "Subtly hint that [X]" in appropriate beats
- Validation: Check if twist was adequately foreshadowed
- Examples:
  - Companion betrayal: Mentions of suspicious behavior, contradictions
  - Poison death: Early references to rare toxins, botanical knowledge
  - Divine conspiracy: Recurring symbols, prophetic dreams

**Validation:**
- Twists have foreshadowing placed in earlier beats
- Foreshadowing feels natural, not forced
- Multiple types of foreshadowing supported
- Players can spot hints on re-read

---

## Step 4.2: Clue-Based Choice Generation

**Goal:** Dynamically create choices that use discovered clues

**Files to Modify:**
- `src/narrative/engine/llm-service.js` - Add discovered clues to prompt
- `src/prompts/systemPrompt.js` - Instruct AI to create clue choices

**Implementation Details:**
- Include discovered clues in prompt context
- System prompt: "When relevant, provide choices that use specific clues"
- Example: If player found "muddy boots" clue, offer "Ask about the muddy boots"
- Clue choices should be optional, not required
- Some clue choices are red herrings
- Track which clues have been "used" in dialogue/investigation
- Mark clues as relevant to current beat/NPC

**Validation:**
- Choices reference discovered clues
- Not every clue forces a choice (organic inclusion)
- Using clue advances investigation or reveals info
- Red herring clues can mislead

---

## Step 4.3: Red Herring System

**Goal:** Create misleading clues and choices that lead astray

**Files to Modify:**
- `src/systems/clue-generator.js` - Generate red herrings
- `src/narrative/beats/hero-journey/road-of-tests.js` - Offer red herring paths

**Implementation Details:**
- Red herring clues: Point to wrong suspect, false method, misleading motive
- Red herring choices: "Follow the wrong lead", "Trust the liar"
- Consequences: Waste time (urgency), wrong accusation setup, confusion
- Balance: Don't make game unsolvable
- Ratio: ~1 red herring per 2 real clues
- Mark red herrings in clue data (truthValue: false)
- Prompt AI to occasionally offer misleading paths

**Validation:**
- Red herrings present but not overwhelming
- Player can distinguish with careful thought
- Following red herring has minor negative consequence
- Game remains solvable despite red herrings

---

## Step 4.4: Investigation-Based Progression

**Goal:** Allow player to stay in beat to investigate further

**Files to Modify:**
- `src/narrative/beats/hero-journey/call-to-adventure.js` - Investigation loops
- `src/narrative/beats/hero-journey/road-of-tests.js` - Extended investigation
- `src/narrative/engine/beat-orchestrator.js` - Refine advancement logic

**Implementation Details:**
- Beats offer both advancement and investigation choices
- Investigation choices: Return null nextBeat to stay
- Track investigation depth per beat
- After 2-3 investigations, encourage advancement (not force)
- Choices labeled clearly: "Continue investigating" vs "Move on"
- Balance: Too much freedom vs too much railroading
- Some beats require advancement (story critical moments)
- Investigation reveals more details, not always new clues

**Validation:**
- Player can investigate multiple times before advancing
- Investigation choices feel meaningful
- Game doesn't get stuck in endless investigation
- Advancement is clear when it's time

---

## Step 4.5: Loosened Railroading

**Goal:** Reduce forced narrative progression, increase player agency

**Files to Modify:**
- `src/systems/railroad-engine.js` - Adjust thresholds and triggers
- `src/narrative/engine/beat-orchestrator.js` - Respect player exploration
- `src/state/narrative-state.js` - Track exploration depth

**Implementation Details:**
- Increase urgency threshold: 3 -> 5 (more freedom)
- Remove automatic "skip to next phase" mechanics
- Add "exploration score" - reward thorough investigation
- Railroad only for critical story moments (death required, revelation needed)
- Player can revisit earlier beats/locations if desired
- Failed investigation attempts don't count as refusals
- "I need more time" choices pause urgency timer

**Validation:**
- Players can explore without forced advancement
- Urgency builds gradually
- Railroading feels justified when it happens
- Player agency feels meaningful

---

## Step 4.6: Story Scope Integration

**Goal:** Ensure all systems respect selected story scope

**Files to Modify:**
- `src/systems/suspect-generator.js` - Scope-appropriate suspects
- `src/systems/death-scenario-generator.js` - Scope-appropriate scenarios
- `src/systems/name-generator.js` - Scope-appropriate names/titles
- `src/prompts/systemPrompt.js` - Include scope in system prompt

**Implementation Details:**
- INTIMATE scope: Family members, neighbors, simple weapons, personal motives
- REGIONAL: Local nobles, merchants, priests, political motives
- NATIONAL: Generals, royalty, high stakes, war/succession
- COSMIC: Gods, divine beings, reality-breaking weapons, existential stakes
- Filter character templates by scope
- Adjust power levels in descriptions
- Scale mystery complexity with scope
- System prompt includes scope guidance for AI

**Validation:**
- INTIMATE stories feel personal and grounded
- COSMIC stories feel epic and mythic
- Suspects and scenarios match selected scope
- AI descriptions respect scope limitations

