import type { GameState, LogEntry } from '../../types/game';
import type { GameAction } from '../../types/actions';
import { getValidMoves } from '../rules/movementRules';
import { canPickupShard, isWinner } from '../rules/shardRules';
import { getCastleRangeThreat } from '../rules/combatRules';
import { ITEM_CATALOG } from '../../data/itemCatalog';

function addLog(state: GameState, message: string): LogEntry[] {
  return [...state.log, { turn: state.turnNumber, playerId: state.currentPlayerIndex, message }];
}

function posKey(row: number, col: number) {
  return `${row},${col}`;
}

export function movementPhaseReducer(state: GameState, action: GameAction): GameState {
  const player = state.players[state.currentPlayerIndex];

  if (action.type === 'SKIP_MOVEMENT') {
    return { ...state, phase: 'INCOME' };
  }

  if (action.type === 'MOVE_PLAYER') {
    const { position } = action.payload;
    const validKeys = new Set(state.validMoves.map(p => posKey(p.row, p.col)));
    if (!validKeys.has(posKey(position.row, position.col))) {
      return state;
    }

    const oldPos = player.position;
    const crossingRiver = Math.abs(position.col - oldPos.col) > 1 || Math.abs(position.row - oldPos.row) > 1;

    let updatedPlayer = {
      ...player,
      position,
      lastPosition: oldPos,
      bridges: crossingRiver ? player.bridges - 1 : player.bridges,
    };

    let newState: GameState = {
      ...state,
      players: state.players.map(p => p.id === player.id ? updatedPlayer : p),
      log: addLog(state, `${player.name} moved to (${position.row},${position.col})`),
    };

    // Try to pick up shard
    if (canPickupShard(newState, player.id)) {
      const tile = newState.board[position.row][position.col];
      if (tile.shardNumber !== undefined) {
        const shardNum = tile.shardNumber;
        updatedPlayer = {
          ...updatedPlayer,
          collectedShards: [...updatedPlayer.collectedShards, shardNum],
          highestShard: Math.max(updatedPlayer.highestShard, shardNum),
        };
        newState = {
          ...newState,
          players: newState.players.map(p => p.id === player.id ? updatedPlayer : p),
          log: addLog(newState, `${player.name} collected Shard #${shardNum}!`),
        };
      }
    }

    // Check win
    if (isWinner(newState, player.id)) {
      return { ...newState, phase: 'GAME_OVER', winner: player.id };
    }

    // Check castle range threats — queue dice rolls
    const threats = getCastleRangeThreat(newState, player.id);
    if (threats.length > 0) {
      const castleRolls = threats.flatMap(key => {
        const occ = newState.tileOccupancy[key];
        return occ?.units.filter(u => u.itemId === 'CASTLE' && u.ownerId !== player.id).map(castle => ({
          rollerId: castle.ownerId,
          targetId: player.id,
          type: 'COMBAT' as const,
          diceMax: ITEM_CATALOG['CASTLE'].attackDiceMax!,
          context: `Castle defense at ${key}`,
        })) ?? [];
      });
      newState = { ...newState, pendingDiceRolls: [...newState.pendingDiceRolls, ...castleRolls], phase: 'RESOLUTION' };
    } else {
      newState = { ...newState, phase: 'INCOME' };
    }

    // Recompute valid moves for next turn
    newState = { ...newState, validMoves: getValidMoves(newState, player.id) };

    return newState;
  }

  return state;
}
