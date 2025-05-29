'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import Modal from 'react-modal';
import homophones from "../public/homophoneslist.json";
import Header from './header';
import Instructions from "./instructions";
import GuessFeedback from "./guessFeedback";

Modal.setAppElement('#appElement');

export default function Home() {

  const [correctWords, setCorrectWords] = useState<string[]>([]);
  
  const [currentWord, setCurrentWord] = useState<string | undefined>("");
  const [fileName, setFileName] = useState<string | undefined>("");
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [currentGuess, setCurrentGuess] = useState<string | undefined>(undefined);
  const [hiScore, setHiScore] = useState<number>();
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [clickedButton, setClickedButton] = useState<boolean>(false);

  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const unseenWordList = useRef<Set<number>>(new Set(
    Array.from({ length: homophones.length }, (_, i) => i + 1)
  ));

  const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black',
    color: 'white'
    },
  };

  function openPopup() {
    setGameOverModalOpen(true);
  }

  function closePopup() {
    setGameOverModalOpen(false);
  }

  useEffect(() => {
    if (hiScore !== undefined) { // don't set if hiScore hasn't been retrieved from localstorage yet
      localStorage.setItem('hiScore', JSON.stringify(hiScore ?? 0));
    }
  }, [hiScore]);

  useEffect(() => {
    setCurrentWord(generateRandomWord());
    setHiScore(parseInt(localStorage.getItem('hiScore') ?? "0") || 0);
  }, []);

  const playAudio = useCallback(() => {
    if (!clickedButton) {
      setClickedButton(true);
    }
    setAudioPlaying(true);
    const audio = new Audio(fileName);

    audio.addEventListener('ended', () => {
      setAudioPlaying(false);
      inputRef?.current?.focus();
    });

    audio.play();
  }, [fileName, clickedButton]);

  useEffect(() => {
    // prevent first autoplay of audio if button hasn't been pushed yet
    if (fileName && clickedButton) { 
      playAudio();
    }
  }, [fileName, clickedButton, playAudio]);

  function generateRandomWord(): string | undefined {
    const indices = Array.from(unseenWordList.current);
    const chosenWordIndex = indices[Math.floor(Math.random() * indices.length)];
    
    unseenWordList.current.delete(chosenWordIndex);

    const chosenGroup = homophones.at(chosenWordIndex); // choose homophone group
    setFileName("/" + chosenGroup?.join("_") + ".mp3");
    const chosen = chosenGroup?.at(Math.floor(Math.random() * chosenGroup.length));
    return chosen; // chose random word in group
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const guess = formJson["guess"].toString();
    form.reset();

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
      endGame();
    }
  }

  function endGame() {
    setGameOver(true);
    setTimeout(() => {
      openPopup();
    }, 700)
  }

  function replay() {
    closePopup();
    setCorrectWords([]);
    setGameOver(false);
    setCurrentWord(generateRandomWord());
    setCurrentGuess(undefined);
    unseenWordList.current = new Set(Array.from({ length: homophones.length }, (_, i) => i + 1));
  }

  function score() {
    return correctWords.length;
  }

  function guessCorrect(guess: string) {
    return guess.toLowerCase() === currentWord;
  }

  return (
    <div id="appElement" className="flex justify-center items-center flex-col">

      <Header/>
    
      <div className="pt-30">
        <Instructions buttonClicked={clickedButton}/>

        <h2>SCORE: {correctWords.length}</h2>

        <GuessFeedback currentGuess={currentGuess} currentWord={currentWord} gameOver={gameOver}/>

        <div className="flex gap-x-1">
          <button className="flex items-center" onClick={playAudio} >
            <span className="material-symbols-outlined text-9xl">{audioPlaying ? 'volume_up' : 'play_circle'}</span>
          </button>
        
          <form action="post" onSubmit={handleSubmit} className="flex gap-x-1">
            <input name="guess" ref={inputRef} className="border caret-black" autoFocus/>
            <button type="submit" className="submit">submit</button>
          </form>
        </div>

        <div id="word-list">
          <ol className="list-decimal">
            { correctWords.map(correctWord => (
                <li key={correctWord}>{ correctWord }</li>
              ))
            }
          </ol>
        </div>
      </div>

      <Modal
        isOpen={gameOverModalOpen}
        onRequestClose={closePopup}
        style={customStyles}
        contentLabel="Game over modal">
        <h2>GAME OVER!</h2>
        <div className="flex flex-col gap-y-4">
          <div>
            <p>score: { score() }</p>
            <p>high score: { hiScore }</p>
          </div>
          <button className="submit" onClick={replay}>replay</button>
        </div>
      </Modal>

      <div className="fixed left-0 bottom-0 w-full flex justify-center text-2xl pb-8">
        high score: {hiScore}
      </div>
    </div>
  );
}
