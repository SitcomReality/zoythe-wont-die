import { MACGUFFIN_STATUS } from "../config/constants.js";

const PRIMARY_MACGUFFINS = [
  {
    id: "amulet-eternal-harvest",
    name: "Amulet of Eternal Harvest",
    description: "A golden pendant that reverses blight and famine",
    counters: ["famine", "blight", "crop-failure"],
    bindingEffect: "Your hands glow with verdant light, compelling you homeward"
  },
  {
    id: "orb-unpoisoned-waters",
    name: "Orb of Unpoisoned Waters",
    description: "A crystalline sphere that purifies any liquid it touches",
    counters: ["poisoned-wells", "tainted-water", "god-blood-pollution"],
    bindingEffect: "The orb pulses with your heartbeat, pulling you toward home"
  },
  {
    id: "veil-piercer-amulet",
    name: "Veil-Piercer Amulet",
    description: "An obsidian charm that breaks eternal darkness",
    counters: ["eternal-night", "shadow-curse", "light-theft"],
    bindingEffect: "Shadows flee from you, but you feel the weight of home's darkness"
  },
  {
    id: "shard-first-dawn",
    name: "Shard of the First Dawn",
    description: "A fragment of primordial light that ends eternal winter",
    counters: ["endless-winter", "divine-frost", "frozen-land"],
    bindingEffect: "Warmth radiates from your chest, yearning for your frozen home"
  },
  {
    id: "chalice-pure-springs",
    name: "Chalice of Pure Springs",
    description: "A silver cup that cleanses god-blood corruption",
    counters: ["god-blood-pollution", "divine-plague", "corrupted-land"],
    bindingEffect: "The chalice whispers names of those you left behind"
  },
  {
    id: "binding-crown",
    name: "Binding Crown",
    description: "An iron circlet that stabilizes rifts between worlds",
    counters: ["reality-rifts", "dimensional-tears", "void-breaches"],
    bindingEffect: "The crown tightens, showing you visions of collapsing home"
  },
  {
    id: "heartstone-last-grove",
    name: "Heartstone of the Last Grove",
    description: "A living seed-stone that heals forest rot and decay",
    counters: ["forest-rot", "nature-death", "divine-withering"],
    bindingEffect: "Roots grow beneath your skin, pulling toward sacred soil"
  },
  {
    id: "starfall-compass",
    name: "Starfall Compass",
    description: "A navigational artifact for traversing shattered heavens",
    counters: ["celestial-chaos", "star-death", "navigation-curse"],
    bindingEffect: "The needle always points home, no matter how you turn"
  }
];

const BACKUP_MACGUFFINS = [
  {
    id: "ancestor-locket",
    name: "Ancestor Locket",
    description: "A small medallion containing the voices of the departed",
    effect: "Brings emotional closure but cannot stop physical threats",
    bindingEffect: "You hear your family calling across the void"
  },
  {
    id: "fragment-broken-god",
    name: "Fragment of a Broken God",
    description: "A shard of divine essence, unstable but potent",
    effect: "Grants temporary power at great personal cost",
    bindingEffect: "The fragment burns in your soul, demanding sacrifice"
  },
  {
    id: "oath-token",
    name: "Oath Token",
    description: "A promise made manifest, binding fate itself",
    effect: "Ensures one crucial vow is kept, no matter the cost",
    bindingEffect: "Your word becomes iron chains pulling you forward"
  }
];

const HOME_THREATS = [
  {
    id: "famine",
    name: "Great Famine",
    description: "The crops have failed for three seasons",
    escalation: "Now even the animals are dying"
  },
  {
    id: "poisoned-wells",
    name: "Poisoned Wells",
    description: "Divine blood has seeped into the water table",
    escalation: "The poison spreads to the surrounding lands"
  },
  {
    id: "eternal-night",
    name: "Eternal Night",
    description: "The sun has not risen in weeks",
    escalation: "Cold and darkness devour all warmth"
  },
  {
    id: "endless-winter",
    name: "Endless Winter",
    description: "Unnatural frost grips the land year-round",
    escalation: "The ice advances daily, swallowing homes"
  },
  {
    id: "reality-rifts",
    name: "Reality Rifts",
    description: "Tears in the world allow otherworldly horrors through",
    escalation: "The rifts widen, threatening to consume everything"
  },
  {
    id: "divine-plague",
    name: "Divine Plague",
    description: "A god's death curse spreads as sickness",
    escalation: "The plague mutates, growing more virulent"
  }
];

export function generateMacGuffin({ rng, threatId }) {
  const threat = HOME_THREATS.find(t => t.id === threatId) || rng.pick(HOME_THREATS);
  
  const compatible = PRIMARY_MACGUFFINS.filter(m => 
    m.counters.includes(threat.id)
  );
  
  const primary = compatible.length > 0 
    ? rng.pick(compatible)
    : rng.pick(PRIMARY_MACGUFFINS);
  
  const backup = rng.pick(BACKUP_MACGUFFINS);
  
  return {
    threat,
    primary,
    backup
  };
}

export function getHomeThreat(threatId) {
  return HOME_THREATS.find(t => t.id === threatId);
}

export function getPrimaryMacGuffin(id) {
  return PRIMARY_MACGUFFINS.find(m => m.id === id);
}

export function getBackupMacGuffin(id) {
  return BACKUP_MACGUFFINS.find(m => m.id === id);
}