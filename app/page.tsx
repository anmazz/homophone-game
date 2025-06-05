'use client'

import { FormEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import React from "react";
import Modal from 'react-modal';
import Header from './header';
import Instructions from "./instructions";
import GuessFeedback from "./guessFeedback";
import { GameState, GameStateActionType, GameStateType } from "./models/gameState.model";
import GameStateAction from "./models/gameStateAction.model";
import { createInitialGameState, generateRandomWord} from "./util/util.function";

  function reducer(state: GameState, action: GameStateAction): GameState {
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
      case GameStateActionType.REPLAY: {
        return createInitialGameState();
      }

      case GameStateActionType.NEXT_WORD: {
        return {
          ...state,
          fileName: action.fileName,
          currentWord: action.currentWord,
          unseenWordList: action.unseenWordList,
          state: GameStateType.PLAYING,
        };
      }

      default:
        return state;
    }
}

export default function Home() {

  const [state, dispatch] = useReducer(reducer, undefined, createInitialGameState);
  const [hiScore, setHiScore] = useState<number>();

  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [clickedButton, setClickedButton] = useState<boolean>(false);
  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const clickedButtonRef = useRef<boolean>(false);

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
    setHiScore(parseInt(localStorage.getItem('hiScore') ?? "0") || 0);
  }, []);

  useEffect(() => {
    setHiScore(state.correctWords.length)
  }, [state.correctWords])


  const playAudio = useCallback(() => {
    if (!clickedButtonRef.current) {
      clickedButtonRef.current = true;
      setClickedButton(true);
    }
    setAudioPlaying(true);
    const audio = new Audio(state.fileName);

    audio.addEventListener('ended', () => {
      setAudioPlaying(false);
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
    if (state.state === GameStateType.WORD_COMPLETE) {
    const { fileName, currentWord, unseenWordList } = generateRandomWord(state.unseenWordList);
    dispatch({
      type: GameStateActionType.NEXT_WORD,
      fileName,
      currentWord,
      unseenWordList
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
      openPopup();
    }, 700)
  }

  function replay() {
    closePopup();
    dispatch({ type: GameStateActionType.REPLAY, guess: undefined })
  }

  return (
    <div id="appElement" className="flex justify-center items-center flex-col">

      <Header/>
    
      <div className="pt-24">
        <Instructions buttonClicked={clickedButton}/>
        {/* { state.currentWord } */}
        <h2>SCORE: {state.correctWords.length}</h2>

        <GuessFeedback gameState={state}/>

        <div className="flex gap-x-1">
          <button className="flex items-center" onClick={playAudio} >
            <span className="material-symbols-outlined text-9xl">{audioPlaying ? 'volume_up' : 'play_circle'}</span>
          </button>
        
          <form action="post" onSubmit={handleSubmit} className="flex gap-x-1">
            <input name="guess" ref={inputRef} autoFocus/>
            <button type="submit" className="submit">submit</button>
          </form>
        </div>

        <div id="word-list">
          <ol className="list-decimal">
            { state.correctWords.map(correctWord => (
                <li key={correctWord}>{ correctWord }</li>
              ))
            }
          </ol>
        </div>
      </div>

      <Modal
        ariaHideApp={false}
        isOpen={gameOverModalOpen}
        onRequestClose={closePopup}
        style={customStyles}
        contentLabel="Game over modal">
        <h2>GAME OVER!</h2>
        <div className="flex flex-col gap-y-4">
          <div>
            <p>score: { state.correctWords.length }</p>
            <p>high score: { hiScore }</p>
          </div>
          <button className="submit" onClick={replay}>replay</button>
        </div>
      </Modal>

      <div className="fixed left-0 bottom-0 w-full flex justify-center text-2xl pb-8">
        high score: { hiScore }
      </div>
    </div>
  );
}

