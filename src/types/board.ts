export type TileType = 'EMPTY' | 'SHARD' | 'CITY' | 'RIVER' | 'START' | 'MOUNTAIN';

export interface Tile {
  type: TileType;
  shardNumber?: number;
  riverDirection?: 'VERTICAL' | 'HORIZONTAL';
}

export type Board = Tile[][];

export interface Position {
  row: number;
  col: number;
}
