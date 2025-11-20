import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "./index";
import {motion , useAnimation} from "motion/react"


interface GameOverPrompt {
  winner: string | null;
  opponent: string | null;
  playerColor: string | null;
  result: string | null;
  onPlayAgain: () => void;
  winnerRating: number | null;
  loserRating: number | null;
}

const GameOver = ({
  winner,
  opponent,
  playerColor,
  result,
  onPlayAgain,
  winnerRating,
  loserRating,
}: GameOverPrompt) => {
  const [username, setUsername] = useState<string | null>(null);
  const [gameWinner, setGameWinner] = useState<string | null>(null);
  const [gameLoser, setGameLoser] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [animatedRating, setAnimatedRating] = useState<number | null>(null);

  const ratingControls = useAnimation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: { username: string } = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!username || !winner) return;
    if (winner === username) {
      setGameWinner(username);
      setGameLoser(opponent);
      setGameResult("🏆 You won!");
    } else {
      setGameWinner(opponent);
      setGameLoser(username);
      setGameResult(
        playerColor === "white" ? "⚫ Black won!" : "⚪ White won!"
      );
    }
    setReason(result);
  }, [username, winner]);

  useEffect(() => {
    if (winnerRating !== null) {
      // Start animation from old rating to new rating
      setAnimatedRating(winnerRating - 100);
      ratingControls.start({
        y: -10,
        opacity: 1,
        transition: { duration: 3.0 },
      });

      setTimeout(() => {
        setAnimatedRating(winnerRating); // Smooth transition to the new rating
      }, 3000);
    }
  }, [winnerRating, ratingControls]);

  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-black/50 backdrop-blur-sm z-10">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">{gameResult}</h2>
        {reason && (
          <p className="text-lg text-gray-600 font-semibold">{reason}</p>
        )}
        <div className="mt-4">
          <p className="text-gray-700">
            <span className="font-semibold text-green-600">{gameWinner}</span>{" "}
            defeated{" "}
            <span className="font-semibold text-red-600">{gameLoser}</span>
          </p>
          {username === gameWinner ? (
            <div className="font-bold flex justify-center items-center gap-2">
              <motion.span
                animate={ratingControls}
                initial={{ y: 10, opacity: 0 }}
                className="px-2 shadow-lg rounded-2xl text-green-600 font-bold text-lg"
              >
                {animatedRating}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-green-600 font-semibold"
              >
                +100
              </motion.span>
            </div>
          ) : (
            <div className="font-bold flex justify-center items-center gap-2">
              <motion.span
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="px-2 shadow-lg rounded-2xl text-red-600 font-bold text-lg"
              >
                {loserRating}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-red-600 font-semibold"
              >
                -50
              </motion.span>
            </div>
          )}
        </div>
        {/* Play again */}
        <Button onClick={onPlayAgain} className="mt-2 w-full">
          Play again
        </Button>
      </div>
    </div>
  );
};

export default GameOver;