import { useGame } from './hooks/useGame';
import { Lobby } from './components/Lobby/Lobby';
import { Board } from './components/Board/Board';
import { PlayerPanel } from './components/PlayerPanel/PlayerPanel';
import { PhaseUI } from './components/PhaseUI/PhaseUI';
import { GameLog } from './components/GameLog/GameLog';
import { DiceRoller } from './components/DiceRoller/DiceRoller';
import type { Position } from './types/board';
import styles from './App.module.css';

export default function App() {
  const { state, dispatch } = useGame();

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

  return (
    <div className={styles.app}>
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

      {pendingRoll && player?.type === 'HUMAN' && (
        <DiceRoller roll={pendingRoll} onRoll={handleDiceRoll} />
      )}

      {state.phase === 'GAME_OVER' && state.winner !== undefined && (
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
              onClick={() =>
                dispatch({
                  type: 'START_GAME',
                  payload: { playerCount: 2, playerTypes: ['HUMAN', 'HUMAN'] },
                })
              }
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
