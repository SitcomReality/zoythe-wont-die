# Phase 2: Death Scenario Implementation

This phase implements the variable death scenarios and investigation mechanics.

## Step 2.1: Death Scenario Templates

**Goal:** Define comprehensive death scenario templates

**Files to Modify:**
- `src/systems/death-scenario-generator.js` - Add scenario templates

**Implementation Details:**
- Create template for each death type:
  - WEAPON_EMBEDDED: visible weapon, immediate clue
  - FALL: positional, requires examining surroundings
  - POISON: subtle, requires corpse examination
  - DROWNING: water-related clues
  - RITUAL: symbolic arrangement, multiple clues
  - STRANGLING: marks, requires close inspection
  - BURNING: char patterns, remnants
  - DIVINE_DISSOLUTION: cosmic, requires mystical knowledge
- Each template defines:
  - Initial visibility (what player sees immediately)
  - Hidden aspects (what requires investigation)
  - Required investigation actions
  - Clue generation rules
  - Weapon/method relationship

**Validation:**
- All death types have complete templates
- Templates specify clear investigation paths
- Clue generation aligns with scenario

---

## Step 2.2: Discovery Mechanics

**Goal:** Implement progressive discovery based on player investigation

**Files to Modify:**
- `src/narrative/beats/hero-journey/call-to-adventure.js` - Multi-stage discovery
- `src/systems/clue-generator.js` - Scenario-aware clue seeding

**Implementation Details:**
- Call to Adventure can repeat if player investigates
- First visit: See basic scene, obvious details
- Investigation choices unlock hidden details
- "Investigate body" reveals method-specific clues
- "Examine surroundings" reveals contextual clues
- "Recall memories" reveals victim's last moments
- Each investigation can reveal 0-2 clues based on scenario
- Some scenarios require multiple investigations

**Validation:**
- Player can choose to investigate or move on
- Investigation reveals previously hidden information
- Different scenarios show different investigation paths
- Clues discovered affect mystery state

---

## Step 2.3: Weapon Flexibility

**Goal:** Support deaths where weapon isn't immediately apparent

**Files to Modify:**
- `src/systems/mystery-generator.js` - Conditional weapon generation
- `src/prompts/hero/callToAdventure.js` - Conditional weapon references

**Implementation Details:**
- Some scenarios have no physical weapon (fall, poison, etc.)
- Weapon field can be null or "Unknown" initially
- Investigation can reveal weapon later
- Method vs. weapon distinction (strangling: hands are method, rope might be weapon)
- Prompt templates handle missing weapon gracefully
- Weapon discovery can be a clue itself

**Validation:**
- Some mysteries start without known weapon
- Investigation can reveal weapon
- Mystery solvable even if weapon unknown
- Prompts adapt to weapon presence/absence

---

## Step 2.4: Scene Variation

**Goal:** Randomize corpse location and presentation

**Files to Modify:**
- `src/systems/death-scenario-generator.js` - Add location generator
- `src/systems/mystery-generator.js` - Use varied locations

**Implementation Details:**
- Pool of death locations based on scope:
  - INTIMATE: home, garden, well, barn
  - REGIONAL: temple, marketplace, manor, bridge
  - NATIONAL: palace, battlefield, cathedral
  - COSMIC: divine realm, astral plane, god's sanctum
- Location affects available clues and atmosphere
- Some scenarios pair with specific locations
- Location details stored in memory context

**Validation:**
- Different playthroughs show different locations
- Locations appropriate to story scope
- Location details appear in prompts
- Clues reference location elements

