export type ItemType =
  | 'FEAST'
  | 'FESTIVAL'
  | 'TEMPLE'
  | 'MARRIAGE'
  | 'BRIDGE'
  | 'WATCHTOWER'
  | 'FORTIFIED_WALL'
  | 'CASTLE'
  | 'MERCENARY'
  | 'BATTERING_RAM'
  | 'ARMORED_ELEPHANT';

export interface ItemDefinition {
  id: ItemType;
  displayName: string;
  cost: number;
  category: 'negotiation' | 'movement' | 'defense' | 'attack';
  hp?: number;
  attackDiceMax?: number;
  range?: number;
  diceThreshold?: number;
  oncePerGame?: boolean;
  permanent?: boolean;
  quantity?: number;
}

export interface DeployedUnit {
  itemId: ItemType;
  hp: number;
  ownerId: number;
}
