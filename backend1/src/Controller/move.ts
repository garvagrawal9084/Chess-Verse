import mongoose from "mongoose";
import Game from "../models/Game";
import { Chess } from "chess.js";

export async function createNewGame({
  user1Id,
  user2Id,
}: {
  user1Id: string;
  user2Id: string;
}) {
  const newGame = await Game.create({
    user1: user1Id,
    user2: user2Id,
    currentState: "startpos",
    status: "active",
    moves: [],
  });

  return newGame;
}

// Make sure you have chess.js to handle FEN

export async function saveMove(
  gameId: string,
  move: { from: string; to: string; san?: string }
) {
  // Find the game by its ID
  const game = await Game.findOne({ _id: gameId });

  if (!game) {
    throw new Error("Game not found");
  }

  // Initialize chess.js with the current state (FEN)
  const chess = new Chess(game.currentState || "startpos");

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
  await game.save();

  return game; // Return the updated game object (optional)
}

export async function activeGame(userId: string) {
  const game = await Game.findOne({
    $or: [{ user1: userId }, { user2: userId }],
    status: "active",
  });

  return game ? game.id.toString() : null;
}
