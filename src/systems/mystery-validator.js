export function ensureSolvable(mystery) {
  // Basic validation for Phase 1
  
  if (!mystery.killerId) return false;
  if (!mystery.weapon) return false;
  if (mystery.suspects.size < 2) return false;
  
  const clues = Array.from(mystery.clues.all.values());
  
  // Must have at least one clue pointing to killer
  const killerClues = clues.filter(c => c.relatedSuspectIds.includes(mystery.killerId));
  if (killerClues.length === 0) return false;

  return true;
}