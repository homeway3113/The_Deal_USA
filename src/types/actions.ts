import { Position } from './board';
import { ItemType } from './items';
import { PlayerType } from './game';

export type GameAction =
  | { type: 'START_GAME'; payload: { playerCount: number; playerTypes: PlayerType[] } }
  | { type: 'ACQUIRE_ITEM'; payload: { item: ItemType } }
  | { type: 'SKIP_ACQUIRE' }
  | { type: 'DEPLOY_ITEM'; payload: { item: ItemType; position: Position } }
  | { type: 'SKIP_DEPLOYMENT' }
  | { type: 'TRIGGER_DICE'; payload: { diceMax: number; context: string; type: 'COMBAT' | 'NEGOTIATION'; itemId?: ItemType } }
  | { type: 'RESOLVE_DICE'; payload: { roll: number } }
  | { type: 'MOVE_PLAYER'; payload: { position: Position } }
  | { type: 'SKIP_MOVEMENT' }
  | { type: 'ADVANCE_PHASE' };
