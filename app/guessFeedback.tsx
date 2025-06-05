import { GameState, GameStateType } from "./models/gameState.model";


export default function GuessFeedback({ gameState } : { gameState: GameState}) {
    // TODO: fix +score with correct value 
    // previousScoreAdded not working since state is already updated with new word
    return (
        <div style={{ minHeight: '24px' }}>
            { gameState.currentGuess && gameState.state !== GameStateType.GAME_OVER && (
            <div className="correct-guess" key={gameState.currentGuess}>
                
                +{gameState.previousScoreAdded} {gameState.currentGuess}
            </div>
            )}

          
            { gameState.state === GameStateType.GAME_OVER && (
                <div className="game-over flex items-end" key={gameState.currentGuess}>
                <span className="material-symbols-outlined small">close</span>correct word: {gameState.currentWord}
            </div>
            )}
        </div>
    )
}