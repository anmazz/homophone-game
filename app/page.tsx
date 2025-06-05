'use client'

import { createInitialGameState, generateRandomWord} from "./util/util.function";
import { FormEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { GameState, GameStateActionType, GameStateType } from "./models/gameState.model";
import GameStateAction from "./models/gameStateAction.model";
import GuessFeedback from "./guessFeedback";
import Header from './header';
import Instructions from "./instructions";
import Modal from 'react-modal';
import React from "react";

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
            <p>score: { state.totalScore }</p>
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

