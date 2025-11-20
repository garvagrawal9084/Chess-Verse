import { Game } from "../Game";
import { WebSocket } from "ws";
import { generateChess960FEN } from "../FisherGenerator";
import { FISHER_CHESS } from "../messages";

export class FischerChess extends Game {
  constructor(player1: WebSocket, player2: WebSocket) {
    const fen = generateChess960FEN(); // Generate FEN once
    console.log("Generated Fischer Random FEN:", fen); // Debugging log
    super(player1, player2, fen, FISHER_CHESS); // Pass the same FEN
  }
}
