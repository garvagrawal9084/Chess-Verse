import { useState } from "react";

const ChessRule = () => {
  const [showRules, setShowRules] = useState(true);
  return (
    <div>
      {showRules && (
        <div className="absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-center underline">Chess Rules</h2>
            <p className="mb-4">
              - Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2
              bishops, 2 knights, and 8 pawns.
              <br />- <strong>Objective:</strong> Checkmate the opponent’s king
              by putting it in a position where it cannot escape.
              <br />- <strong>Basic Moves:</strong>
              <br />
              &nbsp;&nbsp;• Pawns move forward but capture diagonally; they can
              move two squares on their first move.
              <br />
              &nbsp;&nbsp;• Rooks move in straight lines, bishops diagonally,
              and knights in an L-shape.
              <br />
              &nbsp;&nbsp;• The queen moves in any direction, and the king moves
              one square in any direction.
              <br />- <strong>Special Moves:</strong> Castling (king and rook
              move together), En Passant (special pawn capture), and Pawn
              Promotion (pawn becomes another piece if it reaches the last
              rank).
              <br />- <strong>Game End:</strong>
              <br />
              &nbsp;&nbsp;• Checkmate: The king is trapped and cannot escape.
              <br />
              &nbsp;&nbsp;• Stalemate: No legal moves, but the king is not in
              check (draw).
              <br />
              &nbsp;&nbsp;• A game can also end in a draw by agreement or
              repetition of moves.
            </p>
            <button
              onClick={() => setShowRules(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md w-full font-bold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessRule;
