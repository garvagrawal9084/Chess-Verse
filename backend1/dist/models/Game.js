"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moveSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, auto: true }, // Auto generate _id for each move
    moveNumber: { type: Number, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    san: { type: String },
}, { _id: true } // Ensure the _id field is generated automatically for each move
);
const gameSchema = new mongoose_1.default.Schema({
    user1: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    user2: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    currentState: { type: String },
    status: {
        type: String,
        enum: ["active", "finished", "disconnected"],
        default: "active",
    },
    winner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    moves: [moveSchema], // Embed moves as subdocuments
}, { timestamps: true });
const Game = mongoose_1.default.model("Game", gameSchema);
exports.default = Game;
