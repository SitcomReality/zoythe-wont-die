export function ensureSolvable(mystery) {
  const issues = [];
  const { suspects, killerId, weapon, clues } = mystery;

  // 1. Check: At least 3 clues point to the killer
  const killerClues = Array.from(clues.all.values()).filter(
    clue => clue.truthValue && clue.relatedSuspectIds.includes(killerId)
  );

  if (killerClues.length < 3) {
    issues.push(`Only ${killerClues.length} true clues point to killer (need at least 3)`);
  }

  // 2. Check: Each innocent suspect has at least 1 clue that rules them out or breaks their false alibi
  const innocentSuspects = Array.from(suspects.values()).filter(s => s.id !== killerId);

  for (const suspect of innocentSuspects) {
    // If they have a false alibi, there should be a clue that breaks it
    if (!suspect.alibi.isTrue && suspect.alibi.breakCondition) {
      const hasBreakingClue = Array.from(clues.all.values()).some(
        clue => clue.id === suspect.alibi.breakCondition || 
                clue.label.includes(suspect.name)
      );

      if (!hasBreakingClue) {
        issues.push(`Suspect ${suspect.name} has false alibi but no breaking clue`);
      }
    }
  }

  // 3. Check: Weapon is accessible (has discoverable clues)
  const weaponClues = Array.from(clues.all.values()).filter(
    clue => clue.label.toLowerCase().includes("weapon") || 
            clue.description.includes(weapon.name)
  );

  if (weaponClues.length === 0) {
    issues.push("No clues reference the murder weapon");
  }

  // 4. Check: Clues are distributed across tiers
  const tier1Count = Array.from(clues.all.values()).filter(c => c.tier === 1).length;
  const tier2Count = Array.from(clues.all.values()).filter(c => c.tier === 2).length;
  const tier3Count = Array.from(clues.all.values()).filter(c => c.tier === 3).length;

  if (tier1Count === 0 || tier2Count === 0 || tier3Count === 0) {
    issues.push(`Unbalanced clue distribution: T1=${tier1Count}, T2=${tier2Count}, T3=${tier3Count}`);
  }

  return {
    valid: issues.length === 0,
    issues
  };
}