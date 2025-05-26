'use client'

import { useState } from "react";

export default function Home() {

  const currentWord = "accept";
  var showCorrect = false;

  const [correctWords, setCorrectWords] = useState<string[]>([]);

  function playAudio() {
    (new Audio('/accept_except.mp3')).play();
  }

  function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    const guess = formJson["guess"];

    if (guess === currentWord) {
      setCorrectWords([...correctWords, guess])
    }
    console.log(formJson);
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-3xl">
        HOMOPHONE
      </h1>
      <div>
        {
          correctWords.map(correctWord => (
            <ul key={correctWord}>{ correctWord }</ul>
          ))
        }
      </div>
      <div className="flex">
        <button className="flex" onClick={playAudio}>
          <span className="material-symbols-outlined">play_circle</span>
        </button>
        
        <form action="post" onSubmit={handleSubmit}>
          <input name="guess"/>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
