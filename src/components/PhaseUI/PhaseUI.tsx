import type { GameState } from '../../types/game';
import type { GameAction } from '../../types/actions';
import type { ItemType } from '../../types/items';
import { ITEM_CATALOG, ITEMS_BY_CATEGORY } from '../../data/itemCatalog';
import { isAdjacentToCity } from '../../engine/rules/movementRules';
import styles from './PhaseUI.module.css';

interface PhaseUIProps {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

const PHASE_LABELS: Record<string, string> = {
  ACQUIRE: 'Acquire Phase',
  DEPLOYMENT: 'Deployment Phase',
  RESOLUTION: 'Resolution Phase',
  MOVEMENT: 'Movement Phase',
  INCOME: 'Income Phase',
};

const CATEGORY_LABELS: Record<string, string> = {
  negotiation: '⚖ Negotiation',
  movement: '🌉 Movement',
  defense: '🛡 Defense',
  attack: '⚔ Attack',
};

export function PhaseUI({ state, dispatch }: PhaseUIProps) {
  const player = state.players[state.currentPlayerIndex];
  const isAI = player?.type === 'AI';

  const renderContent = () => {
    if (isAI) {
      return <div className={styles.aiWaiting}>⏳ {player.name} (AI) is deliberating…</div>;
    }

    switch (state.phase) {
      case 'ACQUIRE': return <AcquireUI state={state} dispatch={dispatch} />;
      case 'DEPLOYMENT': return <DeploymentUI state={state} dispatch={dispatch} />;
      case 'RESOLUTION': return <ResolutionUI state={state} dispatch={dispatch} />;
      case 'MOVEMENT': return <MovementUI state={state} dispatch={dispatch} />;
      case 'INCOME': return <IncomeUI state={state} dispatch={dispatch} />;
      default: return null;
    }
  };

  if (!player) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.phaseHeader}>
        <span className={styles.phaseName}>{PHASE_LABELS[state.phase] ?? state.phase}</span>
        <span className={styles.playerName} style={{ color: player.color }}>{player.name}</span>
      </div>
      {renderContent()}
    </div>
  );
}

/* ── Acquire ── */
function AcquireUI({ state, dispatch }: PhaseUIProps) {
  const player = state.players[state.currentPlayerIndex];
  const nearCity = isAdjacentToCity(state, state.currentPlayerIndex);

  const acquire = (item: ItemType) => dispatch({ type: 'ACQUIRE_ITEM', payload: { item } });
  const skip = () => dispatch({ type: 'SKIP_ACQUIRE' });

  const categories: Array<keyof typeof ITEMS_BY_CATEGORY> = ['negotiation', 'movement', 'defense', 'attack'];

  return (
    <>
      {!nearCity && (
        <p className={styles.infoText}>Move adjacent to a city ⟨C⟩ to acquire items.</p>
      )}
      {nearCity && (
        <div className={styles.shopGrid}>
          {categories.map(cat => (
            <>
              <div key={`lbl-${cat}`} className={styles.categoryLabel}>{CATEGORY_LABELS[cat]}</div>
              {ITEMS_BY_CATEGORY[cat].map(id => {
                const def = ITEM_CATALOG[id];
                const disabled = def.cost > player.gold || (def.oncePerGame === true && player.hasMarried);
                return (
                  <button
                    key={id}
                    className={styles.itemBtn}
                    disabled={disabled}
                    onClick={() => acquire(id)}
                    title={`Cost: ${def.cost} gold`}
                  >
                    <span>{def.displayName}</span>
                    <span className={styles.itemCost}>{def.cost === 0 ? 'free' : `⬡${def.cost}`}</span>
                  </button>
                );
              })}
            </>
          ))}
        </div>
      )}
      <div className={styles.actionRow}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={skip}>
          Skip →
        </button>
      </div>
    </>
  );
}

/* ── Deployment ── */
function DeploymentUI({ state, dispatch }: PhaseUIProps) {
  const player = state.players[state.currentPlayerIndex];
  const skip = () => dispatch({ type: 'SKIP_DEPLOYMENT' });

  const deploy = (item: ItemType) => dispatch({
    type: 'DEPLOY_ITEM',
    payload: { item, position: player.position },
  });

  return (
    <>
      <p className={styles.infoText}>
        Deploy items on your current tile ({player.position.row},{player.position.col}).
      </p>
      {player.inventory.length === 0 ? (
        <p className={styles.infoText} style={{ color: '#8b5e3c' }}>Nothing to deploy.</p>
      ) : (
        <div className={styles.inventoryRow}>
          {player.inventory.map((item, i) => (
            <button key={`${item}-${i}`} className={styles.inventoryItem} onClick={() => deploy(item)}>
              {ITEM_CATALOG[item].displayName}
            </button>
          ))}
        </div>
      )}
      <div className={styles.actionRow}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={skip}>Skip →</button>
      </div>
    </>
  );
}

/* ── Resolution ── */
function ResolutionUI({ state, dispatch }: PhaseUIProps) {
  const hasPending = state.pendingDiceRolls.length > 0;
  const advance = () => dispatch({ type: 'ADVANCE_PHASE' });

  return (
    <>
      <p className={styles.infoText}>
        {hasPending
          ? `${state.pendingDiceRolls.length} dice roll(s) pending…`
          : 'No pending resolutions.'}
      </p>
      {!hasPending && (
        <div className={styles.actionRow}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={advance}>
            Advance →
          </button>
        </div>
      )}
    </>
  );
}

/* ── Movement ── */
function MovementUI({ state, dispatch }: PhaseUIProps) {
  const skip = () => dispatch({ type: 'SKIP_MOVEMENT' });
  const hasValidMoves = state.validMoves.length > 0;

  return (
    <>
      <p className={styles.moveTip}>
        {hasValidMoves
          ? `${state.validMoves.length} valid move(s) — click a highlighted tile on the board.`
          : 'No valid moves available.'}
      </p>
      <div className={styles.actionRow}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={skip}>
          Stay put →
        </button>
      </div>
    </>
  );
}

/* ── Income ── */
function IncomeUI({ state, dispatch }: PhaseUIProps) {
  const player = state.players[state.currentPlayerIndex];
  const income = player.collectedShards.length;
  const advance = () => dispatch({ type: 'ADVANCE_PHASE' });

  return (
    <>
      <p className={styles.infoText}>
        Income: +{income} gold ({income} shard{income !== 1 ? 's' : ''} held).
      </p>
      <div className={styles.actionRow}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={advance}>
          End Turn →
        </button>
      </div>
    </>
  );
}
