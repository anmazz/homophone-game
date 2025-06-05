import { GameStateActionType } from "./gameState.model";

export default interface GameStateAction {
    type: GameStateActionType,
    guess?: string | undefined
    fileName?: string;
    currentWord?: string | undefined;
    unseenWordList?: string[][];
}