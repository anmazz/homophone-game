import { GameState, GameStateType } from "../models/gameState.model";

export default function GuessFeedback({ gameState }: { gameState: GameState }) {

  return (
    <div style={{ minHeight: '24px' }}>
      {gameState.currentGuess && gameState.state !== GameStateType.GAME_OVER && (
        <div className="correct-guess" key={gameState.currentGuess}>
          +{gameState.prevWordScore} {gameState.currentGuess}
        </div>
      )}
      {gameState.state === GameStateType.GAME_OVER && (
        <div className="game-over flex items-end" key={gameState.currentGuess}>
          <span className="material-symbols-outlined small">close</span>correct word: {gameState.currentWord}
        </div>
      )}
    </div>
  )
}