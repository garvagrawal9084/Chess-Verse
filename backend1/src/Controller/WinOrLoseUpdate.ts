import { Request, Response, NextFunction } from "express";
import Game from "../models/Game";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { lookupService } from "dns";
import { ATOMIC_CHESS, FISHER_CHESS, STANDARD } from "../messages";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

export const Update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { winnerUsername, loserUsername, result, gameType } = req.body;

    if (!winnerUsername || !loserUsername) {
      res.status(400).json({ message: "Invalid usernames provided" });
      return;
    }

    if (
      result === "Stalemate" ||
      result === "Insufficient Material!" ||
      result === "Threefold Repetition!"
    ) {
      if (gameType === STANDARD) {
        await User.findOneAndUpdate(
          { username: winnerUsername },
          { $inc: { gamesDraw: 1, rating: 50 } },
          { new: true }
        );

        await User.findOneAndUpdate(
          { username: loserUsername },
          { $inc: { gamesDraw: 1, rating: 50 } },
          { new: true }
        );
      } else if (gameType === FISHER_CHESS) {
        await User.findOneAndUpdate(
          { username: winnerUsername },
          { $inc: { fisherChessDraw: 1, fisherChessRating: 50 } },
          { new: true }
        );

        await User.findOneAndUpdate(
          { username: loserUsername },
          { $inc: { FisherChessDraw: 1, fisherChessRating: 50 } },
          { new: true }
        );
      } else if (gameType === ATOMIC_CHESS) {
        await User.findOneAndUpdate(
          {
            username: winnerUsername,
          },
          {
            $inc: { atomicChessDraw: 1, atmoicChessRating: 50 },
          },
          {
            new: true,
          }
        );

        await User.findOneAndUpdate(
          { username: loserUsername },
          { $inc: { atomicChessDraw: 1, atmoicChessRating: 50 } },
          { new: true }
        );
      }

      res.status(200).json({ message: "Game was a draw, records updated" });
      return;
    }

    if (gameType === STANDARD) {
      const winnerUpdate = await User.findOneAndUpdate(
        { username: winnerUsername },
        { $inc: { gamesWon: 1, rating: 100 } },
        { new: true }
      );

      const loserUpdate = await User.findOneAndUpdate(
        { username: loserUsername },
        { $inc: { gamesLost: 1, rating: -50 } },
        { new: true }
      );

      if (!winnerUpdate || !loserUpdate) {
        res.status(404).json({ message: "One or both users not found" });
        return;
      }

      res.status(200).json({
        message: "User records updated successfully",
        winner: winnerUpdate,
        loser: loserUpdate,
      });

      return;
    } else if (gameType === FISHER_CHESS) {
      const winnerUpdate = await User.findOneAndUpdate(
        { username: winnerUsername },
        { $inc: { fisherChessWon: 1, fisherChessRating: 100 } },
        { new: true }
      );

      const loserUpdate = await User.findOneAndUpdate(
        { username: loserUsername },
        { $inc: { fisherChessLost: 1, fisherChessRating: -50 } },
        { new: true }
      );

      if (!winnerUpdate || !loserUpdate) {
        res.status(404).json({ message: "One or both users not found" });
        return;
      }

      res.status(200).json({
        message: "User records updated successfully",
        winner: winnerUpdate,
        loser: loserUpdate,
      });

      return;
    } else if (gameType === ATOMIC_CHESS) {
      const winnerUpdate = await User.findOneAndUpdate(
        { username: winnerUsername },
        { $inc: { atomicChessWon: 1, atomicChessRating: 100 } },
        { new: true }
      );

      const loserUpdate = await User.findOneAndUpdate(
        { username: loserUsername },
        { $inc: { atomicChessLoss: 1, atomicChessRating: -50 } },
        { new: true }
      );

      if (!winnerUpdate || !loserUpdate) {
        res.status(404).json({ message: "One or both users not found" });
        return;
      }

      res.status(200).json({
        message: "User records updated successfully",
        winner: winnerUpdate,
        loser: loserUpdate,
      });

      return;
    }

    // Ensure function explicitly returns void
  } catch (error) {
    console.error("Error updating win/loss records:", error);
    res.status(500).json({ message: "Server error" });
    return; // Ensure function explicitly returns void
  }
};

export const getRating = async ({
  winnerUsername,
  loserUsername,
}: {
  winnerUsername: string;
  loserUsername: string;
}) => {
  try {
    const winnerUser = await User.findOne({ username: winnerUsername });
    const LoserUser = await User.findOne({ username: loserUsername });

    console.log(`${winnerUser} and ${LoserUser} from win or lose`);

    if (!winnerUser || !LoserUser) {
      throw new Error("One or both users not found");
    }

    return { WinnerRating: winnerUser.rating, LoserRating: LoserUser.rating };
  } catch (error) {
    console.log("Error Getting Rating records:", error);
  }
};

export const getFisherRating = async ({
  winnerUsername,
  loserUsername,
}: {
  winnerUsername: string;
  loserUsername: string;
}) => {
  try {
    const winnerUser = await User.findOne({ username: winnerUsername });
    const LoserUser = await User.findOne({ username: loserUsername });

    return {
      WinnerRating: winnerUser?.fisherChessRating,
      LoserRating: LoserUser?.fisherChessRating,
    };
  } catch (error) {
    console.log("Error Getting Rating records:", error);
  }
};

export const getAtomicRating = async ({
  winnerUsername,
  loserUsername,
}: {
  winnerUsername: string;
  loserUsername: string;
}) => {
  try {
    const winnerUser = await User.findOne({ username: winnerUsername });
    const LoserUser = await User.findOne({ username: loserUsername });

    return {
      WinnerRating: winnerUser?.atomicChessRating,
      LoserRating: LoserUser?.atomicChessRating,
    };
  } catch (error) {
    console.log("Error Getting Rating records:", error);
  }
};
