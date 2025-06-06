import { GameState, GameStateActionType, GameStateType } from "../models/gameState.model";
import GameStateAction from "../models/gameStateAction.model";
import { createInitialGameState } from "./util.function";

export function reducer(state: GameState, action: GameStateAction): GameState {
  switch (action.type) {
    case GameStateActionType.GUESS: {
      const guess = action.guess ?? "";
      if (guess !== state.currentWord) {
        return { ...state, currentGuess: guess, state: GameStateType.GAME_OVER };
      }
      return {
        ...state,
        currentGuess: guess,
        correctWords: [...state.correctWords, guess],
        state: GameStateType.WORD_COMPLETE,
      };
    }
    case GameStateActionType.NEXT_WORD: {
      // after a correct entry has been submitted, and the currentWord/file needs to be updated
      const wordScore = (action.groupSize ?? 0) * (state.correctWords.length + 1);

      return {
        ...state,
        fileName: action.fileName,
        currentWord: action.currentWord,
        unseenWordList: action.unseenWordList,
        state: GameStateType.PLAYING,
        prevWordScore: state.wordScore,
        wordScore: wordScore,
        totalScore: state.totalScore + (state.wordScore ?? 0)
      };
    }
    case GameStateActionType.REPLAY: {
      return createInitialGameState();
    }
    default:
      return state;
  }
}