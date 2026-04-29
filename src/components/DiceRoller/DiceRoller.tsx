import { useState } from 'react';
import type { DiceRoll } from '../../types/game';
import { ITEM_CATALOG } from '../../data/itemCatalog';
import styles from './DiceRoller.module.css';

const DIE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

interface DiceRollerProps {
  roll: DiceRoll;
  onRoll: (result: number) => void;
}

export function DiceRoller({ roll, onRoll }: DiceRollerProps) {
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const doRoll = () => {
    if (rolling || result !== null) return;
    setRolling(true);
    const r = Math.floor(Math.random() * 6) + 1;
    setTimeout(() => {
      setResult(r);
      setRolling(false);
    }, 450);
  };

  const confirm = () => {
    if (result !== null) onRoll(result);
  };

  const success = result !== null && result <= roll.diceMax;
  const dieFace = result !== null ? DIE_FACES[result - 1] : '🎲';

  const thresholdLabel = roll.type === 'NEGOTIATION' && roll.itemId
    ? `Need ${roll.diceMax} or less (${ITEM_CATALOG[roll.itemId]?.displayName})`
    : `Need ${roll.diceMax} or less to hit`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.context}>{roll.context}</div>
        <div style={{ fontSize: '0.75rem', color: '#8b5e3c', marginBottom: '0.5rem' }}>{thresholdLabel}</div>

        <span
          className={`${styles.die} ${rolling ? styles.rolling : ''}`}
          onClick={doRoll}
          title="Click to roll"
        >
          {dieFace}
        </span>

        {result !== null && (
          <>
            <div className={styles.result}>{result}</div>
            <div className={`${styles.resultLabel} ${success ? styles.success : styles.failure}`}>
              {success ? '✓ Success!' : '✗ Failed'}
            </div>
            <button className={styles.rollBtn} onClick={confirm}>Continue</button>
          </>
        )}

        {result === null && (
          <button className={styles.rollBtn} onClick={doRoll}>Roll the Die</button>
        )}
      </div>
    </div>
  );
}
