import homophones from "../../public/homophoneslist.json";  
import { GameState, GameStateType } from "../models/gameState.model";

export function generateRandomWord(wordList: string[][] | undefined): {
  fileName: string;
  currentWord: string | undefined;
  unseenWordList: string[][];
  groupSize: number
} {
  if (!wordList) {
    // shouldn't get here
    return { fileName: "", currentWord: "", unseenWordList: [], groupSize: 0 }
  }
  const numWordGroups = wordList.length;
  const randomWordGroupIndex = Math.floor(Math.random() * numWordGroups);
  const chosenGroup = wordList[randomWordGroupIndex];
  wordList.splice(randomWordGroupIndex, 1);
  const fileName = "/" + chosenGroup.join("_") + ".mp3";
  const groupSize = chosenGroup.length;
  const currentWord = chosenGroup[Math.floor(Math.random() * groupSize)];
  
  return { fileName, currentWord, unseenWordList: wordList, groupSize };
}

export function createInitialGameState(): GameState {
  console.debug("initial game state")
  return {
    currentWord: undefined,
    correctWords: [],
    fileName: undefined,
    currentGuess: undefined,
    unseenWordList: structuredClone(homophones),
    state: GameStateType.NEW_GAME,
    prevWordScore: 0,
    wordScore: 0,
    totalScore: 0,
  };
}