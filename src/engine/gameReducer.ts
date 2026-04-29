import type { GameState } from '../types/game';
import type { GameAction } from '../types/actions';
import { createInitialState } from './initialState';
import { acquirePhaseReducer } from './phases/acquirePhase';
import { deploymentPhaseReducer } from './phases/deploymentPhase';
import { resolutionPhaseReducer } from './phases/resolutionPhase';
import { movementPhaseReducer } from './phases/movementPhase';
import { incomePhase } from './phases/incomePhase';

export const LOBBY_STATE: GameState = {
  phase: 'LOBBY',
  board: [],
  players: [],
  currentPlayerIndex: 0,
  turnNumber: 1,
  tileOccupancy: {},
  pendingDiceRolls: [],
  log: [],
  validMoves: [],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'START_GAME') {
    return createInitialState(action.payload.playerCount, action.payload.playerTypes);
  }

  if (state.phase === 'GAME_OVER') return state;

  switch (state.phase) {
    case 'ACQUIRE':
      if (action.type === 'ACQUIRE_ITEM' || action.type === 'SKIP_ACQUIRE') {
        return acquirePhaseReducer(state, action);
      }
      break;

    case 'DEPLOYMENT':
      if (action.type === 'DEPLOY_ITEM' || action.type === 'SKIP_DEPLOYMENT') {
        return deploymentPhaseReducer(state, action);
      }
      break;

    case 'RESOLUTION':
      if (action.type === 'TRIGGER_DICE' || action.type === 'RESOLVE_DICE' || action.type === 'SKIP_DEPLOYMENT') {
        return resolutionPhaseReducer(state, action);
      }
      // If no pending rolls, auto-advance
      if (state.pendingDiceRolls.length === 0 && action.type === 'ADVANCE_PHASE') {
        return { ...state, phase: 'MOVEMENT' };
      }
      break;

    case 'MOVEMENT':
      if (action.type === 'MOVE_PLAYER' || action.type === 'SKIP_MOVEMENT') {
        return movementPhaseReducer(state, action);
      }
      break;

    case 'INCOME':
      return incomePhase(state);
  }

  // ADVANCE_PHASE generic fallback
  if (action.type === 'ADVANCE_PHASE') {
    const phaseOrder: GameState['phase'][] = ['ACQUIRE', 'DEPLOYMENT', 'RESOLUTION', 'MOVEMENT', 'INCOME'];
    const idx = phaseOrder.indexOf(state.phase as typeof phaseOrder[number]);
    if (idx >= 0 && idx < phaseOrder.length - 1) {
      return { ...state, phase: phaseOrder[idx + 1] };
    }
  }

  return state;
}
