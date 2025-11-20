import { useState, useEffect, useRef } from "react";
import { useSocket } from "../Hook/useSocket";
import { Button,  GameOver, AtomicChessRule } from ".";
import Chessboard from "./AtomicChessBoard";
import {
  INIT_GAME,
  MOVE,
  GAME_OVER,
  MOVE_PLAYED,
  ATOMIC_CHESS,
} from "../../../backend1/src/messages";
import { Chess } from "chess.js";

const AtomicChess = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [matchRequest, setMatchRequest] = useState(false);
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [moveHistory, setMoveHistory] = useState<
    { from: string; to: string }[]
  >([]);
  const [Gameover, setGameOver] = useState(false);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const movehistoryContaier = useRef<HTMLDivElement>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [winnerRating, setWinnerRating] = useState<number | null>(null);
  const [LoserRating, setLoserRating] = useState<number | null>(null);
  const [player1Rating, setPlayer1Rating] = useState<string | null>(null);
  const [player2Rating, setPlayer2Rating] = useState<string | null>(null);

  // Function to completely reset the chess instance with a new FEN
  const updateChessWithFen = (fen: string) => {
    try {
      const newChess = new Chess(fen);
      setChess(newChess);
      setBoard(newChess.board());
      console.log("Chess instance updated with FEN:", fen);
      console.log("New board state:", newChess.board());
    } catch (error) {
      console.error("Failed to update chess with FEN:", error);
    }
  };

  useEffect(() => {
    if (movehistoryContaier.current) {
      movehistoryContaier.current.scrollTop =
        movehistoryContaier.current.scrollHeight;
    }
  }, [moveHistory]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case INIT_GAME:
          console.log("Initializing game with FEN:", message.payload.fen);
          setPlayerColor(message.payload.color);
          if (message.payload.fen) {
            updateChessWithFen(message.payload.fen);
          }
          setStarted(true);
          setMatchRequest(false);
          console.log(
            `Game initialized, player color: ${message.payload.color} and opponent: ${message.payload.opponent}`
          );
          setOpponent(message.payload.opponent);
          setPlayer1Rating(message.payload.player1Rating);
          setPlayer2Rating(message.payload.player2Rating);
          break;

        case MOVE:
          const movePayload = message.payload;
          // Always use the FEN string when available as it contains the complete board state
          if (message.fen) {
            console.log("Updating board with FEN after move:", message.fen);
            updateChessWithFen(message.fen);
          } else {
            // Fallback if FEN is not provided (though it should be for atomic chess)
            console.warn(
              "No FEN provided with move message, trying to apply move directly"
            );
            const newChessInstance = new Chess(chess.fen());
            try {
              const result = newChessInstance.move(movePayload);
              if (result) {
                setChess(newChessInstance);
                setBoard(newChessInstance.board());
                console.log("Move applied locally:", movePayload);
              } else {
                console.error(
                  "Move could not be applied locally:",
                  movePayload
                );
              }
            } catch (error) {
              console.error("Error applying move:", error);
            }
          }
          break;

        case MOVE_PLAYED:
          setMoveHistory(message.payload.history);
          console.log("Move history updated", message.payload.history);
          break;

        case GAME_OVER:
          console.log("GAME OVER");
          console.log("Winner:", message.payload.winner);
          console.log("Reason:", message.payload.reason);
          setGameOver(true);
          setWinner(message.payload.winner);
          setGameResult(message.payload.reason);
          setWinnerRating(message.payload.winnerRating);
          setLoserRating(message.payload.loserRating);
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    };
  }, [socket, chess]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative">
      {/* Rules Popup */}
      <AtomicChessRule />

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="md:col-span-4 flex justify-center">
            <Chessboard
              chess={chess}
              setBoard={setBoard}
              socket={socket!}
              playerColor={playerColor}
              opponent={opponent}
              player1Rating={player1Rating}
              player2Rating={player2Rating}
            />
          </div>
          <div className="md:col-span-2">
            {!started ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Button
                  className="px-8 py-4 text-2xl font-semibold rounded bg-blue-600 hover:bg-blue-700 transition duration-300"
                  disabled={matchRequest}
                  onClick={() => {
                    if (socket) {
                      socket.send(
                        JSON.stringify({
                          type: INIT_GAME,
                          gameType: ATOMIC_CHESS,
                        })
                      );
                      setMatchRequest(true);
                    }
                  }}
                >
                  {matchRequest ? "Finding a Player..." : "Play Online"}
                </Button>
              </div>
            ) : (
              <div
                className="bg-gray-800 rounded-lg shadow-lg p-6 h-96 overflow-y-auto scroll-smooth"
                ref={movehistoryContaier}
              >
                <h3 className="text-2xl font-bold mb-4 text-center text-white">
                  Move History
                </h3>
                {moveHistory.length > 0 ? (
                  <ul className="grid grid-cols-2 text-white">
                    {moveHistory.map((move, index) => (
                      <li
                        key={index}
                        className="py-2 px-4 border-b-2 text-center"
                      >
                        <span className="font-bold">{`${move.from}->${move.to}`}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-white">No moves played yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {Gameover && (
        <GameOver
          winner={winner}
          opponent={opponent}
          playerColor={playerColor}
          result={gameResult}
          onPlayAgain={() => {
            window.location.reload();
          }}
          winnerRating={winnerRating}
          loserRating={LoserRating}
        />
      )}
    </div>
  );
};

export default AtomicChess;
