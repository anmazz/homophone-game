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
  async function onShare() {
  const shareData = {
    title: `🔊 I scored ${score} points in the Homophone Game!`,
    url: "https://homophonegame.com"
  }
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log("Sharing failed", err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${shareData.title} ${shareData.url}`);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      alert("Could not copy to clipboard.");
    }
  }
}
  
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
        <button className="submit flex justify-center" onClick={onShare}>
          share &nbsp;
          <span className="material-symbols-outlined small">
          share
        </span>
        </button>
      </div>
    </Modal>
  );
}
