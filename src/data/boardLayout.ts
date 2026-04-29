import type { Board, Tile } from '../types/board';

const E: Tile = { type: 'EMPTY' };
const C: Tile = { type: 'CITY' };
const RV: Tile = { type: 'RIVER', riverDirection: 'VERTICAL' };
const RH: Tile = { type: 'RIVER', riverDirection: 'HORIZONTAL' };
const S: Tile = { type: 'START' };
const shard = (n: number): Tile => ({ type: 'SHARD', shardNumber: n });

//                col: 0          1    2          3    4           5           6
export const BOARD_LAYOUT: Board = [
  /* row 0 */ [shard(12),   C,   E,   RV,  shard(14),  C,          E        ],
  /* row 1 */ [shard(4),    C,   E,   RV,  C,          C,          E        ],
  /* row 2 */ [C,           C,   E,   RV,  shard(7),   C,          E        ],
  /* row 3 */ [shard(9),    C,   E,   RV,  C,          C,          E        ],
  /* row 4 */ [C,           C,   S,   RV,  shard(8),   C,          E        ],
  /* row 5 */ [shard(2),    C,   E,   RV,  C,          shard(3),   E        ],
  /* row 6 */ [C,           C,   E,   RV,  C,          C,          E        ],
  /* row 7 */ [shard(10),   C,   shard(5), RH, shard(1), C,        shard(15)],
  /* row 8 */ [shard(13),   C,   shard(11), RH, shard(6), C,       shard(16)],
];

export const BOARD_ROWS = BOARD_LAYOUT.length;
export const BOARD_COLS = BOARD_LAYOUT[0].length;

export const START_POSITION = { row: 4, col: 2 };
