import { Chess } from "chess.js";

export function generateChess960FEN(): string {
  let backRank: string[];

  // Generate a valid Chess960 back rank
  do {
    backRank = shuffleArray(["R", "N", "B", "Q", "K", "B", "N", "R"]);
  } while (!isValidChess960Position(backRank));

  // Construct the FEN string in the requested format:
  // Top rank: lowercase (Black’s pieces)
  // Pawn rows: fixed (pppppppp for top; PPPPPPPP for bottom)
  // Bottom rank: uppercase (White’s pieces)
  const fen =
    backRank.map((p) => p.toLowerCase()).join("") +
    "/pppppppp/8/8/8/8/PPPPPPPP/" +
    backRank.join("") +
    " w KQkq - 0 1";

  return fen;
}

/** Helper function to shuffle an array */
function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

/** Validates the back-rank pieces according to Chess960 rules */
function isValidChess960Position(backRank: string[]): boolean {
  const kingIndex = backRank.indexOf("K");
  const rookIndices = backRank
    .map((p, i) => (p === "R" ? i : -1))
    .filter((i) => i !== -1);

  // King must be between the two rooks
  if (
    rookIndices.length !== 2 ||
    !(rookIndices[0] < kingIndex && kingIndex < rookIndices[1])
  )
    return false;

  // Bishops must be on opposite-colored squares (using modulo 2 for index parity)
  const bishopIndices = backRank
    .map((p, i) => (p === "B" ? i : -1))
    .filter((i) => i !== -1);
  if (
    bishopIndices.length !== 2 ||
    bishopIndices[0] % 2 === bishopIndices[1] % 2
  )
    return false;

  return true;
}
