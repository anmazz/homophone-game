interface FeedbackProps {
    currentGuess: string | undefined;
    currentWord: string | undefined;
    gameOver: boolean;
}

export default function GuessFeedback({currentGuess, currentWord, gameOver} : FeedbackProps) {
    return (
        <div style={{ minHeight: '24px' }}>
            {currentGuess && !gameOver && (
            <div className="correct-guess" key={currentGuess}>
                +1 {currentGuess}
            </div>
            )}

            {gameOver && (
            <div className="game-over flex items-end" key={currentGuess}>
                <span className="material-symbols-outlined small">close</span>correct word: {currentWord}
            </div>
            )}
        </div>
    )
}