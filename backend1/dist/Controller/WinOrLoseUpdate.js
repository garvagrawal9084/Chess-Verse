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
exports.getAtomicRating = exports.getFisherRating = exports.getRating = exports.Update = void 0;
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const messages_1 = require("../messages");
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret";
const Update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { winnerUsername, loserUsername, result, gameType } = req.body;
        console.log("inside win lose update");
        console.log(winnerUsername, loserUsername);
        if (!winnerUsername || !loserUsername) {
            res.status(400).json({ message: "Invalid usernames provided" });
            return;
        }
        if (result === "Stalemate" ||
            result === "Insufficient Material!" ||
            result === "Threefold Repetition!") {
            if (gameType === messages_1.STANDARD) {
                yield User_1.default.findOneAndUpdate({ username: winnerUsername }, { $inc: { gamesDraw: 1, rating: 50 } }, { new: true });
                yield User_1.default.findOneAndUpdate({ username: loserUsername }, { $inc: { gamesDraw: 1, rating: 50 } }, { new: true });
            }
            else if (gameType === messages_1.FISHER_CHESS) {
                yield User_1.default.findOneAndUpdate({ username: winnerUsername }, { $inc: { fisherChessDraw: 1, fisherChessRating: 50 } }, { new: true });
                yield User_1.default.findOneAndUpdate({ username: loserUsername }, { $inc: { FisherChessDraw: 1, fisherChessRating: 50 } }, { new: true });
            }
            else if (gameType === messages_1.ATOMIC_CHESS) {
                yield User_1.default.findOneAndUpdate({
                    username: winnerUsername,
                }, {
                    $inc: { atomicChessDraw: 1, atmoicChessRating: 50 },
                }, {
                    new: true,
                });
                yield User_1.default.findOneAndUpdate({ username: loserUsername }, { $inc: { atomicChessDraw: 1, atmoicChessRating: 50 } }, { new: true });
            }
            res.status(200).json({ message: "Game was a draw, records updated" });
            return;
        }
        if (gameType === messages_1.STANDARD) {
            const winnerUpdate = yield User_1.default.findOneAndUpdate({ username: winnerUsername }, { $inc: { gamesWon: 1, rating: 100 } }, { new: true });
            const loserUpdate = yield User_1.default.findOneAndUpdate({ username: loserUsername }, { $inc: { gamesLost: 1, rating: -50 } }, { new: true });
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
        else if (gameType === messages_1.FISHER_CHESS) {
            const winnerUpdate = yield User_1.default.findOneAndUpdate({ username: winnerUsername }, { $inc: { fisherChessWon: 1, fisherChessRating: 100 } }, { new: true });
            const loserUpdate = yield User_1.default.findOneAndUpdate({ username: loserUsername }, { $inc: { fisherChessLost: 1, fisherChessRating: -50 } }, { new: true });
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
        else if (gameType === messages_1.ATOMIC_CHESS) {
            const winnerUpdate = yield User_1.default.findOneAndUpdate({ username: winnerUsername }, { $inc: { atomicChessWon: 1, atomicChessRating: 100 } }, { new: true });
            const loserUpdate = yield User_1.default.findOneAndUpdate({ username: loserUsername }, { $inc: { atomicChessLoss: 1, atomicChessRating: -50 } }, { new: true });
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
    }
    catch (error) {
        console.error("Error updating win/loss records:", error);
        res.status(500).json({ message: "Server error" });
        return; // Ensure function explicitly returns void
    }
});
exports.Update = Update;
const getRating = (_a) => __awaiter(void 0, [_a], void 0, function* ({ winnerUsername, loserUsername, }) {
    try {
        const winnerUser = yield User_1.default.findOne({ username: winnerUsername });
        const LoserUser = yield User_1.default.findOne({ username: loserUsername });
        console.log(`${winnerUser} and ${LoserUser} from win or lose`);
        if (!winnerUser || !LoserUser) {
            throw new Error("One or both users not found");
        }
        return { WinnerRating: winnerUser.rating, LoserRating: LoserUser.rating };
    }
    catch (error) {
        console.log("Error Getting Rating records:", error);
    }
});
exports.getRating = getRating;
const getFisherRating = (_a) => __awaiter(void 0, [_a], void 0, function* ({ winnerUsername, loserUsername, }) {
    try {
        const winnerUser = yield User_1.default.findOne({ username: winnerUsername });
        const LoserUser = yield User_1.default.findOne({ username: loserUsername });
        return {
            WinnerRating: winnerUser === null || winnerUser === void 0 ? void 0 : winnerUser.fisherChessRating,
            LoserRating: LoserUser === null || LoserUser === void 0 ? void 0 : LoserUser.fisherChessRating,
        };
    }
    catch (error) {
        console.log("Error Getting Rating records:", error);
    }
});
exports.getFisherRating = getFisherRating;
const getAtomicRating = (_a) => __awaiter(void 0, [_a], void 0, function* ({ winnerUsername, loserUsername, }) {
    try {
        const winnerUser = yield User_1.default.findOne({ username: winnerUsername });
        const LoserUser = yield User_1.default.findOne({ username: loserUsername });
        return {
            WinnerRating: winnerUser === null || winnerUser === void 0 ? void 0 : winnerUser.atomicChessRating,
            LoserRating: LoserUser === null || LoserUser === void 0 ? void 0 : LoserUser.atomicChessRating,
        };
    }
    catch (error) {
        console.log("Error Getting Rating records:", error);
    }
});
exports.getAtomicRating = getAtomicRating;
