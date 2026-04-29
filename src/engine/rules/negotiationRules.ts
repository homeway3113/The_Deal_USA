import type { ItemType } from '../../types/items';
import { ITEM_CATALOG } from '../../data/itemCatalog';

export function resolveNegotiation(itemId: ItemType, roll: number): boolean {
  const def = ITEM_CATALOG[itemId];
  if (!def.diceThreshold) return false;
  return roll <= def.diceThreshold;
}
