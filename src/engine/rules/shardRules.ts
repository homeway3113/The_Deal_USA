import type { GameState } from '../../types/game';

export function canPickupShard(state: GameState, playerId: number): boolean {
  const player = state.players[playerId];
  const { row, col } = player.position;
  const tile = state.board[row][col];

  if (tile.type !== 'SHARD' || tile.shardNumber === undefined) return false;
  if (player.collectedShards.includes(tile.shardNumber)) return false;

  // Check if enemy has a castle here
  const key = `${row},${col}`;
  const occ = state.tileOccupancy[key];
  if (occ?.units.some(u => u.ownerId !== playerId && u.itemId === 'CASTLE')) return false;

  // Sequential constraint
  if (player.collectedShards.length === 0) return true;

  const n = tile.shardNumber;
  return n === player.highestShard + 1 || n === player.highestShard - 1;
}

export function getShardAtPosition(state: GameState, playerId: number): number | undefined {
  const player = state.players[playerId];
  const tile = state.board[player.position.row][player.position.col];
  if (tile.type === 'SHARD') return tile.shardNumber;
  return undefined;
}

export function isWinner(state: GameState, playerId: number): boolean {
  return state.players[playerId].collectedShards.length === 16;
}
