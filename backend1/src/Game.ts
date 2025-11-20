import { WebSocket } from "ws";
import { Chess } from "chess.js";
import {
  ATOMIC_CHESS,
  FISHER_CHESS,
  GAME_OVER,
  INIT_GAME,
  MOVE,
  MOVE_PLAYED,
  STANDARD,
  VALID_MOVES,
} from "./messages";
import { z } from "zod";
import { getAtomicRating, getFisherRating, getRating } from "./Controller/WinOrLoseUpdate";
import { AtomicChess } from "./Games/Atomic";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private moveHistory: { from: string; to: string }[] = [];
  private player1Name: string;
  private player2Name: string;
  private gameType: string;

  constructor(
    player1: WebSocket,
    player2: WebSocket,
    fen: string,
    game: string
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameType = game;

    // ✅ Initialize correct chess variant
    if (game === ATOMIC_CHESS) {
      this.board = new AtomicChess(fen);
    } else {
      this.board = new Chess(fen);
    }

    console.log("Initialized game with FEN:", this.board.fen());

    // ✅ Store player names
    this.player1Name = (player1 as any).username;
    this.player2Name = (player2 as any).username;

    this.initPlayers({
      player1Name: this.player1Name,
      player2Name: this.player2Name,
      gameType: game,
    });
  }

  private async initPlayers({
    player1Name,
    player2Name,
    gameType,
  }: {
    player1Name: string;
    player2Name: string;
    gameType: string;
  }) {
    let player1Rating = 0;
    let player2Rating = 0;

    if (gameType === STANDARD) {
      const Rating: any = await getRating({
        winnerUsername: player1Name,
        loserUsername: player2Name,
      });
      player1Rating = Rating?.WinnerRating ?? 0;
      player2Rating = Rating?.LoserRating ?? 0;
    } else if (gameType === FISHER_CHESS) {
      const Rating: any = await getFisherRating({
        winnerUsername: player1Name,
        loserUsername: player2Name,
      });
      player1Rating = Rating?.WinnerRating ?? 0;
      player2Rating = Rating?.LoserRating ?? 0;
    }else if (gameType === ATOMIC_CHESS){
      const Rating : any = await getAtomicRating({
        winnerUsername : player1Name,
        loserUsername : player2Name,
      })
      player1Rating = Rating?.WinnerRating ?? 0;
      player2Rating = Rating?.LoserRating ?? 0;
      console.log("PLayer 1  rating " , player1Rating )
      console.log("PLayer 2  rating " , player2Rating )
    }

    // ✅ Send game initialization data to both players
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          opponent: this.player2Name,
          fen: this.board.fen(),
          player1Rating,
          player2Rating,
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          opponent: this.player1Name,
          fen: this.board.fen(),
          player1Rating,
          player2Rating,
        },
      })
    );
  }

  private moveSchema = z.object({
    from: z
      .string()
      .length(2)
      .regex(/^[a-h][1-8]$/, "Invalid chess square"),
    to: z
      .string()
      .length(2)
      .regex(/^[a-h][1-8]$/, "Invalid chess square"),
  });

  getValidMoves(square: string): string[] {
    return this.board
      .moves({ verbose: true })
      .filter((move) => move.from === square)
      .map((move) => move.to);
  }

  handleValidMoveRequest(socket: WebSocket, square: string) {
    const validMoves = this.getValidMoves(square);
    socket.send(
      JSON.stringify({ type: VALID_MOVES, payload: { square, validMoves } })
    );
  }

  async makeMove(socket: WebSocket, move: { from: string; to: string }) {
    const validation = this.moveSchema.safeParse(move);
    if (!validation.success) {
      console.log("Invalid move format:", validation.error.errors);
      socket.send(
        JSON.stringify({ type: "ERROR", payload: "Invalid move format" })
      );
      return;
    }

    // ✅ Ensure correct player makes a move
    if (
      (this.board.turn() === "w" && socket !== this.player1) ||
      (this.board.turn() === "b" && socket !== this.player2)
    ) {
      console.log("Wrong player's turn, move rejected.");
      socket.send(JSON.stringify({ type: "ERROR", payload: "Not your turn" }));
      return;
    }

    let moveResult;
    if (this.gameType === ATOMIC_CHESS) {
      moveResult = (this.board as AtomicChess).makeAtomicMove(move);
    } else {
      moveResult = this.board.move(move);
    }

    if (!moveResult) {
      console.log("Invalid move attempted:", move);
      socket.send(JSON.stringify({ type: "ERROR", payload: "Invalid move" }));
      return;
    }

    this.moveHistory.push(move);

    const updatedFen = this.board.fen() ;
    console.log("updated Fen" , updatedFen) ;

    // ✅ Notify both players of the move
    const movePayload = JSON.stringify({ type: MOVE, payload: move , fen : updatedFen });
    console.log("movePayload" , movePayload ) ;
    this.player1.send(movePayload);
    this.player2.send(movePayload);

    const historyPayload = JSON.stringify({
      type: MOVE_PLAYED,
      payload: { history: this.moveHistory },
    });
    this.player1.send(historyPayload);
    this.player2.send(historyPayload);

    await this.checkGameOver();
  }

  private async checkGameOver() {
    if (!this.board.isGameOver()) return;

    console.log("Game Over condition met");

    let reason = "Unknown";
    if (this.board.isCheckmate()) reason = "Checkmate";
    else if (this.board.isStalemate()) reason = "Stalemate";
    else if (this.board.isInsufficientMaterial())
      reason = "Insufficient Material";
    else if (this.board.isThreefoldRepetition())
      reason = "Threefold Repetition";
    else if (this.board.isDraw()) reason = "50-Move Rule or Other Draw";

    let winner: WebSocket | null = null;
    let loser: WebSocket | null = null;

    if (reason === "Checkmate") {
      winner = this.board.turn() === "w" ? this.player2 : this.player1;
      loser = this.board.turn() === "w" ? this.player1 : this.player2;
    }

    const winnerName = winner ? (winner as any).username : "No one";
    const loserName = loser ? (loser as any).username : "No one";

    console.log("Winner:", winnerName, "Loser:", loserName, "Reason:", reason);

    const Rating: any = await getRating({
      winnerUsername: winnerName,
      loserUsername: loserName,
    });

    const winnerRating = Rating?.WinnerRating ?? 0;
    const loserRating = Rating?.LoserRating ?? 0;

    console.log(`${winnerRating} and ${loserRating} from Game.ts`);

    // ✅ Notify players of game result
    const gameOverPayload = JSON.stringify({
      type: GAME_OVER,
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
  }
}
