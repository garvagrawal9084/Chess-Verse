import { Game } from "../Game";
import { WebSocket } from "ws";
import { STANDARD } from "../messages";

export class StandardChess extends Game {
  constructor(player1: WebSocket, player2: WebSocket) {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    super(player1, player2, fen, STANDARD); // No FEN, uses default chess setup
  }
}
