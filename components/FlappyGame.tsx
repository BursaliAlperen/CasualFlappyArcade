import React, { useRef, useEffect, useState, useCallback } from 'react';
import useGameLogic from '../hooks/useGameLogic';

interface FlappyGameProps {
  onFlapEarned: (amount: number) => void;
}

const FlappyGame: React.FC<FlappyGameProps> = ({ onFlapEarned }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'over'>('ready');
  const [score, setScore] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    onFlapEarned(finalScore);
    setGameState('over');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Duration of the shake animation
  }, [onFlapEarned]);
  
  const { startGame, stopGame, initializeAudio } = useGameLogic(canvasRef, handleGameOver);

  const handleStart = () => {
    initializeAudio(); // Unlock audio context on first user interaction
    setScore(0);
    setGameState('playing');
    startGame();
  };
  
  useEffect(() => {
    // The music is now correctly started via the `startGame` function.
    // This effect ensures that the game and its music are stopped if the component unmounts.
    return () => {
      stopGame();
    }
  }, [stopGame]);

  return (
    <div className={`w-full max-w-md flex flex-col items-center justify-center relative ${isShaking ? 'shake' : ''}`}>
        <canvas ref={canvasRef} width="320" height="480" className="bg-transparent border-4 border-yellow-300 rounded-lg shadow-2xl shadow-black/50"></canvas>

        {gameState === 'ready' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                <h2 className="text-4xl text-yellow-300 mb-4">FLAPPY</h2>
                <button onClick={handleStart} className="px-8 py-4 bg-green-500 text-white rounded-lg border-b-4 border-green-700 hover:bg-green-600 transition-transform transform hover:scale-105 active:border-b-0 active:translate-y-1">
                    PLAY
                </button>
            </div>
        )}

        {gameState === 'over' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-center p-4 animate-fade-in">
                <h2 className="text-4xl text-red-500 mb-2">GAME OVER</h2>
                <p className="text-xl text-white mb-2">SCORE: {score}</p>
                <p className="text-2xl text-yellow-300 mb-6">EARNED: {score} FLAP</p>
                <button onClick={handleStart} className="px-8 py-4 bg-green-500 text-white rounded-lg border-b-4 border-green-700 hover:bg-green-600 transition-transform transform hover:scale-105 active:border-b-0 active:translate-y-1">
                    PLAY AGAIN
                </button>
            </div>
        )}
    </div>
  );
};

export default FlappyGame;