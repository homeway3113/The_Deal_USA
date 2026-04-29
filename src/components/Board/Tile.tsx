import type { Tile as TileData, Position } from '../../types/board';
import type { DeployedUnit } from '../../types/items';
import type { PlayerState } from '../../types/game';
import styles from './Board.module.css';

interface TileProps {
  tile: TileData;
  position: Position;
  players: PlayerState[];
  units: DeployedUnit[];
  isValidMove: boolean;
  isSelected: boolean;
  onClick: (pos: Position) => void;
}

const PLAYER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];

export function TileComponent({ tile, position, players, units, isValidMove, isSelected, onClick }: TileProps) {
  const playersHere = players.filter(
    p => !p.isEliminated && p.position.row === position.row && p.position.col === position.col
  );

  const tileClass = [
    styles.tile,
    styles[`tile_${tile.type.toLowerCase()}`],
    isValidMove ? styles.tile_valid : '',
    isSelected ? styles.tile_selected : '',
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (isValidMove || tile.type === 'START' || tile.type === 'SHARD' || tile.type === 'CITY' || tile.type === 'EMPTY') {
      onClick(position);
    }
  };

  return (
    <div className={tileClass} onClick={handleClick}>
      <span className={styles.tileLabel}>
        {tile.type === 'SHARD' && tile.shardNumber}
        {tile.type === 'CITY' && 'C'}
        {tile.type === 'START' && '★'}
        {tile.type === 'RIVER' && '≋'}
        {tile.type === 'MOUNTAIN' && '▲'}
      </span>
      <div className={styles.tileUnits}>
        {units.map((u, i) => (
          <span
            key={i}
            className={styles.unit}
            style={{ backgroundColor: PLAYER_COLORS[u.ownerId] ?? '#888' }}
            title={`${u.itemId} (HP: ${u.hp})`}
          >
            {u.itemId === 'CASTLE' ? '🏰' : u.itemId === 'WATCHTOWER' ? '🗼' : u.itemId === 'FORTIFIED_WALL' ? '🧱' : '⚔'}
          </span>
        ))}
      </div>
      <div className={styles.tilePlayers}>
        {playersHere.map(p => (
          <span
            key={p.id}
            className={styles.playerToken}
            style={{ backgroundColor: p.color }}
            title={p.name}
          >
            {p.name[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
