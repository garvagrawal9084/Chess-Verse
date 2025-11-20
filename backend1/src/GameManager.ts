import { WebSocket } from "ws";
import {
  INIT_GAME,
  MOVE,
  MOVE_PLAYED,
  VALID_MOVES,
  FISHER_CHESS,
  ATOMIC_CHESS,
} from "./messages";
import { StandardChess } from "./Games/standard";
import { FischerChess } from "./Games/Fisher";
import { AtomicGame } from "./Games/AtomicChess";

export class GameManager {
  private games: (StandardChess | FischerChess | AtomicGame)[];
  private pendingUser: { socket: WebSocket; gameType: string } | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    // TODO: Clean up or terminate games involving this socket.
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        console.log("Game initialization request:", message.gameType);
        const gameType = message.gameType;
        console.log("", gameType);

        if (this.pendingUser) {
          // Pair the pending user with the current socket
          const { socket: pendingSocket, gameType: pendingGameType } =
            this.pendingUser;

          if (gameType !== pendingGameType) {
            console.log("Game types don't match. Waiting for the right pair.");
            return;
          }

          let game;
          if (gameType === FISHER_CHESS) {
            game = new FischerChess(pendingSocket, socket);
          }
          else if(gameType === ATOMIC_CHESS){
            game = new AtomicGame(pendingSocket, socket);
          }
          else {
            game = new StandardChess(pendingSocket, socket);
          }

          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = { socket, gameType };
        }
      }

      if (message.type === MOVE) {
        console.log("Move request received");
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          console.log("Executing move...");
          game.makeMove(socket, message.payload.move);
        }
      }

      if (message.type === VALID_MOVES) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.handleValidMoveRequest(socket, message.payload.square);
        }
      }
    });
  }
}
