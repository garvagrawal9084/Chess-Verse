"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FischerChess = void 0;
const Game_1 = require("../Game");
const FisherGenerator_1 = require("../FisherGenerator");
const messages_1 = require("../messages");
class FischerChess extends Game_1.Game {
    constructor(player1, player2) {
        const fen = (0, FisherGenerator_1.generateChess960FEN)(); // Generate FEN once
        console.log("Generated Fischer Random FEN:", fen); // Debugging log
        super(player1, player2, fen, messages_1.FISHER_CHESS); // Pass the same FEN
    }
}
exports.FischerChess = FischerChess;
