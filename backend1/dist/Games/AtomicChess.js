"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomicGame = void 0;
const Game_1 = require("../Game");
const messages_1 = require("../messages");
class AtomicGame extends Game_1.Game {
    constructor(player1, player2) {
        console.log("INSIDE ATOMIC GAME");
        const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        // Pass the ATOMIC_CHESS game type to the parent constructor
        // This will initialize the board correctly as AtomicChess
        super(player1, player2, fen, messages_1.ATOMIC_CHESS);
        // No need to re-initialize the board here
        // The parent Game class will create the AtomicChess instance based on the game type
        console.log(`ATOMIC GAME initialized with board: ${this.board.constructor.name}`);
        // In the Game constructor after initialization
        console.log("Board type created:", this.board.constructor.name);
        // In the makeMove method before move execution
        console.log("Current board state:", this.board.ascii());
        console.log("Board object type:", this.board.constructor.name);
    }
}
exports.AtomicGame = AtomicGame;
