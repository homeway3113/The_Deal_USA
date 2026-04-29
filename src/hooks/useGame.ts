import { useReducer, useEffect } from 'react';
import { gameReducer, LOBBY_STATE } from '../engine/gameReducer';
import { getAIAction } from '../engine/ai/randomAI';
import type { GameAction } from '../types/actions';

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, LOBBY_STATE);

  // AI automation: when it's an AI player's turn, auto-dispatch after a delay
  useEffect(() => {
    if (state.phase === 'LOBBY' || state.phase === 'GAME_OVER') return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.type !== 'AI') return;

    const timer = setTimeout(() => {
      const action = getAIAction(state);
      dispatch(action as GameAction);
      // INCOME phase auto-advances
      if (state.phase === 'INCOME') {
        dispatch({ type: 'ADVANCE_PHASE' });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [state.phase, state.currentPlayerIndex, state.pendingDiceRolls.length]);

  return { state, dispatch };
}
