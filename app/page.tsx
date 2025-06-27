'use client'

import { createInitialGameState, generateRandomWord} from "./util/util.function";
import { FormEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { GameStateActionType, GameStateType } from "./models/gameState.model";
import { reducer } from "./util/gameState.function";
import GameOverModal from "./components/gameOverModal";
import GuessFeedback from "./components/guessFeedback";
import GuessInput from "./components/guessInput";
import Header from './components/header';
import Instructions from "./components/instructions";
import React from "react";
import WordList from "./components/wordList";

export default function Home() {

  const [state, dispatch] = useReducer(reducer, undefined, createInitialGameState);
  const [hiScore, setHiScore] = useState<number>();
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [clickedButton, setClickedButton] = useState<boolean>(false);
  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const clickedButtonRef = useRef<boolean>(false);

  useEffect(() => {
    setHiScore(parseInt(localStorage.getItem('hiScore') ?? "0") || 0);
  }, []);

  useEffect(() => {
    if (state.totalScore > (hiScore ?? 0)) {
      setHiScore(state.totalScore)
      localStorage.setItem('hiScore', JSON.stringify(state.totalScore ?? 0));
    }
  }, [state.totalScore])

  const playAudio = useCallback(() => {
    if (!clickedButtonRef.current) {
      clickedButtonRef.current = true;
      setClickedButton(true);
    }
    setAudioPlaying(true);
    console.debug(state.fileName);
    const audio = new Audio(state.fileName);

    audio.addEventListener('ended', () => {
      setAudioPlaying(false);
      // move focus back to input box
      inputRef?.current?.focus();
    });

    audio.play();
  }, [state.fileName, clickedButtonRef]);

  useEffect(() => {
    // prevent first autoplay of audio if button hasn't been pushed yet
    if (state.fileName && clickedButtonRef.current) { 
      playAudio();
    }
  }, [state.fileName, clickedButtonRef, playAudio]);

  useEffect(() => {
    if (state.state === GameStateType.GAME_OVER) {
      endGame();
    }
    if (state.state === GameStateType.WORD_COMPLETE || state.state === GameStateType.NEW_GAME) {
      const { fileName, currentWord, unseenWordList, groupSize } = generateRandomWord(state.unseenWordList);
      dispatch({
        type: GameStateActionType.NEXT_WORD,
        fileName,
        currentWord,
        unseenWordList,
        groupSize
      });
    }
  }, [state.state]);

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

    dispatch({ type: GameStateActionType.GUESS, guess: guess })
  }

  function endGame() {
    setTimeout(() => {
      setGameOverModalOpen(true);
    }, 700)
  }

  function replay() {
    setGameOverModalOpen(false);
    dispatch({ type: GameStateActionType.REPLAY, guess: undefined })
  }

  function closePopup() {
    setGameOverModalOpen(false);
  }

  return (
    <div id="appElement" className="flex justify-center items-center flex-col">

      <Header/>
    
      <div className="pt-24">
        <Instructions buttonClicked={clickedButton}/>
        <h2>SCORE: {state.totalScore }</h2>

        <GuessFeedback gameState={state}/>

        <GuessInput
          inputRef={inputRef}
          onSubmit={handleSubmit}
          onPlayAudio={playAudio}
          audioPlaying={audioPlaying}
        />

        <WordList correctWords={state.correctWords}/>
      </div>

      <GameOverModal
        isOpen={gameOverModalOpen}
        onRequestClose={closePopup}
        score={state.totalScore}
        hiScore={hiScore}
        onReplay={replay}
      />

      <div className="fixed left-0 bottom-0 w-full flex justify-center text-2xl pb-8">
        high score: { hiScore }
      </div>
    </div>
  );
}

