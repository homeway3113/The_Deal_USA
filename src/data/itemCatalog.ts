import type { ItemDefinition, ItemType } from '../types/items';

export const ITEM_CATALOG: Record<ItemType, ItemDefinition> = {
  FEAST: {
    id: 'FEAST', displayName: 'Feast', cost: 1,
    category: 'negotiation', diceThreshold: 2,
  },
  FESTIVAL: {
    id: 'FESTIVAL', displayName: 'Festival', cost: 2,
    category: 'negotiation', diceThreshold: 3,
  },
  TEMPLE: {
    id: 'TEMPLE', displayName: 'Temple', cost: 3,
    category: 'negotiation', diceThreshold: 4, permanent: true,
  },
  MARRIAGE: {
    id: 'MARRIAGE', displayName: 'Marriage Alliance', cost: 0,
    category: 'negotiation', diceThreshold: 3, oncePerGame: true,
  },
  BRIDGE: {
    id: 'BRIDGE', displayName: 'Bridge', cost: 4,
    category: 'movement',
  },
  WATCHTOWER: {
    id: 'WATCHTOWER', displayName: 'Watchtower', cost: 1,
    category: 'defense', hp: 2, attackDiceMax: 2,
  },
  FORTIFIED_WALL: {
    id: 'FORTIFIED_WALL', displayName: 'Fortified Wall', cost: 3,
    category: 'defense', hp: 3,
  },
  CASTLE: {
    id: 'CASTLE', displayName: 'Castle', cost: 5,
    category: 'defense', hp: 5, attackDiceMax: 3, range: 1,
  },
  MERCENARY: {
    id: 'MERCENARY', displayName: 'Mercenaries (×2)', cost: 1,
    category: 'attack', hp: 1, attackDiceMax: 1, quantity: 2,
  },
  BATTERING_RAM: {
    id: 'BATTERING_RAM', displayName: 'Battering Ram', cost: 2,
    category: 'attack', hp: 1, attackDiceMax: 2,
  },
  ARMORED_ELEPHANT: {
    id: 'ARMORED_ELEPHANT', displayName: 'Armored Elephant', cost: 3,
    category: 'attack', hp: 2, attackDiceMax: 3,
  },
};

export const ITEMS_BY_CATEGORY = {
  negotiation: ['FEAST', 'FESTIVAL', 'TEMPLE', 'MARRIAGE'] as ItemType[],
  movement: ['BRIDGE'] as ItemType[],
  defense: ['WATCHTOWER', 'FORTIFIED_WALL', 'CASTLE'] as ItemType[],
  attack: ['MERCENARY', 'BATTERING_RAM', 'ARMORED_ELEPHANT'] as ItemType[],
};
