import type { GameState, LogEntry } from '../../types/game';
import { getValidMoves } from '../rules/movementRules';

function addLog(state: GameState, message: string): LogEntry[] {
  return [...state.log, { turn: state.turnNumber, playerId: state.currentPlayerIndex, message }];
}

export function incomePhase(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex];
  const income = player.collectedShards.length;
  const updatedPlayer = { ...player, gold: player.gold + income };

  let newState: GameState = {
    ...state,
    players: state.players.map(p => p.id === player.id ? updatedPlayer : p),
    log: income > 0 ? addLog(state, `${player.name} collected ${income} gold (income)`) : state.log,
  };

  // Advance to next player
  const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
  const nextTurn = nextIndex === 0 ? state.turnNumber + 1 : state.turnNumber;

  newState = {
    ...newState,
    phase: 'ACQUIRE',
    currentPlayerIndex: nextIndex,
    turnNumber: nextTurn,
  };

  // Recompute valid moves for the new current player
  newState = {
    ...newState,
    validMoves: getValidMoves(newState, nextIndex),
  };

  return newState;
}
