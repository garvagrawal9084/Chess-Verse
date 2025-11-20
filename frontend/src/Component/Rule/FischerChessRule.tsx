import { useState } from "react";

const FischerChessRule = () => {
  const [showRules, setShowRules] = useState(true);

  return (
    <div>
      {showRules && (
        <div className="absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-center underline">
              Fischer Random Chess Rules (Chess960)
            </h2>
            <p className="mb-4">
              - Fischer Random Chess follows the same basic rules as standard
              chess, with <b>one key difference</b>: the starting position of
              the back-rank pieces (except pawns) is randomized.
              <br />- <strong>Objective:</strong> Checkmate the opponent’s king
              just like in standard chess.
              <br />- <strong>Setup Rules:</strong>
              <br />
              &nbsp;&nbsp;• The starting position of pieces is randomized, but
              bishops must be on opposite colors.
              <br />
              &nbsp;&nbsp;• The king must always be placed between the two
              rooks.
              <br />- <strong>Basic Moves:</strong> Piece movement remains the
              same as standard chess.
              <br />- <strong>Special Rules:</strong> Castling is still allowed
              but follows special placement rules:
              <br />
              &nbsp;&nbsp;• After castling, the king and rook end up in the same
              squares as they would in standard chess.
              <br />
              &nbsp;&nbsp;• Castling conditions remain (no pieces between,
              king/rook must not have moved, no check).
              <br />- <strong>Game End:</strong>
              <br />
              &nbsp;&nbsp;• <b>Checkmate</b>: The king is trapped and cannot
              escape.
              <br />
              &nbsp;&nbsp;• <b>Stalemate</b>: No legal moves, but the king is
              not in check (draw).
              <br />
              &nbsp;&nbsp;• A game can also end in a <b>draw</b> by agreement or
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

export default FischerChessRule;
