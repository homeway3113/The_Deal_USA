import { BOARD_LAYOUT } from '../../data/boardLayout';
import type { Position } from '../../types/board';
import type { GameState } from '../../types/game';
import { TileComponent } from './Tile';
import styles from './Board.module.css';

interface BoardProps {
  gameState: GameState;
  onTileClick: (pos: Position) => void;
}

function posKey(pos: Position) {
  return `${pos.row},${pos.col}`;
}

export function Board({ gameState, onTileClick }: BoardProps) {
  const { players, validMoves, tileOccupancy } = gameState;
  const validSet = new Set(validMoves.map(posKey));

  return (
    <div className={styles.board}>
      {BOARD_LAYOUT.flatMap((row, r) =>
        row.map((tile, c) => {
          const pos: Position = { row: r, col: c };
          const key = posKey(pos);
          const units = tileOccupancy[key]?.units ?? [];
          return (
            <TileComponent
              key={key}
              tile={tile}
              position={pos}
              players={players}
              units={units}
              isValidMove={validSet.has(key)}
              isSelected={false}
              onClick={onTileClick}
            />
          );
        })
      )}
    </div>
  );
}
