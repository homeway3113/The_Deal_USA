import { useState } from 'react';
import type { PlayerType } from '../../types/game';
import type { GameAction } from '../../types/actions';
import styles from './Lobby.module.css';

const PLAYER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];

interface LobbyProps {
  dispatch: (action: GameAction) => void;
}

export function Lobby({ dispatch }: LobbyProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerTypes, setPlayerTypes] = useState<PlayerType[]>(['HUMAN', 'HUMAN', 'HUMAN', 'HUMAN']);

  const toggleType = (idx: number) => {
    setPlayerTypes(prev => {
      const next = [...prev];
      next[idx] = next[idx] === 'HUMAN' ? 'AI' : 'HUMAN';
      return next;
    });
  };

  const handleStart = () => {
    dispatch({
      type: 'START_GAME',
      payload: {
        playerCount,
        playerTypes: playerTypes.slice(0, playerCount),
      },
    });
  };

  return (
    <div className={styles.lobby}>
      <div className={styles.crown}>♛</div>
      <h1 className={styles.title}>Crown of Arkaditya</h1>
      <p className={styles.subtitle}>Amradvīpa awaits its sovereign</p>

      <div className={styles.lore}>
        <em>
          "I see no king among you — yet. Whoever reforges the Crown of Arkaditya shall rule
          Amradvīpa for a thousand years — he and his heirs. Go forth. Forge your destiny."
        </em>
        <br /><br />
        Seize the 16 shards scattered across the land. Raise armies, build castles, forge alliances —
        and crush your rivals before they unite the Crown.
      </div>

      <div className={styles.setupCard}>
        <h2>Number of Heirs</h2>
        <div className={styles.countRow}>
          {[2, 3, 4].map(n => (
            <button
              key={n}
              className={`${styles.countBtn} ${playerCount === n ? styles.active : ''}`}
              onClick={() => setPlayerCount(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <h2>Heirs</h2>
        <div className={styles.playerRows}>
          {Array.from({ length: playerCount }, (_, i) => (
            <div key={i} className={styles.playerRow}>
              <div className={styles.playerDot} style={{ backgroundColor: PLAYER_COLORS[i] }} />
              <span className={styles.playerLabel}>Player {i + 1}</span>
              <div className={styles.typeToggle}>
                <button
                  className={`${styles.typeBtn} ${playerTypes[i] === 'HUMAN' ? styles.active : ''}`}
                  onClick={() => playerTypes[i] !== 'HUMAN' && toggleType(i)}
                >
                  Human
                </button>
                <button
                  className={`${styles.typeBtn} ${playerTypes[i] === 'AI' ? styles.active : ''}`}
                  onClick={() => playerTypes[i] !== 'AI' && toggleType(i)}
                >
                  AI
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.startBtn} onClick={handleStart}>
          Begin the Conquest
        </button>
      </div>
    </div>
  );
}
