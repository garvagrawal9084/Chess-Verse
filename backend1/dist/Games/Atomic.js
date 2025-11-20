"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomicChess = void 0;
const chess_js_1 = require("chess.js");
class AtomicChess extends chess_js_1.Chess {
    makeAtomicMove(move) {
        console.log("Attempting move:", move);
        // Determine the source square from the move
        const fromSquare = typeof move === "string"
            ? move.slice(0, 2)
            : move.from;
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
        if (!moveResult)
            return null;
        // If a capture occurred, trigger explosion logic
        if (moveResult.captured) {
            console.log("💥 Capture detected:", moveResult);
            try {
                // Perform explosion on the destination square; also pass the source
                this.explode(moveResult.to, fromSquare);
                // Only reload once here - no need to reload in explode method
                this.load(this.fen());
                console.log("📢 Board updated after explosion. New FEN:", this.fen());
            }
            catch (error) {
                console.error("❌ Error during explosion:", error);
                this.load(previousFen); // Revert if explosion fails
                return null;
            }
        }
        return moveResult;
    }
    explode(targetSquare, capturingSquare) {
        console.log("💥 Exploding at:", targetSquare);
        // Store all squares that will have pieces removed
        const squaresToRemove = [targetSquare]; // Include the capture square
        // Get and add adjacent squares with non-king pieces
        const adjacentSquares = this.getAdjacentSquares(targetSquare);
        console.log("Adjacent squares:", adjacentSquares);
        // Check each adjacent square
        for (const sq of adjacentSquares) {
            const piece = this.get(sq);
            console.log(`Piece at ${sq}:`, piece);
            if (piece && piece.type !== "k") {
                console.log(`🔥 Marking for removal: ${sq} (${piece.type})`);
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
            console.log(`🗑 Removing piece at ${sq}`);
            this.remove(sq);
        }
        // Only reload once at the end
        console.log("FEN after explosion:", this.fen());
    }
    getAdjacentSquares(square) {
        const file = square.charAt(0);
        const rank = parseInt(square.charAt(1));
        const adjacentSquares = [];
        const offsets = [-1, 0, 1];
        const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
        const fileIndex = files.indexOf(file);
        offsets.forEach((df) => {
            offsets.forEach((dr) => {
                if (df === 0 && dr === 0)
                    return; // Skip the original square
                const newFileIndex = fileIndex + df;
                const newRank = rank + dr;
                if (newFileIndex >= 0 &&
                    newFileIndex < 8 &&
                    newRank >= 1 &&
                    newRank <= 8) {
                    const newSquare = (files[newFileIndex] + newRank);
                    adjacentSquares.push(newSquare);
                }
            });
        });
        return adjacentSquares;
    }
    // Helper method to check if a king is missing (game over condition in Atomic Chess)
    isKingCaptured() {
        const kings = this.board()
            .flat()
            .filter((p) => p && p.type === "k");
        return kings.length < 2;
    }
    isKingExplodedAfterMove(move) {
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
exports.AtomicChess = AtomicChess;
