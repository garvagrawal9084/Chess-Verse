import { Game } from "../Game";
import { WebSocket } from "ws";
import { AtomicChess } from "./Atomic"; // Import the custom AtomicChess class
import { ATOMIC_CHESS } from "../messages";

export class AtomicGame extends Game {
  constructor(player1: WebSocket, player2: WebSocket) {
    console.log("INSIDE ATOMIC GAME");
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    // Pass the ATOMIC_CHESS game type to the parent constructor
    // This will initialize the board correctly as AtomicChess
    super(player1, player2, fen, ATOMIC_CHESS);

    // No need to re-initialize the board here
    // The parent Game class will create the AtomicChess instance based on the game type

    console.log(
      `ATOMIC GAME initialized with board: ${this.board.constructor.name}`
    );

  }
}
