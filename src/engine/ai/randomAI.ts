import type { GameState } from '../../types/game';
import type { GameAction } from '../../types/actions';
import { ITEM_CATALOG, ITEMS_BY_CATEGORY } from '../../data/itemCatalog';
import { isAdjacentToCity } from '../rules/movementRules';
import { rollD6 } from '../rules/combatRules';

export function getAIAction(state: GameState): GameAction {
  const player = state.players[state.currentPlayerIndex];

  switch (state.phase) {
    case 'ACQUIRE': {
      if (isAdjacentToCity(state, state.currentPlayerIndex)) {
        const allItems = [
          ...ITEMS_BY_CATEGORY.negotiation,
          ...ITEMS_BY_CATEGORY.movement,
          ...ITEMS_BY_CATEGORY.defense,
          ...ITEMS_BY_CATEGORY.attack,
        ].filter(id => {
          const def = ITEM_CATALOG[id];
          if (def.cost > player.gold) return false;
          if (def.oncePerGame && player.hasMarried) return false;
          return true;
        });

        if (allItems.length > 0 && Math.random() > 0.5) {
          const pick = allItems[Math.floor(Math.random() * allItems.length)];
          return { type: 'ACQUIRE_ITEM', payload: { item: pick } };
        }
      }
      return { type: 'SKIP_ACQUIRE' };
    }

    case 'DEPLOYMENT': {
      if (player.inventory.length > 0) {
        const item = player.inventory[0];
        return { type: 'DEPLOY_ITEM', payload: { item, position: player.position } };
      }
      return { type: 'SKIP_DEPLOYMENT' };
    }

    case 'RESOLUTION': {
      if (state.pendingDiceRolls.length > 0) {
        return { type: 'RESOLVE_DICE', payload: { roll: rollD6() } };
      }
      return { type: 'ADVANCE_PHASE' };
    }

    case 'MOVEMENT': {
      const moves = state.validMoves;
      if (moves.length === 0) return { type: 'SKIP_MOVEMENT' };
      const pick = moves[Math.floor(Math.random() * moves.length)];
      return { type: 'MOVE_PLAYER', payload: { position: pick } };
    }

    case 'INCOME':
      return { type: 'ADVANCE_PHASE' };

    default:
      return { type: 'ADVANCE_PHASE' };
  }
}
