Zoythe in the Supernal Interregnum

A compact, replayable, browser-based narrative game that procedurally drives a Hero’s Journey through the dying-god setting of the Supernal Interregnum. Driven by an AI storyteller, the system rails the player through classic beats while allowing meaningful, trackable choices that shape the protagonist subtype (epic, tragic, redemptive, reluctant, romantic), the world’s tone, and the ending.

    Goal: Deliver a MacGuffin to your isolated home to end the Interregnum’s fallout.
    Mechanics: State-driven narrative beats with quantified player choice classification, adaptive railroading, and replayable variance.
    Tech constraint: Weekend jam scope—single-session experience (15–25 minutes), minimal art, text-first UI, and a developer panel that exposes and customizes prompts and rails.

Core loop

    The Narrative Engine selects the next story beat based on Act and state.
    The Prompt Builder assembles a prompt referencing the beat, state, constraints, and recent history.
    The LLM Provider (or Jam Mode) generates the page content and choices.
    Choices are parsed and classified into action types (bold, cautious, refusal, mercy, etc.).
    The Railroad Trigger Engine checks conditions and can insert or rewrite content to keep the arc intact.
    State updates (heroism, subtype, relationships, inventory, world tags) and the loop repeats.

Supported player subtypes

    Epic hero, Reluctant hero, Redemptive arc, Romantic arc, Tragic arc.
    Determined by choice patterns, heroism score, and key Resurrection choice.

Supported acts and pages

    Act I: Ordinary World (1–3), Call to Adventure (3), Crossing the Threshold (4–5)
    Act II: Road of Tests/Allies/Enemies (6–9), The Ordeal (10–11), Reward (12)
    Act III: The Road Back (13–14), The Resurrection (15–16), Return with the Elixir (17–18)

Quantifiable state variables

    Heroism Score: integer; rises with bold/helpful actions; influences test difficulty and boon quality.
    Arc Subtype: enum among epic, reluctant, redemptive, romantic, tragic (emergent; can be influenced).
    Refusal Count: increments when players decline calls; nudges “reluctant” and triggers divine fallout.
    Resolve: integer; rises with courageous choices; boosts success chances in social/diplomatic tests.
    Relationships: map of NPCs with a numeric value and a state (ally, enemy, neutral, love interest).
    Inventory: list (MacGuffin pieces, key items).
    World Tags: current Interregnum effects (blood rain, ghost armies, quaking ground, etc.).
    Home Threat Level: escalation index tied to the central problem at the start (e.g., famine).
    MacGuffin Status: primary, backup, destroyed, missing, acquired, bound.

Choice classification taxonomy

    Movement: advance, retreat
    Action: fight, flee, parley, stealth
    Ethic: mercy, cruelty, sacrifice
    Engagement: accept quest, refuse quest, seek mentor, build alliance, betray ally
    Approach to Ordeal: direct, cautious, clever

MacGuffin generation

    Primary MacGuffin: picked or generated to directly counter the initial threat at the isolated home (e.g., “Amulet of Eternal Harvest” for blight, “Orb of Unpoisoned Waters” for poison).
    Backup MacGuffin: consolation prize that addresses a side-arc or relationship (e.g., “Ancestor Locket” that eases grief but doesn’t stop famine).
    Binding property: the boon imprints the player with a godly essence that compels return.

Procedural but consistent content

    Tests and enemies scale with heroism and resolve.
    Interregnum effects vary by page but always push plot forward.
    Failures escalate and loop back with added pressure (divine enforcers, omens).
    If derailment is detected, railroad triggers insert “visions, curses, or rifts” to realign.

User-facing goals

    Experience a cohesive, replayable hero’s journey with clear consequences.
    See the system’s rails and prompts to understand how choices shape the story.
    Customize the experience via a developer panel (seed, prompt emphasis, rail strictness, developer mode).

Developer-facing goals

    Keep the AI/LLM interface plug-and-play and transparent.
    Ensure robust fallbacks: timeouts, invalid responses

Core modules (logical groupings)

    Core Engine
        State Manager: tracks all quantitative state and ensures atomic updates.
        Seed Manager: initializes and manages RNG for deterministic variance.
        Narrative Engine: selects the next beat (Act/Page) and hands off to Prompt Builder.
        Prompt Builder: composes beat-specific prompts with constraints, recent history, and state references.
        Content Generator: pluggable provider (LLM Provider).
        Choice Parser and Classifier: parses freeform input and classifies into taxonomy.
        Railroad Trigger Engine: evaluates thresholds and injects rails or rewrites.
        Narrative Renderer: assembles text, choices, and rails into UI-friendly data.
        Logger and Telemetry: records prompts, choices, classifications, and rail triggers.

    UI and Interaction
        UI Controller: orchestrates DOM updates, panels, and input handling.
        Accessibility Controller: ensures keyboard navigation, color contrast, and screen-reader-friendly output.

    Persistence and Testing
        Save/Load: serializes state to local storage or file.
        QA Tools: seed replay, force-beat jump, and prompt log review.

LLM Provider interface (pluggable)

    sendPrompt(payload): payload includes beat, state summary, recent history, and developer emphasis.
    Expected response format (JSON-like):
    {
    "pageTitle": "string",
    "body": "rich text",
    "choices": [
    { "label": "string", "classification": "enum", "delta": { "heroism": int, "resolve": int, ... }, "notes": "string" }
    ],
    "railsInvoked": ["string list if any"],
    "railNotes": "optional rationale",
    "debug": { "promptEcho": "string", "tokensUsed": int }
    }

Railroad heuristics and triggers

    Refusal of the Call: if player refuses 2+ times or Home Threat crosses threshold, insert escalating fallout and force departure via rift/vision.
    Meeting the Mentor: if player seeks guidance, insert a dying god-spirit that offers clues or a backup MacGuffin.
    Allies/Enemies Twists: mercy on an enemy raises relationship; betrayal triggers divine curse and escalates tests.
    Approach to the Inmost Cave: cautious approach reduces combat difficulty but increases puzzle/social complexity.
    Temptation on the Road Back: offers from surviving gods; resisting boosts heroism and improves ending.
    Interregnum Converges at Ordeal: if player stalls, collapse divine barriers, trapping them at the heart of the storm.

Failure handling

    If content generation fails: unfortunately the story cannot continue until content generation succeeds. The point of this project is to tell a procedurally generated story using the LLM.
    If choice is impossible: troped response (e.g., “Your hubris draws divine wrath, accelerating the Ordeal”), apply a negative delta and continue.
    If response JSON is invalid: request a minimal valid object with at least “choices”; degrade gracefully.

State transitions by act

    Act I: establish home threat; Call to Adventure; forced departure if refused.
    Act II: trials, allies/enemies, Ordeal (no escape), Reward (boon binds the player).
    Act III: Road Back (pursuit/temptations), Resurrection (defining choice), Return with Elixir (resolution and transformation).

Endings and subtypes

    Epic: high heroism, bold choices, triumphant delivery of the MacGuffin; positive world effect with visible godly scars.
    Reluctant: multiple refusals; forced departure; resilient but guarded success or bittersweet victory.
    Redemptive: mercy and reconciliation choices; final showdown focuses on forgiveness; healing extends beyond the MacGuffin.
    Romantic: love-interest flag set; Resurrection choice leans into union or sacrifice; the ending reflects shared rebirth.
    Tragic: repeated refusals or harmful choices; MacGuffin lost or only a backup retrieved; self-sacrifice or noble failure closes the arc.

Developer Panel (heavy customization and transparency)

    Prompt Viewer: shows the last N prompts sent to the generator, with toggles to display/hide.
    Prompt Editor: adjust emphasis fields (e.g., “tone: grim, relationships: strong, rail strictness: medium”).
    Seed Controls: set/get seed; randomize; replay from seed.
    Rail Strictness: slider from permissive to strict (more proactive rail insertions).
    Tone and Focus: toggles (grim/hopeful, combat-heavy/puzzle-light, ally-centric/ lone-wolf).
    Developer Mode: exposes state inspector (numbers, tags, inventory), jump-to-beat, force trigger rail, inject mentor, inject trial.
    LLM Provider Settings: endpoint URL, API key (if applicable), model selection, temperature, max tokens, timeout.
    Jam Mode: switch to template-driven; preview available content by beat.

Player experience

    Main narrative area with title, text, and choices.
    Choices presented as clickable options; free-text input allowed with classification.
    A subtle “Rails Invoked” indicator when the system injects narrative constraints.
    Accessibility: keyboard navigation, high contrast mode, text size controls.

Replayability levers

    New seeds for different MacGuffins, gods, and Interregnum effects.
    Choice taxonomy nudges toward different subtypes; multiple runs recommended.
    Backup MacGuffin paths produce alternate epilogues.

MacGuffin pools (examples)

    Amulet of Eternal Harvest (blight/famine)
    Orb of Unpoisoned Waters (poison/wells)
    Veil-Piercer Amulet (eternal night)
    Shard of the First Dawn (endless winter)
    Chalice of Pure Springs (divine blood pollution)
    Binding Crown (stabilize localized rifts)
    Heartstone of the Last Grove (forest rot)
    Starfall Compass (navigation across shattered heavens)

Starting archetypes (procedurally varied)

    Farmer, Orphan, Hermit, Fisher, Scribe, Beastkeeper, Desert Wanderer

Pantheon factions and Interregnum effects (seeded)

    Verdant Court: vine-storms, blood sap
    Iron Choir: bell-avalanches, shard-winds
    Salt Kings: brine tsunamis, bone tempests
    Pale Ledger: ash snow, glass hail

Edge cases and guardrails

    “I give up”: divine curse binds the player; refusal deepens the quest and nudges toward reluctant/tragic.
    “Kill a god early”: hubris draws wrath; Ordeal advances and tests escalate.
    Stalls at the Ordeal: divine barriers collapse; no escape, forcing resolution.

Scope constraints

    18 pages maximum per run, fixed act structure.
    Minimal UI; keyboard and mouse support only.
    AI integration via a simple JSON protocol
    Autosave at key beats; manual save/load.

Success criteria

    Players complete a run in 15–25 minutes.
    The system maintains arc integrity via rail triggers without erasing meaningful choice.
    Replays feel meaningfully different through seed variance and subtype shifts.
    Developer panel is clear and useful for fast iteration

Telemetry hooks (for designers and testing)

    Record per-choice classification and deltas.
    Track subtypes emerging by end and correlate to early choices.
    Monitor rail triggers frequency to balance strictness.
    Capture prompt templates and lengths to inform token budgets.

Example beat snippets (to convey tone and structure)

    Call to Adventure: “God-blood poisons your well. A spectral herald appears: ‘Seek the Chalice of Pure Springs in the shattered heavens.’ Accept boldly, refuse and fortify home, or seek a mentor’s counsel.”
    The Ordeal: “Divine barriers crumble. You cannot flee— the Interregnum’s heart beats here. Choose a path: dare the god’s crumbling throne, solve the dying riddle, or bargain with a remnant spirit.”
    Resurrection: “Back near home, the MacGuffin thrums. Your father demands it. Stand up (assertive), show mercy (redemptive), or sacrifice yourself (tragic rebirth).”
    Return with the Elixir: “You deliver the MacGuffin. The blight breaks, but the heavens never forget. You are changed— a savior with godly scars.”

Narrative, mechanics, and systems alignment

    Every element ties to dying gods and the Interregnum.
    State variables are used explicitly in prompts and rail triggers.
    Choices feed both story outcomes and subtype formation.
    The interface between narrative and mechanics is the normalized JSON response, the state machine, and the rail engine’s thresholds.

Accessibility considerations

    High contrast theme toggle.
    Text size controls.
    Keyboard navigation for choices and developer panel.
    Screen-reader-friendly labels for panels and actions.

Future scalability

    Expand template pools for longer arcs or side quests.
    Add a content authoring tool that emits JSON beats consumable by the engine.
    Introduce a richer relationship graph and multiple home locations.
