"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewGame = createNewGame;
exports.saveMove = saveMove;
exports.activeGame = activeGame;
const Game_1 = __importDefault(require("../models/Game"));
const chess_js_1 = require("chess.js");
function createNewGame(_a) {
    return __awaiter(this, arguments, void 0, function* ({ user1Id, user2Id, }) {
        const newGame = yield Game_1.default.create({
            user1: user1Id,
            user2: user2Id,
            currentState: "startpos",
            status: "active",
            moves: [],
        });
        return newGame;
    });
}
// Make sure you have chess.js to handle FEN
function saveMove(gameId, move) {
    return __awaiter(this, void 0, void 0, function* () {
        // Find the game by its ID
        const game = yield Game_1.default.findOne({ _id: gameId });
        if (!game) {
            throw new Error("Game not found");
        }
        // Initialize chess.js with the current state (FEN)
        const chess = new chess_js_1.Chess(game.currentState || "startpos");
        // Attempt the move on the board
        const moveResult = chess.move({
            from: move.from,
            to: move.to,
            promotion: move.san ? move.san : undefined,
        });
        if (!moveResult) {
            throw new Error("Invalid move");
        }
        // Determine the next move number based on the length of the existing moves
        const moveNumber = game.moves.length + 1;
        // Push the new move into the moves array
        game.moves.push({
            moveNumber,
            from: move.from,
            to: move.to,
            san: move.san, // Optional SAN (Standard Algebraic Notation)
        });
        // Update the game state (FEN string)
        game.currentState = chess.fen();
        // Save the updated game document with the new move
        yield game.save();
        return game; // Return the updated game object (optional)
    });
}
function activeGame(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const game = yield Game_1.default.findOne({
            $or: [{ user1: userId }, { user2: userId }],
            status: "active",
        });
        return game ? game.id.toString() : null;
    });
}
