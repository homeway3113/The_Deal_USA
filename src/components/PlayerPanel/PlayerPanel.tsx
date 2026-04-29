import type { PlayerState } from '../../types/game';
import styles from './PlayerPanel.module.css';

interface PlayerPanelProps {
  player: PlayerState;
  isActive: boolean;
}

export function PlayerPanel({ player, isActive }: PlayerPanelProps) {
  return (
    <div className={[
      styles.panel,
      isActive ? styles.active : '',
      player.isEliminated ? styles.eliminated : '',
    ].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <div className={styles.dot} style={{ backgroundColor: player.color }} />
        <span className={styles.name}>{player.name}</span>
        <span className={styles.typeBadge}>{player.type}</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Gold</span>
          <span className={styles.statValue}>⬡ {player.gold}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Lifelines</span>
          <span className={styles.statValue}>{'❤'.repeat(player.lifelines)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Shards</span>
          <span className={styles.statValue}>{player.collectedShards.length}/16</span>
        </div>
        {player.bridges > 0 && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Bridges</span>
            <span className={styles.statValue}>{player.bridges}</span>
          </div>
        )}
      </div>

      <div className={styles.shardSection}>
        <h4>Shards collected</h4>
        <div className={styles.shardGrid}>
          {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
            <div
              key={n}
              className={`${styles.shardBadge} ${player.collectedShards.includes(n) ? styles.collected : ''}`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {isActive && <div className={styles.turnIndicator}>Your turn</div>}
    </div>
  );
}
