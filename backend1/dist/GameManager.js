"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const standard_1 = require("./Games/standard");
const Fisher_1 = require("./Games/Fisher");
const AtomicChess_1 = require("./Games/AtomicChess");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
        // TODO: Clean up or terminate games involving this socket.
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                console.log("Game initialization request:", message.gameType);
                const gameType = message.gameType;
                console.log("", gameType);
                if (this.pendingUser) {
                    // Pair the pending user with the current socket
                    const { socket: pendingSocket, gameType: pendingGameType } = this.pendingUser;
                    if (gameType !== pendingGameType) {
                        console.log("Game types don't match. Waiting for the right pair.");
                        return;
                    }
                    let game;
                    if (gameType === messages_1.FISHER_CHESS) {
                        game = new Fisher_1.FischerChess(pendingSocket, socket);
                    }
                    else if (gameType === messages_1.ATOMIC_CHESS) {
                        game = new AtomicChess_1.AtomicGame(pendingSocket, socket);
                    }
                    else {
                        game = new standard_1.StandardChess(pendingSocket, socket);
                    }
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = { socket, gameType };
                }
            }
            if (message.type === messages_1.MOVE) {
                console.log("Move request received");
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("Executing move...");
                    game.makeMove(socket, message.payload.move);
                }
            }
            if (message.type === messages_1.VALID_MOVES) {
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.handleValidMoveRequest(socket, message.payload.square);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
