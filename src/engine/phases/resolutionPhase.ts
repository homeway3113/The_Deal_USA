import type { GameState, LogEntry } from '../../types/game';
import type { GameAction } from '../../types/actions';
import { resolveNegotiation } from '../rules/negotiationRules';

function addLog(state: GameState, message: string): LogEntry[] {
  return [...state.log, { turn: state.turnNumber, playerId: state.currentPlayerIndex, message }];
}

export function resolutionPhaseReducer(state: GameState, action: GameAction): GameState {
  const player = state.players[state.currentPlayerIndex];

  if (action.type === 'SKIP_DEPLOYMENT') {
    return { ...state, phase: 'RESOLUTION' };
  }

  if (action.type === 'TRIGGER_DICE') {
    return {
      ...state,
      pendingDiceRolls: [...state.pendingDiceRolls, {
        rollerId: state.currentPlayerIndex,
        type: action.payload.type,
        diceMax: action.payload.diceMax,
        context: action.payload.context,
        itemId: action.payload.itemId,
      }],
    };
  }

  if (action.type === 'RESOLVE_DICE') {
    const [current, ...remaining] = state.pendingDiceRolls;
    if (!current) return { ...state, phase: 'MOVEMENT' };

    const roll = action.payload.roll;
    let logMsg = `${player.name} rolled ${roll} for ${current.context}`;
    let newState = { ...state, pendingDiceRolls: remaining, lastDiceResult: roll };

    if (current.type === 'NEGOTIATION' && current.itemId) {
      const success = resolveNegotiation(current.itemId, roll);
      logMsg += success ? ' — SUCCESS! City cooperates.' : ' — FAILED. City refuses.';
      if (success) {
        const key = `${player.position.row},${player.position.col}`;
        const existing = newState.tileOccupancy[key] ?? { units: [] };
        newState = {
          ...newState,
          tileOccupancy: {
            ...newState.tileOccupancy,
            [key]: { ...existing, controlledBy: player.id },
          },
        };
      }
    } else if (current.type === 'COMBAT') {
      const success = roll <= current.diceMax;
      logMsg += success ? ' — HIT!' : ' — miss';
    }

    newState = { ...newState, log: addLog(newState, logMsg) };
    if (remaining.length === 0) {
      newState = { ...newState, phase: 'MOVEMENT' };
    }
    return newState;
  }

  return state;
}
