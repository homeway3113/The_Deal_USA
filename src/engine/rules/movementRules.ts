import type { Board, Position } from '../../types/board';
import type { GameState } from '../../types/game';
import { BOARD_ROWS, BOARD_COLS } from '../../data/boardLayout';

function posKey(p: Position) {
  return `${p.row},${p.col}`;
}

function inBounds(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_ROWS && pos.col >= 0 && pos.col < BOARD_COLS;
}

function isRiver(board: Board, pos: Position): boolean {
  return inBounds(pos) && board[pos.row][pos.col].type === 'RIVER';
}

export function getValidMoves(state: GameState, playerId: number): Position[] {
  const player = state.players[playerId];
  const { row, col } = player.position;
  const board = state.board;
  const lastKey = player.lastPosition ? posKey(player.lastPosition) : null;
  const results: Position[] = [];

  const orthogonal: Position[] = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ];

  for (const pos of orthogonal) {
    if (!inBounds(pos)) continue;
    if (lastKey && posKey(pos) === lastKey) continue;

    const tile = board[pos.row][pos.col];
    if (tile.type === 'MOUNTAIN') continue;

    if (isRiver(board, pos)) {
      // With a bridge, player can jump over the river to the tile beyond
      if (player.bridges > 0) {
        const beyond: Position = {
          row: row + (pos.row - row) * 2,
          col: col + (pos.col - col) * 2,
        };
        if (inBounds(beyond) && board[beyond.row][beyond.col].type !== 'RIVER' && board[beyond.row][beyond.col].type !== 'MOUNTAIN') {
          if (!lastKey || posKey(beyond) !== lastKey) {
            results.push(beyond);
          }
        }
      }
      continue;
    }

    results.push(pos);
  }

  return results;
}

export function canAttackDiagonal(state: GameState, playerId: number): Position[] {
  const player = state.players[playerId];
  const { row, col } = player.position;
  const board = state.board;
  const diagonals: Position[] = [
    { row: row - 1, col: col - 1 },
    { row: row - 1, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col: col + 1 },
  ];

  return diagonals.filter(pos => {
    if (!inBounds(pos)) return false;
    const tile = board[pos.row][pos.col];
    if (tile.type === 'RIVER' || tile.type === 'MOUNTAIN') return false;
    // Only if there's an enemy player here
    return state.players.some(p => p.id !== playerId && !p.isEliminated &&
      p.position.row === pos.row && p.position.col === pos.col);
  });
}

export function isAdjacentToCity(state: GameState, playerId: number): boolean {
  const player = state.players[playerId];
  const { row, col } = player.position;
  const board = state.board;

  const tile = board[row][col];
  if (tile.type === 'CITY' || tile.type === 'START') return true;

  const neighbors: Position[] = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ];
  return neighbors.some(pos => inBounds(pos) && board[pos.row][pos.col].type === 'CITY');
}
