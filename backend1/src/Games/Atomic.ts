import { Chess, Move, Square } from "chess.js";

export class AtomicChess extends Chess {
  makeAtomicMove(
    move: string | { from: string; to: string; promotion?: string }
  ): Move | null {
    // Determine the source square from the move
    const fromSquare: Square =
      typeof move === "string"
        ? (move.slice(0, 2) as Square)
        : (move.from as Square);

    // Check if there's a piece at the source square
    const piece = this.get(fromSquare);
    if (!piece) {
      console.error(`❌ Error: No piece at ${fromSquare}. Move invalid.`);
      return null;
    }

    // Store current position in case we need to revert
    const previousFen = this.fen();

    // Execute the move using the parent class method
    const moveResult = super.move(move);
    if (!moveResult) return null;

    // If a capture occurred, trigger explosion logic
    if (moveResult.captured) {
      try {
        // Perform explosion on the destination square; also pass the source
        this.explode(moveResult.to as Square, fromSquare);

        // Only reload once here - no need to reload in explode method
        this.load(this.fen());
      } catch (error) {
        console.error("❌ Error during explosion:", error);
        this.load(previousFen); // Revert if explosion fails
        return null;
      }
    }

    return moveResult;
  }

  private explode(targetSquare: Square, capturingSquare: Square): void {
    // Store all squares that will have pieces removed
    const squaresToRemove: Square[] = [targetSquare]; // Include the capture square

    // Get and add adjacent squares with non-king pieces
    const adjacentSquares = this.getAdjacentSquares(targetSquare);

    // Check each adjacent square
    for (const sq of adjacentSquares) {
      const piece = this.get(sq);

      if (piece && piece.type !== "k") {
        squaresToRemove.push(sq);
      }
    }

    // Also check the capturing piece if it's still on the board
    // In atomic chess, the capturing piece also explodes
    if (capturingSquare !== targetSquare) {
      squaresToRemove.push(capturingSquare);
    }

    // Now actually remove all pieces
    for (const sq of squaresToRemove) {
      this.remove(sq);
    }

    // Only reload once at the end
  }


  private getAdjacentSquares(square: Square): Square[] {
    const file = square.charAt(0);
    const rank = parseInt(square.charAt(1));
    const adjacentSquares: Square[] = [];
    const offsets = [-1, 0, 1];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const fileIndex = files.indexOf(file);

    offsets.forEach((df) => {
      offsets.forEach((dr) => {
        if (df === 0 && dr === 0) return; // Skip the original square
        const newFileIndex = fileIndex + df;
        const newRank = rank + dr;
        if (
          newFileIndex >= 0 &&
          newFileIndex < 8 &&
          newRank >= 1 &&
          newRank <= 8
        ) {
          const newSquare = (files[newFileIndex] + newRank) as Square;
          adjacentSquares.push(newSquare);
        }
      });
    });

    return adjacentSquares;
  }

  // Helper method to check if a king is missing (game over condition in Atomic Chess)
  private isKingCaptured(): boolean {
    const kings = this.board()
      .flat()
      .filter((p) => p && p.type === "k");
    return kings.length < 2;
  }

  isKingExplodedAfterMove(
    move: string | { from: string; to: string; promotion?: string }
  ): boolean {
    const currentFen = this.fen();
    const result = super.move(move);
    if (!result) {
      return false;
    }
    const kingCaptured = this.isKingCaptured();
    this.load(currentFen);
    return kingCaptured;
  }
}
