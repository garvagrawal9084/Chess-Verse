import { useState } from "react";

const AtomicChessRule = () => {
  const [showRules, setShowRules] = useState(true);

  return (
    <div>
      {showRules && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-center underline">
              Atomic Chess Rules
            </h2>
            <p className="mb-4 text-gray-700">
              <b>Objective:</b> Win by checkmate or by making the opponent's
              king explode.
              <br />
              <br />
              <b>Capturing and Explosions:</b>
              <br />
              • When a piece (except pawns) captures another, an explosion
              occurs.
              <br />
              • The explosion removes the captured piece and all adjacent pieces
              (except kings).
              <br />
              • Kings are immune to explosions but cannot move next to each
              other.
              <br />
              <br />
              <b>Special Rules:</b>
              <br />
              • Kings cannot move into adjacent squares.
              <br />
              • Castling is allowed if legal, but beware of explosions.
              <br />
              <br />
              <b>Game End Conditions:</b>
              <br />• <b>Checkmate:</b> The opponent’s king has no escape.
              <br />• <b>Exploded King:</b> If a king is part of an explosion,
              the game ends immediately.
              <br />• <b>Stalemate:</b> If a player has no legal moves but is
              not in check, the game is a draw.
            </p>
            <button
              onClick={() => setShowRules(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtomicChessRule;
