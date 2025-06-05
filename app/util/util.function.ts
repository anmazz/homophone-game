import homophones from "../../public/homophoneslist.json";  
import { GameState, GameStateType } from "../models/gameState.model";

export function generateRandomWord(wordList: string[][] | undefined): {
  fileName: string;
  currentWord: string | undefined;
  unseenWordList: string[][];
} {
  if (!wordList) {
    // shouldn't get here
    return { fileName: "", currentWord: "", unseenWordList: [] }
  }
  const numWordGroups = wordList.length;
  const randomWordGroupIndex = Math.floor(Math.random() * numWordGroups);
  const chosenGroup = wordList[randomWordGroupIndex];
  wordList.splice(randomWordGroupIndex, 1);
  const fileName = "/" + chosenGroup.join("_") + ".mp3";
  const currentWord = chosenGroup[Math.floor(Math.random() * chosenGroup.length)];
  
  console.debug(fileName)
  return { fileName, currentWord, unseenWordList: wordList };
}

export function createInitialGameState(): GameState {
  
  const { fileName, currentWord, unseenWordList } = generateRandomWord(structuredClone(homophones));
  console.log("initial game state")
  return {
    currentWord,
    correctWords: [],
    fileName,
    currentGuess: "",
    unseenWordList,
    state: GameStateType.PLAYING,
  };
}