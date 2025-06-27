import React from "react";

type Props = {
  correctWords: string[];
}

export default function WordList({ correctWords }: Props) {
  return (
    <div id="word-list">
      <ol className="list-decimal">
        {correctWords.map(correctWord => (
          <li key={correctWord}>{correctWord}</li>
        ))
        }
      </ol>
    </div>
  )
}