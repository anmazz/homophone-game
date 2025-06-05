export interface GameState {
  currentWord: string | undefined;
  correctWords: string[];
  fileName: string | undefined;
  currentGuess: string | undefined;
  unseenWordList: string[][] | undefined;
  state: GameStateType;
  previousScoreAdded: number | undefined;
  score: number;
}

export enum GameStateActionType {
    CORRECT_ANSWER = "CORRECT_ANSWER",
    REPLAY = "REPLAY",
    GAME_OVER = "GAME_OVER",
    NEXT_WORD = "NEXT_WORD",
    GUESS = "GUESS",
}

export enum GameStateType {
    NEW_GAME = "NEW_GAME",
    PLAYING = "PLAYING",
    GAME_OVER = "GAME_OVER",
    WORD_COMPLETE = "WORD_COMPLETE"
}