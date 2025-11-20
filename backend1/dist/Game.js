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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
const zod_1 = require("zod");
const WinOrLoseUpdate_1 = require("./Controller/WinOrLoseUpdate");
const Atomic_1 = require("./Games/Atomic");
class Game {
    constructor(player1, player2, fen, game) {
        this.moveHistory = [];
        this.moveSchema = zod_1.z.object({
            from: zod_1.z
                .string()
                .length(2)
                .regex(/^[a-h][1-8]$/, "Invalid chess square"),
            to: zod_1.z
                .string()
                .length(2)
                .regex(/^[a-h][1-8]$/, "Invalid chess square"),
        });
        this.player1 = player1;
        this.player2 = player2;
        this.gameType = game;
        // ✅ Initialize correct chess variant
        if (game === messages_1.ATOMIC_CHESS) {
            this.board = new Atomic_1.AtomicChess(fen);
        }
        else {
            this.board = new chess_js_1.Chess(fen);
        }
        console.log("Initialized game with FEN:", this.board.fen());
        // ✅ Store player names
        this.player1Name = player1.username;
        this.player2Name = player2.username;
        this.initPlayers({
            player1Name: this.player1Name,
            player2Name: this.player2Name,
            gameType: game,
        });
    }
    initPlayers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ player1Name, player2Name, gameType, }) {
            var _b, _c, _d, _e, _f, _g;
            let player1Rating = 0;
            let player2Rating = 0;
            if (gameType === messages_1.STANDARD) {
                const Rating = yield (0, WinOrLoseUpdate_1.getRating)({
                    winnerUsername: player1Name,
                    loserUsername: player2Name,
                });
                player1Rating = (_b = Rating === null || Rating === void 0 ? void 0 : Rating.WinnerRating) !== null && _b !== void 0 ? _b : 0;
                player2Rating = (_c = Rating === null || Rating === void 0 ? void 0 : Rating.LoserRating) !== null && _c !== void 0 ? _c : 0;
            }
            else if (gameType === messages_1.FISHER_CHESS) {
                const Rating = yield (0, WinOrLoseUpdate_1.getFisherRating)({
                    winnerUsername: player1Name,
                    loserUsername: player2Name,
                });
                player1Rating = (_d = Rating === null || Rating === void 0 ? void 0 : Rating.WinnerRating) !== null && _d !== void 0 ? _d : 0;
                player2Rating = (_e = Rating === null || Rating === void 0 ? void 0 : Rating.LoserRating) !== null && _e !== void 0 ? _e : 0;
            }
            else if (gameType === messages_1.ATOMIC_CHESS) {
                const Rating = yield (0, WinOrLoseUpdate_1.getAtomicRating)({
                    winnerUsername: player1Name,
                    loserUsername: player2Name,
                });
                player1Rating = (_f = Rating === null || Rating === void 0 ? void 0 : Rating.WinnerRating) !== null && _f !== void 0 ? _f : 0;
                player2Rating = (_g = Rating === null || Rating === void 0 ? void 0 : Rating.LoserRating) !== null && _g !== void 0 ? _g : 0;
                console.log("PLayer 1  rating ", player1Rating);
                console.log("PLayer 2  rating ", player2Rating);
            }
            // ✅ Send game initialization data to both players
            this.player1.send(JSON.stringify({
                type: messages_1.INIT_GAME,
                payload: {
                    color: "white",
                    opponent: this.player2Name,
                    fen: this.board.fen(),
                    player1Rating,
                    player2Rating,
                },
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.INIT_GAME,
                payload: {
                    color: "black",
                    opponent: this.player1Name,
                    fen: this.board.fen(),
                    player1Rating,
                    player2Rating,
                },
            }));
        });
    }
    getValidMoves(square) {
        return this.board
            .moves({ verbose: true })
            .filter((move) => move.from === square)
            .map((move) => move.to);
    }
    handleValidMoveRequest(socket, square) {
        const validMoves = this.getValidMoves(square);
        socket.send(JSON.stringify({ type: messages_1.VALID_MOVES, payload: { square, validMoves } }));
    }
    makeMove(socket, move) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = this.moveSchema.safeParse(move);
            if (!validation.success) {
                console.log("Invalid move format:", validation.error.errors);
                socket.send(JSON.stringify({ type: "ERROR", payload: "Invalid move format" }));
                return;
            }
            // ✅ Ensure correct player makes a move
            if ((this.board.turn() === "w" && socket !== this.player1) ||
                (this.board.turn() === "b" && socket !== this.player2)) {
                console.log("Wrong player's turn, move rejected.");
                socket.send(JSON.stringify({ type: "ERROR", payload: "Not your turn" }));
                return;
            }
            let moveResult;
            if (this.gameType === messages_1.ATOMIC_CHESS) {
                moveResult = this.board.makeAtomicMove(move);
            }
            else {
                moveResult = this.board.move(move);
            }
            if (!moveResult) {
                console.log("Invalid move attempted:", move);
                socket.send(JSON.stringify({ type: "ERROR", payload: "Invalid move" }));
                return;
            }
            this.moveHistory.push(move);
            const updatedFen = this.board.fen();
            console.log("updated Fen", updatedFen);
            // ✅ Notify both players of the move
            const movePayload = JSON.stringify({ type: messages_1.MOVE, payload: move, fen: updatedFen });
            console.log("movePayload", movePayload);
            this.player1.send(movePayload);
            this.player2.send(movePayload);
            const historyPayload = JSON.stringify({
                type: messages_1.MOVE_PLAYED,
                payload: { history: this.moveHistory },
            });
            this.player1.send(historyPayload);
            this.player2.send(historyPayload);
            yield this.checkGameOver();
        });
    }
    checkGameOver() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.board.isGameOver())
                return;
            console.log("Game Over condition met");
            let reason = "Unknown";
            if (this.board.isCheckmate())
                reason = "Checkmate";
            else if (this.board.isStalemate())
                reason = "Stalemate";
            else if (this.board.isInsufficientMaterial())
                reason = "Insufficient Material";
            else if (this.board.isThreefoldRepetition())
                reason = "Threefold Repetition";
            else if (this.board.isDraw())
                reason = "50-Move Rule or Other Draw";
            let winner = null;
            let loser = null;
            if (reason === "Checkmate") {
                winner = this.board.turn() === "w" ? this.player2 : this.player1;
                loser = this.board.turn() === "w" ? this.player1 : this.player2;
            }
            const winnerName = winner ? winner.username : "No one";
            const loserName = loser ? loser.username : "No one";
            console.log("Winner:", winnerName, "Loser:", loserName, "Reason:", reason);
            const Rating = yield (0, WinOrLoseUpdate_1.getRating)({
                winnerUsername: winnerName,
                loserUsername: loserName,
            });
            const winnerRating = (_a = Rating === null || Rating === void 0 ? void 0 : Rating.WinnerRating) !== null && _a !== void 0 ? _a : 0;
            const loserRating = (_b = Rating === null || Rating === void 0 ? void 0 : Rating.LoserRating) !== null && _b !== void 0 ? _b : 0;
            console.log(`${winnerRating} and ${loserRating} from Game.ts`);
            // ✅ Notify players of game result
            const gameOverPayload = JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: { winner: winnerName, reason, winnerRating, loserRating },
            });
            this.player1.send(gameOverPayload);
            this.player2.send(gameOverPayload);
            // ✅ Update win/lose records
            fetch("http://localhost:8080/update_win_lose/winlose", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    winnerUsername: winnerName,
                    loserUsername: loserName,
                    result: reason,
                    gameType: this.gameType,
                }),
            })
                .then(() => console.log("Win/lose records updated"))
                .catch((err) => console.log("Fetch error:", err));
        });
    }
}
exports.Game = Game;
