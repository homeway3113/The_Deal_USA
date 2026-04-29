import { useState } from 'react';
import { useGame } from './hooks/useGame';
import { Lobby } from './components/Lobby/Lobby';
import { Board } from './components/Board/Board';
import { PlayerPanel } from './components/PlayerPanel/PlayerPanel';
import { PhaseUI } from './components/PhaseUI/PhaseUI';
import { GameLog } from './components/GameLog/GameLog';
import { DiceRoller } from './components/DiceRoller/DiceRoller';
import type { Position } from './types/board';
import styles from './App.module.css';

type MobileTab = 'board' | 'actions' | 'players';

export default function App() {
  const { state, dispatch } = useGame();
  const [mobileTab, setMobileTab] = useState<MobileTab>('board');

  if (state.phase === 'LOBBY') {
    return (
      <div className={styles.app}>
        <Lobby dispatch={dispatch} />
      </div>
    );
  }

  const player = state.players[state.currentPlayerIndex];
  const playerColors = state.players.map(p => p.color);
  const pendingRoll = state.pendingDiceRolls[0];

  const handleTileClick = (pos: Position) => {
    if (state.phase === 'MOVEMENT' && player?.type === 'HUMAN') {
      dispatch({ type: 'MOVE_PLAYER', payload: { position: pos } });
    }
  };

  const handleDiceRoll = (roll: number) => {
    dispatch({ type: 'RESOLVE_DICE', payload: { roll } });
  };

  const leftPlayers = state.players.filter((_, i) => i % 2 === 0);
  const rightPlayers = state.players.filter((_, i) => i % 2 === 1);

  const winOverlay = state.phase === 'GAME_OVER' && state.winner !== undefined && (
    <div className={styles.winOverlay}>
      <div className={styles.winCard}>
        <div className={styles.winCrown}>♛</div>
        <h2 className={styles.winTitle}>
          {state.players[state.winner].name} Reigns!
        </h2>
        <p className={styles.winSubtitle}>
          The Crown of Arkaditya is reforged.<br />
          Amradvīpa bows to its new sovereign.
        </p>
        <button
          className={styles.playAgainBtn}
          onClick={() => dispatch({ type: 'START_GAME', payload: { playerCount: 2, playerTypes: ['HUMAN', 'HUMAN'] } })}
        >
          Play Again
        </button>
      </div>
    </div>
  );

  const diceModal = pendingRoll && player?.type === 'HUMAN' && (
    <DiceRoller roll={pendingRoll} onRoll={handleDiceRoll} />
  );

  /* ── Mobile shell ── */
  return (
    <div className={styles.app}>
      {/* Desktop layout */}
      <div className={styles.gameScreen}>
        <div className={styles.leftCol}>
          {leftPlayers.map(p => (
            <PlayerPanel key={p.id} player={p} isActive={p.id === state.currentPlayerIndex} />
          ))}
        </div>
        <div className={styles.centerCol}>
          <div className={styles.gameHeader}>
            <span className={styles.gameTitle}>♛ Crown of Arkaditya</span>
            <span className={styles.turnInfo}>Turn {state.turnNumber}</span>
          </div>
          <Board gameState={state} onTileClick={handleTileClick} />
          <PhaseUI state={state} dispatch={dispatch} />
          <GameLog log={state.log} playerColors={playerColors} />
        </div>
        <div className={styles.rightCol}>
          {rightPlayers.map(p => (
            <PlayerPanel key={p.id} player={p} isActive={p.id === state.currentPlayerIndex} />
          ))}
        </div>
      </div>

      {/* Mobile shell */}
      <div className={styles.mobileShell}>
        <div className={styles.mobileHeader}>
          <span className={styles.mobileTitle}>♛ Crown of Arkaditya</span>
          <span className={styles.mobileTurnInfo}>Turn {state.turnNumber}</span>
        </div>

        {player && (
          <div className={styles.activePlayerStrip} style={{ borderLeftColor: player.color, borderLeftWidth: 3, borderLeftStyle: 'solid' }}>
            <div className={styles.stripDot} style={{ backgroundColor: player.color }} />
            <span className={styles.stripName} style={{ color: player.color }}>{player.name}</span>
            <div className={styles.stripStats}>
              <span>⬡ {player.gold}</span>
              <span>❤ {player.lifelines}</span>
              <span>♛ {player.collectedShards.length}/16</span>
            </div>
          </div>
        )}

        <div className={styles.mobileContent}>
          {mobileTab === 'board' && (
            <div className={styles.mobileBoardWrap}>
              <Board gameState={state} onTileClick={(pos) => {
                handleTileClick(pos);
                // After a valid move tap, stay on board
              }} />
            </div>
          )}
          {mobileTab === 'actions' && (
            <div className={styles.mobileActionsWrap}>
              <PhaseUI state={state} dispatch={dispatch} />
              <GameLog log={state.log} playerColors={playerColors} />
            </div>
          )}
          {mobileTab === 'players' && (
            <div className={styles.mobilePlayersWrap}>
              {state.players.map(p => (
                <PlayerPanel key={p.id} player={p} isActive={p.id === state.currentPlayerIndex} />
              ))}
            </div>
          )}
        </div>

        <div className={styles.mobileTabs}>
          <button
            className={`${styles.mobileTab} ${mobileTab === 'board' ? styles.activeTab : ''}`}
            onClick={() => setMobileTab('board')}
          >
            <span className={styles.mobileTabIcon}>🗺</span>
            Board
          </button>
          <button
            className={`${styles.mobileTab} ${mobileTab === 'actions' ? styles.activeTab : ''}`}
            onClick={() => setMobileTab('actions')}
          >
            <span className={styles.mobileTabIcon}>⚔</span>
            Actions
          </button>
          <button
            className={`${styles.mobileTab} ${mobileTab === 'players' ? styles.activeTab : ''}`}
            onClick={() => setMobileTab('players')}
          >
            <span className={styles.mobileTabIcon}>👑</span>
            Heirs
          </button>
        </div>
      </div>

      {diceModal}
      {winOverlay}
    </div>
  );
}
