import type { GameState, PlayerState, PlayerType } from '../types/game';
import { BOARD_LAYOUT, START_POSITION } from '../data/boardLayout';
import { getValidMoves } from './rules/movementRules';

const PLAYER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
const PLAYER_NAMES = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

export function createInitialState(playerCount: number, playerTypes: PlayerType[]): GameState {
  const players: PlayerState[] = Array.from({ length: playerCount }, (_, i) => ({
    id: i,
    name: PLAYER_NAMES[i],
    type: playerTypes[i],
    color: PLAYER_COLORS[i],
    position: { ...START_POSITION },
    lastPosition: undefined,
    gold: 3,
    lifelines: 3,
    collectedShards: [],
    highestShard: 0,
    inventory: [],
    bridges: 0,
    hasMarried: false,
    isEliminated: false,
  }));

  const baseState: GameState = {
    phase: 'ACQUIRE',
    board: BOARD_LAYOUT,
    players,
    currentPlayerIndex: 0,
    turnNumber: 1,
    tileOccupancy: {},
    pendingDiceRolls: [],
    log: [],
    validMoves: [],
    winner: undefined,
  };

  return {
    ...baseState,
    validMoves: getValidMoves(baseState, 0),
  };
}
