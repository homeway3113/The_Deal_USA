import { useEffect, useRef } from 'react';
import type { LogEntry } from '../../types/game';
import styles from './GameLog.module.css';

interface GameLogProps {
  log: LogEntry[];
  playerColors: string[];
}

export function GameLog({ log, playerColors }: GameLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

  return (
    <div className={styles.log}>
      {log.length === 0 && <span style={{ color: '#8b5e3c', fontStyle: 'italic' }}>The chronicle begins…</span>}
      {log.map((entry, i) => (
        <div key={i} className={styles.entry}>
          <span className={styles.turnBadge}>T{entry.turn}</span>
          <span style={{ color: playerColors[entry.playerId] ?? '#f5e4a0' }}>
            {entry.message}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
