'use client'

import React, { FormEvent, RefObject } from 'react';

type Props = {
  inputRef: RefObject<HTMLInputElement | null>;
  audioPlaying: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onPlayAudio: () => void;
};

export default function GuessInput({ inputRef, onSubmit, onPlayAudio, audioPlaying }: Props) {
  return (
    <div className="flex gap-x-1">
      <button className="flex items-center" onClick={onPlayAudio}>
        <span className="material-symbols-outlined text-9xl">
          {audioPlaying ? 'volume_up' : 'play_circle'}
        </span>
      </button>

      <form action="post" onSubmit={onSubmit} className="flex gap-x-1">
        <input name="guess" ref={inputRef} autoFocus />
        <button type="submit" className="submit">submit</button>
      </form>
    </div>
  );
}
