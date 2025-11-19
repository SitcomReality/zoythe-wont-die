Zoythe in the Supernal Interregnum – Consolidated Game Design Document

1. Core Concept

"Zoythe in the Supernal Interregnum" is a compact, replayable, browser-based narrative RPG / interactive fiction that drives a structured Hero’s Journey through a world where the gods are dying and their wars spill into the mortal realm.

Players inhabit an ordinary person in an isolated home (village, outpost, etc.) thrust into an extraordinary quest: retrieve and deliver a MacGuffin (a divine artifact) back home to end or transform the Interregnum’s fallout.

The experience blends:
- Fixed narrative structure (18-page Hero’s Journey: Acts I–III).
- Procedural variation (MacGuffins, tests, world events, NPCs, Interregnum effects).
- State-driven, meaningful choices that shape:
  - Heroism and choice taxonomy (bold, cautious, merciful, defiant, etc.).
  - Protagonist subtype (epic, tragic, redemptive, reluctant, romantic).
  - World tone (somber, hopeful, bittersweet, nihilistic, mythic).
  - Relationships (mentors, rivals, love interests).
  - Endings and epilogues.

Scope targeting:
- Single-session run: ~15–25 minutes.
- Text-first, minimal-art UI.
- Strong developer-facing tools for seeds, prompts, and rails (jam-friendly).

2. Narrative Structure & Acts

The game uses a modified 18-page Hero’s Journey with a fixed act/page skeleton but procedural content per run.

Act I – Ordinary World & Call
- Pages 1–3: Ordinary World
  - Establish isolated home, initial threat, and protagonist’s mundane life.
  - Introduce the Interregnum’s local fallout (e.g., poisoned wells, famine, ash snow).
- Page 3: Call to Adventure
  - A herald/vision or divine sign reveals the MacGuffin and the path to the shattered heavens.
  - Options allow acceptance, refusal, or seeking guidance.
- Pages 4–5: Crossing the Threshold
  - Player commits or is forced to leave home.
  - Divine railroads (visions, curses, disasters) can enforce departure after repeated refusals.

Act II – Tests, Allies, Enemies, Ordeal, Reward
- Pages 6–9: Road of Tests / Allies / Enemies
  - Procedural challenges: puzzles, combats, negotiations, environmental hazards.
  - Introduction and evolution of allies, mentors, rivals, or love interests.
  - Interregnum effects escalate (blood rain, ghost armies, divine rifts, etc.).
- Pages 10–11: The Ordeal
  - Climax at the heart of the Interregnum or a god-shattered domain.
  - Multiple approaches (direct, cautious, clever, diplomatic) with distinct risk profiles.
- Page 12: Reward
  - The MacGuffin is acquired, transformed, or broken.
  - Binding property: the boon marks the protagonist with godly essence that compels return.
  - backup MacGuffin possibilities if the primary is lost or corrupted.

Act III – Road Back, Resurrection, Return with the Elixir
- Pages 13–14: The Road Back
  - Return journey toward home under pursuit, temptation, or divine bargaining.
  - Surviving gods and factions offer deals that can corrupt or elevate the hero.
- Pages 15–16: The Resurrection
  - Pivotal, identity-defining choice, often framed by relationships (family, mentor, lover, rival).
  - Determines final subtype tilt (epic, reluctant, redemptive, romantic, tragic).
- Pages 17–18: Return with the Elixir
  - Delivery (or loss) of the MacGuffin and resolution of the home threat.
  - Ending tone and epilogue text reflect heroism, subtype, relationships, and world tone.

3. Procedural Systems

3.1 MacGuffin Generation

- Primary MacGuffin:
  - Seeded or randomly selected to directly counter the initial home threat.
  - Examples:
    - Amulet of Eternal Harvest – reverses blight/famine.
    - Orb of Unpoisoned Waters – purifies poisoned wells.
    - Veil-Piercer Amulet – breaks eternal night.
    - Shard of the First Dawn – ends endless winter.
    - Chalice of Pure Springs – cleanses god-blood pollution.
    - Binding Crown – stabilizes localized rifts.
    - Heartstone of the Last Grove – heals forest rot.
    - Starfall Compass – safely navigates shattered heavens.
- Backup MacGuffin:
  - Fallback artifact when the primary is lost, corrupted, or partially obtained.
  - Offers partial or localized resolution, often more personal/relationship-oriented.
  - Example: Ancestor Locket that brings emotional closure but cannot stop famine.
- Binding Property:
  - The MacGuffin imprints the hero with a godly essence.
  - Mechanically encourages progression and return: visions, compulsions, and world reactivity.

3.2 World Events & Interregnum Effects

- Seeded pools of divine fallout tied to factions and tone:
  - Verdant Court: vine-storms, blood sap, choking growth.
  - Iron Choir: bell-avalanches, shard-winds, metallic hymns.
  - Salt Kings: brine tsunamis, bone tempests, salt deserts.
  - Pale Ledger: ash snow, glass hail, ledger-spirits counting sins.
- Events appear as:
  - Environmental set pieces in beats (weather, sky omens).
  - Direct challenges (hazards, time pressure, curses).
  - Narrative signals of escalation when the player hesitates or refuses.

3.3 Tests, Allies, Enemies, NPCs

- Tests:
  - Types: puzzle (runes, patterns), combat (god-tainted beasts, zealots), social (diplomacy, bargaining, persuasion).
  - Outcomes: adjust heroism, resolve, relationships, and world tags; branch future test difficulty and flavor.
- NPCs:
  - Roles: Mentor, Love Interest, Rival, Ally, Enemy, Divine Remnant.
  - Each has:
    - Name and short descriptor.
    - Role tag and relationship flag (ally/enemy/neutral/love-interest).
    - Simple numeric relationship score that evolves through choices.
- Procedural variation:
  - Which roles appear, how they relate to the MacGuffin and home, and how they return in later acts.

4. State & Systems Design

4.1 Core State Variables

- Heroism Score:
  - Integer tracking bold/selfless vs. fearful/selfish patterns.
  - Influences:
    - Test difficulty and boon quality.
    - Access to certain bold or sacrificial options.
- Arc Subtype:
  - Enum: epic, reluctant, redemptive, romantic, tragic.
  - Emergent from:
    - Choice taxonomy patterns (bold, refusal, mercy, sacrifice, etc.).
    - Heroism and resolve over time.
    - Key Resurrection (Act III) choice.
- Refusal Count:
  - Tracks how often calls or major beats are refused.
  - Triggers escalating divine fallout and railroading (visions, curses, forced rifts) after thresholds.
- Resolve:
  - Integer reflecting inner courage and mental fortitude.
  - Affects success chances in social/diplomatic tests and willingness to face the Ordeal directly.
- Relationships:
  - Map keyed by NPC id:
    - { name, role, type (ally/enemy/neutral/love-interest), score (int) }.
  - Feeds into beat-specific options (betray, confess, reconcile, sacrifice).
- Inventory:
  - List of items: MacGuffin(s), key artifacts, blessings, curses, tokens.
- World Tags:
  - Current Interregnum effects, escalations, and home threat descriptors.
  - Used to color beats and endings.
- Home Threat Level:
  - Escalation index reflecting how bad things are at home.
  - Increases over time, especially on refusals or failures.
- MacGuffin Status:
  - Enum: primary, backup, destroyed, missing, acquired, bound.
  - Shapes late-act beats and endings.

4.2 Choice Classification Taxonomy

Each choice (button or parsed text) is tagged with one or more classifications:

- Movement: advance, retreat.
- Action: fight, flee, parley, stealth.
- Ethic: mercy, cruelty, sacrifice.
- Engagement: accept quest, refuse quest, seek mentor, build alliance, betray ally.
- Approach to Ordeal: direct, cautious, clever.

These classifications:
- Drive state updates (heroism, resolve, relationships, flags).
- Contribute to subtype evaluation.
- Feed railroad triggers (e.g., repeated refusal = reluctant/tragic pressure).

4.3 Subtype Evaluation & World Tone

- Subtypes:
  - Epic: high heroism, bold choices, ambition and resolve; often triumphant but scarred outcome.
  - Reluctant: repeated refusals, slow commitment, survival-focused; success feels earned yet guarded or bittersweet.
  - Redemptive: mercy, forgiveness, and reconciliation choices; endings emphasize healing and restored bonds.
  - Romantic: strong love-interest relationship; key sacrifices or unions at Resurrection; endings emphasize shared rebirth or loss.
  - Tragic: repeated refusals or harmful/selfish choices; MacGuffin broken or misused; noble failure or corrupted rise.
- World Tone:
  - Somber, hopeful, bittersweet, nihilistic, mythic.
  - Influenced by:
    - Devotion, doubt, compassion, and overall heroism.
    - Major beat outcomes (saving vs. sacrificing, mercy vs. cruelty).
  - Used by the narrative to adjust mood, imagery, and ending flavor.

5. Railroad & Failure Handling

5.1 Divine Railroad Heuristics

To maintain arc integrity while preserving meaningful choice:

- Refusal of the Call:
  - If Refusal Count ≥ threshold or Home Threat Level crosses key points:
    - Insert visions of ruin, curses, or localized disasters.
    - Eventually force departure (rifts open, home becomes untenable, or a god drags the hero).
- Meeting the Mentor:
  - Triggered when the player seeks guidance or hits specific failure patterns.
  - A dying god-spirit or scarred mortal mentor appears:
    - Provides critical information, a backup MacGuffin, or a shortcut with a cost.
- Allies/Enemies Twists:
  - Mercy on enemies can flip them to allies or future saviors.
  - Betraying allies or breaking oaths triggers divine curses and escalated tests.
- Approach to the Ordeal:
  - Direct approach: higher risk, higher reward; more epic potential.
  - Cautious approach: lower immediate risk; more puzzles/social complexity.
  - Clever approach: more reliance on resolve and relationships.
- Road Back Temptations:
  - Surviving gods and factions offer tempting shortcuts or power.
  - Resisting deepens heroism and improves endings; accepting may tilt toward tragic or corruption arcs.
- Stalling at Key Beats:
  - If the player tries to evade the Ordeal or Resolution:
    - Interregnum barriers collapse, trapping them in a forced resolution scenario.

5.2 Failure & Robustness

- If content generation fails (in AI-driven mode):
  - The story cannot progress until valid content is produced; UI communicates the stall.
- If a chosen action is impossible:
  - Troped fallback: divine wrath or environmental collapse pushes the story forward with a negative delta.
- If AI response JSON is invalid:
  - Request minimal valid object (title/body/choices) and degrade gracefully.
- Jam Mode:
  - Template-driven fallback content by beat id, used when AI is unavailable or for rapid iteration.

6. Technical Architecture

6.1 Core Engine Modules

- State Manager:
  - Central authority on player, world, narrative, and RNG state.
  - Ensures atomic updates and reproducible runs via seeds.
- Seed Manager / RNG:
  - Initializes deterministic RNG from a seed.
  - Feeds procedural generators (MacGuffins, NPCs, events).
- Narrative Engine:
  - Maintains act/page progression.
  - Selects the next beat based on structure and state.
  - Delegates to Prompt Builder / templates.
- Prompt Builder:
  - Composes prompts (when using LLM) from:
    - Current beat (act/page).
    - State summary (heroism, subtype, relationships, tone, tags).
    - Recent history (last N beats and key choices).
    - Developer emphasis settings (e.g., grim vs. hopeful).
- Content Generator (LLM Provider):
  - Pluggable interface, with a simple JSON-like contract:
    {
      "pageTitle": "string",
      "body": "rich text",
      "choices": [
        { "label": "string", "classification": "enum or list", "delta": { ... }, "notes": "string" }
      ],
      "railsInvoked": ["string"],
      "railNotes": "optional rationale",
      "debug": { "promptEcho": "string", "tokensUsed": int }
    }
- Choice Parser & Classifier:
  - For button-based and (optionally) free-text inputs:
    - Maps to internal taxonomy (movement, action, ethic, engagement, approach).
    - Produces deltas for state updates.
- Railroad Trigger Engine:
  - Evaluates thresholds (refusals, stalled progress, high threat).
  - Injects or rewrites content: visions, curses, mentor interventions, forced transitions.
- Narrative Renderer:
  - Converts engine output into UI-friendly data:
    - Title, body, choice list.
    - Optional “rails invoked” indicator for transparency.
- Logger & Telemetry:
  - Records prompts, responses, chosen options, classifications, and rail triggers.
  - Enables designers to tune rail strictness and token budgets.

6.2 UI & Interaction

- Core Player UI:
  - Narrative Panel:
    - Displays beat title and 1–2 paragraphs of text.
  - Choice Buttons:
    - 2–4 clearly labeled options per beat; optional hints/subtext for tone.
    - Keyboard- and touch-friendly; no scrolling where possible.
  - State Visualization:
    - Compact display of:
      - Current subtype.
      - World tone.
      - Beat index / page progress.
    - Optional compact indicators for heroism and relationships (for later).
  - Inventory Summary:
    - Minimal presentation for MacGuffin status and key items if space allows.
- Developer Panel (debug mode):
  - Prompt Viewer:
    - Shows recent prompts and AI responses with toggles to hide/show.
  - Prompt Editor:
    - Controls emphasis (tone, focus on relationships vs. action, rail strictness).
  - Seed Controls:
    - Set/get seed; randomize; replay from seed.
  - Rail Strictness:
    - Slider from permissive to strict; affects railroad trigger thresholds.
  - Tone & Focus:
    - Toggles: grim/hopeful, combat-heavy/puzzle-light, ally-centric/lone-wolf.
  - State Inspector:
    - Numeric state variables, world tags, inventory, relationship summaries.
  - Tools:
    - Jump-to-beat, force-rail trigger, inject mentor/trial, toggle Jam Mode.
  - LLM Settings:
    - Endpoint/model selection, temperature, max tokens, timeout.

6.3 Persistence & Testing

- Save/Load:
  - Lightweight autosave at key beats.
  - Optionally serialize state to local storage or file (per seed).
- QA Tools:
  - Seed replay: reproduce a run by seed and configuration.
  - Force-beat jump: test individual beats and arcs quickly.
  - Prompt log review: inspect prompts and AI responses for tuning.

7. Endings & Replayability

7.1 Ending Types (High-Level)

Final outcomes are determined by:
- Heroism score.
- MacGuffin status (primary, backup, lost/destroyed).
- Subtype (epic, reluctant, redemptive, romantic, tragic).
- World tone.
- Key relationship flags (especially love interest and mentor).

Representative ending clusters:
- Epic Victory:
  - High heroism, bold/direct choices, primary MacGuffin delivered.
  - Home’s crisis resolved; hero becomes a legend scarred by divine touch.
- Redemptive Sacrifice:
  - Mercy and reconciliation dominate; crucial forgiveness at Resurrection.
  - Hero sacrifices power, safety, or self to heal more than the initial threat.
- Tragic Defeat:
  - Low heroism or harmful/avoidant patterns; refusals and betrayals.
  - MacGuffin broken or only backup obtained; home or world falls, often with noble last choices.
- Bittersweet Resolution:
  - Mixed choices; partial success; serious costs.
  - Home survives but is changed; hero’s scars and losses are foregrounded.
- Divine Corruption:
  - Defiant or self-serving choices; deals with dying gods.
  - Hero ascends or mutates into a new godlike presence, dooming or reshaping the world.

7.2 Replayability Levers

- New seeds:
  - Different MacGuffins, NPCs, Interregnum effects, and event combinations each run.
- Choice Taxonomy:
  - Different playstyles naturally steer toward different subtypes and endings.
- Backup MacGuffin Paths:
  - Alternate late-game arcs and epilogues when the primary path fails.
- Developer Controls:
  - Designers and players experimenting with debug tools can explore many permutations quickly.

8. Player & Designer Experience Goals

Player-facing goals:
- Experience a cohesive, mythic hero’s journey in a short, replayable session.
- Feel that every choice matters, even under visible divine rails.
- Understand, at a glance, how their actions shape their hero’s subtype and the world’s tone.

Designer/developer goals:
- Keep the AI/LLM integration modular, testable, and replaceable.
- Provide robust fallbacks (Jam Mode, rail templates) so the game remains playable under failures.
- Offer clear telemetry and debug tools to tune:
  - Rail strictness and intervention frequency.
  - Token usage and prompt structure.
  - The balance between player freedom and narrative arc integrity.