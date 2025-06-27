'use client'
import Modal from 'react-modal';

type GameOverModalProps = {
  isOpen: boolean;
  score: number;
  hiScore: number | undefined;
  onRequestClose: () => void;
  onReplay: () => void;
};

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

export default function GameOverModal({isOpen, score, hiScore, onReplay, onRequestClose}: GameOverModalProps) {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Game Over Modal"
    >
      <h2>GAME OVER!</h2>
      <div className="flex flex-col gap-y-4">
        <div>
          <p>score: {score}</p>
          <p>high score: {hiScore}</p>
        </div>
        <button className="submit" onClick={onReplay}>replay</button>
      </div>
    </Modal>
  );
}
