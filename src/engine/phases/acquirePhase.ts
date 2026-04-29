import type { GameState, LogEntry } from '../../types/game';
import type { GameAction } from '../../types/actions';
import { ITEM_CATALOG } from '../../data/itemCatalog';
import { isAdjacentToCity } from '../rules/movementRules';

function addLog(state: GameState, message: string): LogEntry[] {
  return [...state.log, { turn: state.turnNumber, playerId: state.currentPlayerIndex, message }];
}

export function acquirePhaseReducer(state: GameState, action: GameAction): GameState {
  const player = state.players[state.currentPlayerIndex];

  if (action.type === 'SKIP_ACQUIRE') {
    return { ...state, phase: 'DEPLOYMENT' };
  }

  if (action.type === 'ACQUIRE_ITEM') {
    const item = ITEM_CATALOG[action.payload.item];

    // Validate: must be adjacent to city (except bridge can only be built near river — we keep it simple: any city adjacency)
    if (!isAdjacentToCity(state, state.currentPlayerIndex)) {
      return { ...state, log: addLog(state, `${player.name}: must be near a city to acquire items`) };
    }

    if (player.gold < item.cost) {
      return { ...state, log: addLog(state, `${player.name}: not enough gold for ${item.displayName}`) };
    }

    if (item.oncePerGame && player.hasMarried) {
      return { ...state, log: addLog(state, `${player.name}: Marriage Alliance already used this game`) };
    }

    const updatedPlayer = {
      ...player,
      gold: player.gold - item.cost,
      inventory: [...player.inventory, action.payload.item],
    };

    const updatedPlayers = state.players.map(p => p.id === player.id ? updatedPlayer : p);
    return {
      ...state,
      players: updatedPlayers,
      log: addLog(state, `${player.name} acquired ${item.displayName} (-${item.cost} gold)`),
    };
  }

  return state;
}
