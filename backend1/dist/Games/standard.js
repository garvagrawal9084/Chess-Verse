"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardChess = void 0;
const Game_1 = require("../Game");
const messages_1 = require("../messages");
class StandardChess extends Game_1.Game {
    constructor(player1, player2) {
        const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        super(player1, player2, fen, messages_1.STANDARD); // No FEN, uses default chess setup
    }
}
exports.StandardChess = StandardChess;
