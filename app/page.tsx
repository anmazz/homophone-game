'use client'

import { useEffect, useState } from "react";
import homophones from "../public/homophoneslist.json";
import Header from './header';


export default function Home() {

  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [unseen, setUnseen] = useState<Set<number>>(new Set(Array.from({ length: homophones.length }, (_, i) => i + 1)));
  const [currentWord, setCurrentWord] = useState<string | undefined>("");
  const [fileName, setFileName] = useState<string | undefined>("");
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [currentGuess, setCurrentGuess] = useState<string | undefined>(undefined);
  const [hiScore, setHiScore] = useState<number>();
  const [gameOver, setGameOver] = useState<boolean>(false);


  useEffect(() => {
    if (hiScore !== undefined) { // don't set if hiScore hasn't been retrieved from localstorage yet
      localStorage.setItem('hiScore', JSON.stringify(hiScore ?? 0));
    }
  }, [hiScore]);

  useEffect(() => {
    setCurrentWord(generateRandomWord());
    setHiScore(parseInt(localStorage.getItem('hiScore') ?? "0") || 0);
  }, []);

  useEffect(() => {
    if (fileName) {
      playAudio();
    }
  }, [fileName]);

  function playAudio() {
    setAudioPlaying(true);
    const audio = new Audio(fileName);

    audio.addEventListener('ended', () => {
      setAudioPlaying(false);
    });

    audio.play();
  }

  function generateRandomWord(): string | undefined {
    const chosenWordIndex = Array.from(unseen)[Math.floor(Math.random() * unseen.size)];
    const newUnseen = new Set(unseen);
    newUnseen.delete(chosenWordIndex);
    setUnseen(newUnseen);

    const chosenGroup = homophones.at(chosenWordIndex); // choose homophone group
    setFileName("/" + chosenGroup?.join("_") + ".mp3");
    const chosen = chosenGroup?.at(Math.floor(Math.random() * chosenGroup.length));
    return chosen; // chose random word in group

  }

  function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const guess = formJson["guess"].toString();
    e.target.reset();

    if (guess === "") {
      // prevent user from entering nothing
      return;
    }

    setCurrentGuess(guess);

    if (guessCorrect(guess)) {
      setCorrectWords([...correctWords, guess]);
      if (correctWords.length + 1 > (hiScore ?? 0)) {
        setHiScore(correctWords.length + 1);
      }
      setCurrentWord(generateRandomWord());
    } else {
      // game over
      setCorrectWords([]);
      setGameOver(true);
    }
  }

  function replay() {
    setGameOver(false);
    setCurrentWord(generateRandomWord());
    setCurrentGuess(undefined);
  }

  function guessCorrect(guess: string) {
    return guess.toLowerCase() === currentWord;
  }

  return (
    <div className="flex justify-center items-center flex-col">

      <Header/>
    
      <div className="pt-30">
        { currentWord }
        <h2>CURRENT STREAK: {correctWords.length}</h2>

        { currentGuess && !gameOver && (<div className="correct-guess" key={currentGuess}>
          +1 { currentGuess }
        </div>)}
        { gameOver && (<div className="game-over" key={currentGuess}>
          X correct word was: { currentWord }
        </div>)}

        <div className="flex gap-x-1">
          <button className="flex items-center" onClick={playAudio} >
            <span className="material-symbols-outlined text-9xl">{audioPlaying ? 'volume_up' : 'play_circle'}</span>
          </button>
        
          <form action="post" onSubmit={handleSubmit} className="flex gap-x-1">
            <input name="guess" className="border caret-black" autoFocus/>
            <button type="submit" className="submit">submit</button>
          </form>
        </div>

        { gameOver && (
        <button onClick={replay}>Replay</button>
        )}
        
        <div id="word-list">
          <ol className="list-decimal">
            {
              correctWords.map(correctWord => (
                <li key={correctWord}>{ correctWord }</li>
              ))
            }
          </ol>
        </div>
      </div>

      <div className="fixed left-0 bottom-0 w-full flex justify-center text-2xl pb-8">
        high score: {hiScore}
      </div>
    </div>
  );
}
