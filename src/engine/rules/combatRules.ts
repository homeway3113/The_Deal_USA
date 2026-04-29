import type { DeployedUnit } from '../../types/items';
import type { PlayerState, GameState } from '../../types/game';
import { ITEM_CATALOG } from '../../data/itemCatalog';

export function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export interface CombatResult {
  attackerHits: number;
  defenderHits: number;
  log: string[];
}

export function resolveCombat(
  attacker: PlayerState,
  attackerUnits: DeployedUnit[],
  defender: PlayerState | null,
  defenderUnits: DeployedUnit[],
): CombatResult {
  const log: string[] = [];
  let attackerHits = 0;
  let defenderHits = 0;

  // Player base attack (roll 1 on d6)
  const pRoll = rollD6();
  if (pRoll === 1) {
    attackerHits++;
    log.push(`${attacker.name} rolled ${pRoll} — HIT!`);
  } else {
    log.push(`${attacker.name} rolled ${pRoll} — miss`);
  }

  // Attacker units
  for (const unit of attackerUnits) {
    const def = ITEM_CATALOG[unit.itemId];
    if (!def.attackDiceMax) continue;
    const r = rollD6();
    if (r <= def.attackDiceMax) {
      attackerHits++;
      log.push(`${def.displayName} rolled ${r} — HIT!`);
    } else {
      log.push(`${def.displayName} rolled ${r} — miss`);
    }
  }

  // Defender structures with attack
  for (const unit of defenderUnits) {
    const def = ITEM_CATALOG[unit.itemId];
    if (!def.attackDiceMax) continue;
    const r = rollD6();
    if (r <= def.attackDiceMax) {
      defenderHits++;
      log.push(`${def.displayName} (defense) rolled ${r} — HIT!`);
    } else {
      log.push(`${def.displayName} (defense) rolled ${r} — miss`);
    }
  }

  if (defender) {
    const dRoll = rollD6();
    if (dRoll === 1) {
      defenderHits++;
      log.push(`${defender.name} (defender) rolled ${dRoll} — HIT!`);
    } else {
      log.push(`${defender.name} (defender) rolled ${dRoll} — miss`);
    }
  }

  return { attackerHits, defenderHits, log };
}

export function getCastleRangeThreat(state: GameState, playerId: number): string[] {
  const player = state.players[playerId];
  const { row, col } = player.position;
  const threats: string[] = [];

  // Check all tiles within 1 tile for enemy castles
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const key = `${row + dr},${col + dc}`;
      const occ = state.tileOccupancy[key];
      if (!occ) continue;
      const castle = occ.units.find(u => u.ownerId !== playerId && u.itemId === 'CASTLE');
      if (castle) threats.push(key);
    }
  }
  return threats;
}
