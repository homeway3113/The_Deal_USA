import { Board, Position } from './board';
import { ItemType, DeployedUnit } from './items';

export type Phase =
  | 'LOBBY'
  | 'ACQUIRE'
  | 'DEPLOYMENT'
  | 'RESOLUTION'
  | 'MOVEMENT'
  | 'INCOME'
  | 'GAME_OVER';

export type PlayerType = 'HUMAN' | 'AI';

export interface PlayerState {
  id: number;
  name: string;
  type: PlayerType;
  color: string;
  position: Position;
  lastPosition?: Position;
  gold: number;
  lifelines: number;
  collectedShards: number[];
  highestShard: number;
  inventory: ItemType[];
  bridges: number;
  hasMarried: boolean;
  isEliminated: boolean;
}

export interface TileOccupancy {
  units: DeployedUnit[];
  controlledBy?: number;
}

export interface DiceRoll {
  rollerId: number;
  targetId?: number;
  type: 'COMBAT' | 'NEGOTIATION';
  diceMax: number;
  context: string;
  itemId?: ItemType;
}

export interface LogEntry {
  turn: number;
  playerId: number;
  message: string;
}

export interface GameState {
  phase: Phase;
  board: Board;
  players: PlayerState[];
  currentPlayerIndex: number;
  turnNumber: number;
  tileOccupancy: Record<string, TileOccupancy>;
  pendingDiceRolls: DiceRoll[];
  lastDiceResult?: number;
  log: LogEntry[];
  validMoves: Position[];
  winner?: number;
}
