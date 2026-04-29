import type { GameState, LogEntry } from '../../types/game';
import type { GameAction } from '../../types/actions';
import { ITEM_CATALOG } from '../../data/itemCatalog';
import type { DeployedUnit } from '../../types/items';

function addLog(state: GameState, message: string): LogEntry[] {
  return [...state.log, { turn: state.turnNumber, playerId: state.currentPlayerIndex, message }];
}

function posKey(row: number, col: number) {
  return `${row},${col}`;
}

export function deploymentPhaseReducer(state: GameState, action: GameAction): GameState {
  const player = state.players[state.currentPlayerIndex];

  if (action.type === 'SKIP_DEPLOYMENT') {
    return { ...state, phase: 'RESOLUTION' };
  }

  if (action.type === 'DEPLOY_ITEM') {
    const { item, position } = action.payload;
    const def = ITEM_CATALOG[item];

    if (!player.inventory.includes(item)) {
      return state;
    }

    // Bridges go to player inventory (consumed on movement)
    if (item === 'BRIDGE') {
      const updatedPlayer = {
        ...player,
        bridges: player.bridges + 1,
        inventory: player.inventory.filter((_, i) => {
          const idx = player.inventory.indexOf(item);
          return i !== idx;
        }),
      };
      return {
        ...state,
        players: state.players.map(p => p.id === player.id ? updatedPlayer : p),
        phase: 'RESOLUTION',
        log: addLog(state, `${player.name} acquired a Bridge (usable when crossing river)`),
      };
    }

    // Build units/buildings on tile
    const key = posKey(position.row, position.col);
    const existing = state.tileOccupancy[key] ?? { units: [], controlledBy: undefined };

    const quantity = def.quantity ?? 1;
    const newUnits: DeployedUnit[] = Array.from({ length: quantity }, () => ({
      itemId: item,
      hp: def.hp ?? 1,
      ownerId: player.id,
    }));

    const updatedOccupancy = {
      ...state.tileOccupancy,
      [key]: {
        ...existing,
        units: [...existing.units, ...newUnits],
        controlledBy: def.category === 'negotiation' ? player.id : existing.controlledBy,
      },
    };

    const firstIdx = player.inventory.indexOf(item);
    const newInventory = player.inventory.filter((_, i) => i !== firstIdx);
    const updatedPlayer = {
      ...player,
      inventory: newInventory,
      hasMarried: item === 'MARRIAGE' ? true : player.hasMarried,
    };

    return {
      ...state,
      players: state.players.map(p => p.id === player.id ? updatedPlayer : p),
      tileOccupancy: updatedOccupancy,
      log: addLog(state, `${player.name} deployed ${def.displayName} at (${position.row},${position.col})`),
    };
  }

  return state;
}
