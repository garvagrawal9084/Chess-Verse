import { useEffect, useState, useRef } from "react";
import { MOVE } from "../../../backend1/src/messages";
import { Square, Color, PieceSymbol } from "chess.js";
import {jwtDecode} from "jwt-decode"; // using jwt-decode for client-side token decoding

interface ChessSquare {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

interface ChessboardProps {
  chess: any;
  setBoard: any;
  socket: WebSocket;
  // Prop to receive player's color.
  playerColor: "white" | "black";
  opponent: string | null;
  player1Rating : string | null ;
  player2Rating : string | null ;
}

const Chessboard = ({
  chess,
  setBoard,
  socket,
  playerColor,
  opponent,
  player1Rating,
  player2Rating ,
}: ChessboardProps) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const moveHistoryContainer = useRef<HTMLDivElement>(null);

  // Decode the token once on mount to get the username.
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

  return (
    <div>
      {/* Opponent's Name (Top Left) */}
      <div className="mb-4 text-center text-white flex justify-start">
        <p className="text-xl font-extrabold px-4 py-2 bg-gray-700 rounded shadow-md">
          {opponent || "Waiting for opponent..."} {player2Rating || ""}
        </p>
      </div>

      {/* Chessboard */}
      <div
        className={`text-black ${playerColor === "black" ? "rotate-180" : ""}`}
      >
        {chess.board().map((row: (ChessSquare | null)[], i: number) => (
          <div key={i} className="flex">
            {row.map((square: ChessSquare | null, j: number) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                (8 - i)) as Square;
              const isHighlighted = validMoves.includes(squareRepresentation);
              return (
                <div
                  key={j}
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation);
                      // Fetch valid moves for the selected piece.
                      const moves = chess
                        .moves({ square: squareRepresentation, verbose: true })
                        .map((move: any) => move.to);
                      setValidMoves(moves);
                    } else {
                      // Send the move to the server.
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: { move: { from, to: squareRepresentation } },
                        })
                      );
                      console.log("Move sent:", {
                        from,
                        to: squareRepresentation,
                      });
                      setFrom(null);
                      setValidMoves([]);
                    }
                  }}
                  className={`w-16 h-16 flex justify-center items-center ${
                    (i + j) % 2 === 0 ? "bg-[#ebecd0]" : "bg-[#739552]"
                  } relative`}
                >
                  {isHighlighted && (
                    <div className="absolute w-5 h-5 bg-black/30 rounded-full"></div>
                  )}
                  <div className="flex justify-center h-full w-full">
                    <div className="flex flex-col justify-center">
                      {square && (
                        // For black player, counter-rotate the piece image so it remains upright.
                        <img
                          className={`w-15 h-15 ${
                            playerColor === "black" ? "rotate-180" : ""
                          }`}
                          src={`/${
                            square.color === "b"
                              ? square.type
                              : `${square.type.toUpperCase()} copy`
                          }.png`}
                          alt={square.type}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Your Name (Bottom Right) */}
      <div className="mb-4 text-center text-white flex justify-end mt-3">
        <p className="text-xl font-extrabold px-4 py-2 bg-gray-700 rounded shadow-md">
          {username || "Unknown"} {player1Rating || ""}
        </p>
      </div>
    </div>
  );
};

export default Chessboard;
